import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { subActive, sign } from "../utils/helpers.js";

const router = Router();

router.post(
  "/register",
  wrap(async (req, res) => {
    const { name, phone, password, role, gst, license } = req.body;
    if (!["farmer", "trader"].includes(role)) throw new Error("અમાન્ય રોલ");
    if (!name || !phone || !password) throw new Error("બધી વિગતો ભરો");
    if (role === "trader" && (!gst || !license))
      throw new Error("GST અને લાયસન્સ જરૂરી છે");
    const u = await User.create({
      name,
      phone,
      role,
      gst,
      license,
      password: await bcrypt.hash(password, 10),
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

router.get("/me", auth(), (req, res) =>
  res.json({ ...sign(req.user).user, subActive: !!subActive(req.user) }),
);

export default router;
