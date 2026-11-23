import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { subActive, sign } from "../utils/helpers.js";
import {
  SECURITY_QUESTIONS,
  questionById,
  normalizeAnswer,
} from "../../shared/securityQuestions.mjs";

const router = Router();

const MAX_FAILS = 5; // આટલા ખોટા જવાબ પછી લોક
const LOCK_MIN = 15; // મિનિટ
const DUMMY_HASH = bcrypt.hashSync("dummy-answer", 10); // ખોટા ફોન પર પણ સમય સરખો રાખવા

// નવો/બદલેલો સુરક્ષા જવાબ તપાસી hash કરે
async function buildSecurity(secQuestion, secAnswer) {
  if (!questionById(secQuestion)) throw new Error("સુરક્ષા પ્રશ્ન પસંદ કરો");
  const norm = normalizeAnswer(secAnswer);
  if (norm.length < 3) throw new Error("સુરક્ષા જવાબ ઓછામાં ઓછો 3 અક્ષરનો લખો");
  return { secQuestion, secAnswer: await bcrypt.hash(norm, 10) };
}

router.post(
  "/register",
  wrap(async (req, res) => {
    const {
      name,
      phone,
      password,
      role,
      gst,
      license,
      secQuestion,
      secAnswer,
    } = req.body;
    if (!["farmer", "trader"].includes(role)) throw new Error("અમાન્ય રોલ");
    if (!name || !phone || !password) throw new Error("બધી વિગતો ભરો");
    if (role === "trader" && (!gst || !license))
      throw new Error("GST અને લાયસન્સ જરૂરી છે");
    const sec = await buildSecurity(secQuestion, secAnswer);
    const u = await User.create({
      name,
      phone,
      role,
      gst,
      license,
      password: await bcrypt.hash(password, 10),
      ...sec,
    });
    res.json(sign(u));
  }),
);

router.post(
  "/login",
  wrap(async (req, res) => {
    const { phone, password } = req.body;
    const u = await User.findOne({ phone: String(phone || "") });
    if (
      !u ||
      !password ||
      !(await bcrypt.compare(String(password), u.password))
    )
      throw new Error("ફોન અથવા પાસવર્ડ ખોટો છે");
    if (u.blocked)
      throw new Error("આ ખાતું બ્લોક કરેલું છે, એડમિનનો સંપર્ક કરો");
    res.json(sign(u));
  }),
);

// ---- પાસવર્ડ ભુલાઈ ગયો: સુરક્ષા પ્રશ્નથી રીસેટ ----

// સ્ટેપ 1: મોબાઈલ નંબર આપો → તે ખાતાનો સુરક્ષા પ્રશ્ન મળે
router.post(
  "/forgot/question",
  wrap(async (req, res) => {
    const phone = String(req.body.phone || "").trim();
    if (!phone) throw new Error("મોબાઈલ નંબર લખો");
    const u = await User.findOne({ phone });
    if (u && u.role === "admin") throw new Error("આ ખાતા માટે રીસેટ શક્ય નથી");
    if (u && !questionById(u.secQuestion))
      throw new Error("આ ખાતામાં સુરક્ષા પ્રશ્ન સેટ નથી, એડમિનનો સંપર્ક કરો");
    // ખાતું ન હોય તો પણ એક પ્રશ્ન બતાવાય, જેથી નંબર શોધી ન શકાય
    const q =
      questionById(u?.secQuestion) ||
      SECURITY_QUESTIONS[
        [...phone].reduce((a, c) => a + c.charCodeAt(0), 0) %
          SECURITY_QUESTIONS.length
      ];
    res.json({ question: q.text });
  }),
);

// સ્ટેપ 2: જવાબ + નવો પાસવર્ડ
router.post(
  "/forgot/reset",
  wrap(async (req, res) => {
    const phone = String(req.body.phone || "").trim();
    const { answer, password } = req.body;
    if (!phone || !answer || !password) throw new Error("બધી વિગતો ભરો");
    if (String(password).length < 8)
      throw new Error("પાસવર્ડ ઓછામાં ઓછો 8 અક્ષરનો રાખો");

    const u = await User.findOne({ phone }).select("+secAnswer");
    const bad = new Error("સુરક્ષા જવાબ ખોટો છે");

    if (!u || u.role === "admin" || !u.secAnswer) {
      await bcrypt.compare(normalizeAnswer(answer), DUMMY_HASH);
      throw bad;
    }
    if (u.resetLockUntil && u.resetLockUntil > new Date())
      throw new Error(
        `ઘણા ખોટા પ્રયાસ થયા છે, ${LOCK_MIN} મિનિટ પછી ફરી પ્રયાસ કરો`,
      );

    const ok = await bcrypt.compare(normalizeAnswer(answer), u.secAnswer);
    if (!ok) {
      u.resetFails = (u.resetFails || 0) + 1;
      if (u.resetFails >= MAX_FAILS) {
        u.resetFails = 0;
        u.resetLockUntil = new Date(Date.now() + LOCK_MIN * 60 * 1000);
      }
      await u.save();
      throw bad;
    }

    u.password = await bcrypt.hash(String(password), 10);
    u.resetFails = 0;
    u.resetLockUntil = undefined;
    await u.save();
    res.json({ msg: "પાસવર્ડ બદલાઈ ગયો, હવે નવા પાસવર્ડથી લોગિન કરો" });
  }),
);

// લોગિન કરેલ યુઝર સુરક્ષા પ્રશ્ન સેટ/બદલે (જૂના યુઝર માટે પણ). હાલનો પાસવર્ડ જરૂરી
router.put(
  "/security",
  auth(),
  wrap(async (req, res) => {
    const { currentPassword, secQuestion, secAnswer } = req.body;
    const me = await User.findById(req.user._id);
    if (
      !currentPassword ||
      !(await bcrypt.compare(String(currentPassword), me.password))
    )
      throw new Error("હાલનો પાસવર્ડ ખોટો છે");
    Object.assign(me, await buildSecurity(secQuestion, secAnswer));
    await me.save();
    res.json({ msg: "સુરક્ષા પ્રશ્ન સેવ થયો" });
  }),
);

router.get("/me", auth(), (req, res) =>
  res.json({ ...sign(req.user).user, subActive: !!subActive(req.user) }),
);

export default router;
