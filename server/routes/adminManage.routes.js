// import { Router } from "express";
// import bcrypt from "bcryptjs";
// import auth from "../middleware/auth.js";
// import wrap from "../middleware/wrap.js";
// import {
//   User,
//   Crop,
//   Rate,
//   Patti,
//   Bid,
//   Bill,
//   News,
//   Media,
//   Ad,
// } from "../models/index.js";

// const router = Router();
// const A = auth("admin");
// const MANAGED = ["farmer", "trader", "agent"];
// const LOCKED = ["auction", "sold"]; // હરાજી ચાલુ/પૂરી થયેલા માલમાં ફેરફાર નહીં
// const num = (v, name) => {
//   const n = Number(v);
//   if (v === "" || v === null || !(n >= 0))
//     throw new Error(name + " સાચો નંબર લખો");
//   return n;
// };

// // ---- બજાર ભાવ ----
// router.put(
//   "/admin/rates/:id",
//   A,
//   wrap(async (req, res) => {
//     const { crop, min, max, date } = req.body;
//     if (!crop) throw new Error("પાક પસંદ કરો");
//     const lo = num(min, "ન્યૂનતમ ભાવ"),
//       hi = num(max, "મહત્તમ ભાવ");
//     if (hi < lo) throw new Error("મહત્તમ ભાવ ન્યૂનતમ કરતાં ઓછો ન હોઈ શકે");
//     if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))
//       throw new Error("તારીખ સાચી લખો");
//     const r = await Rate.findByIdAndUpdate(req.params.id, {
//       crop,
//       min: lo,
//       max: hi,
//       ...(date ? { date } : {}),
//     });
//     if (!r) throw new Error("ભાવ મળ્યો નહીં");
//     res.json({ msg: "ભાવ સુધાર્યો" });
//   }),
// );
// router.delete(
//   "/admin/rates/:id",
//   A,
//   wrap(async (req, res) => {
//     await Rate.findByIdAndDelete(req.params.id);
//     res.json({ msg: "ભાવ કાઢી નાખ્યો" });
//   }),
// );

// // ---- સમાચાર ----
// router.put(
//   "/admin/news/:id",
//   A,
//   wrap(async (req, res) => {
//     const title = String(req.body.title || "").trim();
//     if (!title) throw new Error("શીર્ષક લખો");
//     const n = await News.findByIdAndUpdate(req.params.id, {
//       title,
//       body: req.body.body || "",
//     });
//     if (!n) throw new Error("સમાચાર મળ્યા નહીં");
//     res.json({ msg: "સમાચાર સુધાર્યા" });
//   }),
// );

// // ---- ગેલેરી (ફોટો: ફક્ત શીર્ષક, વીડિયો: શીર્ષક + લિંક) ----
// router.put(
//   "/admin/media/:id",
//   A,
//   wrap(async (req, res) => {
//     const m = await Media.findById(req.params.id);
//     if (!m) throw new Error("આઇટમ મળી નહીં");
//     m.title = String(req.body.title || "").trim();
//     if (m.type === "video" && req.body.url) {
//       if (!/^https?:\/\//.test(req.body.url))
//         throw new Error("YouTube લિંક સાચી નાખો");
//       m.url = req.body.url;
//     }
//     await m.save();
//     res.json({ msg: "ગેલેરી આઇટમ સુધારી" });
//   }),
// );

// // ---- જાહેરાતો ----
// router.put(
//   "/admin/ads/:id",
//   A,
//   wrap(async (req, res) => {
//     const { title, company, text, active } = req.body;
//     if (!String(title || "").trim()) throw new Error("શીર્ષક લખો");
//     const a = await Ad.findByIdAndUpdate(req.params.id, {
//       title,
//       company,
//       text,
//       active: !!active,
//     });
//     if (!a) throw new Error("જાહેરાત મળી નહીં");
//     res.json({ msg: "જાહેરાત સુધારી" });
//   }),
// );

// // ---- માલ (હરાજી ચાલુ/પૂરી થઈ હોય તો નહીં) ----
// router.put(
//   "/admin/crops/:id",
//   A,
//   wrap(async (req, res) => {
//     const c = await Crop.findById(req.params.id);
//     if (!c) throw new Error("માલ મળ્યો નહીં");
//     if (LOCKED.includes(c.status))
//       throw new Error("હરાજી ચાલુ કે પૂરી થયેલા માલમાં ફેરફાર ન થઈ શકે");
//     const { name, grade, man, basePrice, shed } = req.body;
//     if (name) c.name = name;
//     if (grade) c.grade = grade;
//     if (man !== undefined && man !== "") {
//       if (!(Number(man) > 0)) throw new Error("મણ સાચા લખો");
//       c.man = Number(man);
//     }
//     if (basePrice !== undefined && basePrice !== "") {
//       if (!(Number(basePrice) > 0)) throw new Error("ભાવ સાચો લખો");
//       c.basePrice = Number(basePrice);
//     }
//     if (shed !== undefined) c.shed = shed;
//     await c.save();
//     res.json({ msg: "માલની વિગત સુધારી" });
//   }),
// );
// router.delete(
//   "/admin/crops/:id",
//   A,
//   wrap(async (req, res) => {
//     const c = await Crop.findById(req.params.id);
//     if (!c) throw new Error("માલ મળ્યો નહીં");
//     if (LOCKED.includes(c.status))
//       throw new Error("હરાજી ચાલુ કે પૂરી થયેલો માલ ડિલીટ ન થઈ શકે");
//     await c.deleteOne();
//     res.json({ msg: "માલ કાઢી નાખ્યો" });
//   }),
// );

// // ---- કમિશન એજન્ટ ----
// router.put(
//   "/admin/agents/:id",
//   A,
//   wrap(async (req, res) => {
//     const u = await User.findOne({ _id: req.params.id, role: "agent" });
//     if (!u) throw new Error("એજન્ટ મળ્યો નહીં");
//     const { name, shopName, phone, password } = req.body;
//     if (!name || !shopName || !phone)
//       throw new Error("નામ, દુકાન અને મોબાઈલ જરૂરી છે");
//     if (await User.findOne({ phone, _id: { $ne: u._id } }))
//       throw new Error("આ મોબાઈલ નંબર પહેલેથી વપરાયેલો છે");
//     u.name = name;
//     u.shopName = shopName;
//     u.phone = phone;
//     if (password) {
//       if (password.length < 6)
//         throw new Error("પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો રાખો");
//       u.password = await bcrypt.hash(password, 10);
//     }
//     await u.save();
//     res.json({ msg: "એજન્ટની વિગત સુધારી" });
//   }),
// );
// router.delete(
//   "/admin/agents/:id",
//   A,
//   wrap(async (req, res) => {
//     const u = await User.findOne({ _id: req.params.id, role: "agent" });
//     if (!u) throw new Error("એજન્ટ મળ્યો નહીં");
//     if (await Bill.exists({ agent: u._id }))
//       throw new Error("આ એજન્ટની પટ્ટીઓ છે, ડિલીટ ન થઈ શકે. તેને બ્લોક કરો");
//     await u.deleteOne();
//     res.json({ msg: "એજન્ટ કાઢી નાખ્યો" });
//   }),
// );

// // ---- યુઝર (ખેડૂત/વેપારી/એજન્ટ) ----
// router.put(
//   "/admin/users/:id",
//   A,
//   wrap(async (req, res) => {
//     const u = await User.findOne({
//       _id: req.params.id,
//       role: { $in: MANAGED },
//     });
//     if (!u) throw new Error("યુઝર મળ્યો નહીં");
//     const { name, phone } = req.body;
//     if (!String(name || "").trim() || !String(phone || "").trim())
//       throw new Error("નામ અને મોબાઈલ જરૂરી છે");
//     if (await User.findOne({ phone, _id: { $ne: u._id } }))
//       throw new Error("આ મોબાઈલ નંબર પહેલેથી વપરાયેલો છે");
//     u.name = String(name).trim();
//     u.phone = String(phone).trim();
//     await u.save();
//     res.json({ msg: "યુઝરની વિગત સુધારી" });
//   }),
// );
// router.delete(
//   "/admin/users/:id",
//   A,
//   wrap(async (req, res) => {
//     const u = await User.findOne({
//       _id: req.params.id,
//       role: { $in: MANAGED },
//     });
//     if (!u) throw new Error("યુઝર મળ્યો નહીં");
//     const used = await Promise.all([
//       Crop.exists({ farmer: u._id }),
//       Patti.exists({ $or: [{ farmer: u._id }, { trader: u._id }] }),
//       Bid.exists({ trader: u._id }),
//       Bill.exists({ agent: u._id }),
//     ]);
//     if (used.some(Boolean))
//       throw new Error(
//         "આ યુઝરનો માલ/સોદા/બોલીનો રેકોર્ડ છે, ડિલીટ ન થઈ શકે. તેને બ્લોક કરો",
//       );
//     await u.deleteOne();
//     res.json({ msg: "યુઝર કાઢી નાખ્યો" });
//   }),
// );

// // ---- વેપારી સબ્સ્ક્રિપ્શન રદ ----
// router.post(
//   "/admin/subs/:id/revoke",
//   A,
//   wrap(async (req, res) => {
//     const u = await User.findOne({ _id: req.params.id, role: "trader" });
//     if (!u) throw new Error("વેપારી મળ્યો નહીં");
//     u.subscriptionUntil = null;
//     u.subRequest = "none";
//     await u.save();
//     res.json({ msg: "સબ્સ્ક્રિપ્શન રદ કર્યું" });
//   }),
// );

// export default router;
import { validateCropName } from "../../shared/crops.mjs";
import { indiaDay, validateRate } from "../services/assistant.js";
import { Router } from "express";
import bcrypt from "bcryptjs";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { User, Crop, Rate, Bill, News, Media, Ad } from "../models/index.js";

const router = Router();
const A = auth("admin");
const LOCKED = ["auction", "sold"]; // હરાજી ચાલુ/પૂરી થયેલા માલમાં ફેરફાર નહીં
// ---- બજાર ભાવ ----
router.put(
  "/admin/rates/:id",
  A,
  wrap(async (req, res) => {
    const r = await Rate.findById(req.params.id);
    if (!r) throw new Error("ભાવ મળ્યો નહીં");
    const updated = validateRate(
      { ...r.toObject(), ...req.body, date: req.body.date || r.date },
      indiaDay(),
      r.crop,
    );
    Object.assign(r, updated);
    await r.save();
    res.json({ msg: "ભાવ સુધાર્યો" });
  }),
);
router.delete(
  "/admin/rates/:id",
  A,
  wrap(async (req, res) => {
    await Rate.findByIdAndDelete(req.params.id);
    res.json({ msg: "ભાવ કાઢી નાખ્યો" });
  }),
);

// ---- સમાચાર ----
router.put(
  "/admin/news/:id",
  A,
  wrap(async (req, res) => {
    const title = String(req.body.title || "").trim();
    if (!title) throw new Error("શીર્ષક લખો");
    const n = await News.findByIdAndUpdate(req.params.id, {
      title,
      body: req.body.body || "",
    });
    if (!n) throw new Error("સમાચાર મળ્યા નહીં");
    res.json({ msg: "સમાચાર સુધાર્યા" });
  }),
);

// ---- ગેલેરી (ફોટો: ફક્ત શીર્ષક, વીડિયો: શીર્ષક + લિંક) ----
router.put(
  "/admin/media/:id",
  A,
  wrap(async (req, res) => {
    const m = await Media.findById(req.params.id);
    if (!m) throw new Error("આઇટમ મળી નહીં");
    m.title = String(req.body.title || "").trim();
    if (m.type === "video" && req.body.url) {
      if (!/^https?:\/\//.test(req.body.url))
        throw new Error("YouTube લિંક સાચી નાખો");
      m.url = req.body.url;
    }
    await m.save();
    res.json({ msg: "ગેલેરી આઇટમ સુધારી" });
  }),
);

// ---- જાહેરાતો ----
router.put(
  "/admin/ads/:id",
  A,
  wrap(async (req, res) => {
    const { title, company, text, active } = req.body;
    if (!String(title || "").trim()) throw new Error("શીર્ષક લખો");
    const a = await Ad.findByIdAndUpdate(req.params.id, {
      title,
      company,
      text,
      active: !!active,
    });
    if (!a) throw new Error("જાહેરાત મળી નહીં");
    res.json({ msg: "જાહેરાત સુધારી" });
  }),
);

// ---- માલ (હરાજી ચાલુ/પૂરી થઈ હોય તો નહીં) ----
router.put(
  "/admin/crops/:id",
  A,
  wrap(async (req, res) => {
    const c = await Crop.findById(req.params.id);
    if (!c) throw new Error("માલ મળ્યો નહીં");
    if (LOCKED.includes(c.status))
      throw new Error("હરાજી ચાલુ કે પૂરી થયેલા માલમાં ફેરફાર ન થઈ શકે");
    const { name, grade, man, basePrice, shed } = req.body;
    if (name) c.name = validateCropName(name, c.name);
    if (grade) c.grade = grade;
    if (man !== undefined && man !== "") {
      if (!(Number(man) > 0)) throw new Error("મણ સાચા લખો");
      c.man = Number(man);
    }
    if (basePrice !== undefined && basePrice !== "") {
      if (!(Number(basePrice) > 0)) throw new Error("ભાવ સાચો લખો");
      c.basePrice = Number(basePrice);
    }
    if (shed !== undefined) c.shed = shed;
    await c.save();
    res.json({ msg: "માલની વિગત સુધારી" });
  }),
);
router.delete(
  "/admin/crops/:id",
  A,
  wrap(async (req, res) => {
    const c = await Crop.findById(req.params.id);
    if (!c) throw new Error("માલ મળ્યો નહીં");
    if (LOCKED.includes(c.status))
      throw new Error("હરાજી ચાલુ કે પૂરી થયેલો માલ ડિલીટ ન થઈ શકે");
    await c.deleteOne();
    res.json({ msg: "માલ કાઢી નાખ્યો" });
  }),
);

// ---- કમિશન એજન્ટ ----
router.put(
  "/admin/agents/:id",
  A,
  wrap(async (req, res) => {
    const u = await User.findOne({ _id: req.params.id, role: "agent" });
    if (!u) throw new Error("એજન્ટ મળ્યો નહીં");
    const { name, shopName, phone, password } = req.body;
    if (!name || !shopName || !phone)
      throw new Error("નામ, દુકાન અને મોબાઈલ જરૂરી છે");
    if (await User.findOne({ phone, _id: { $ne: u._id } }))
      throw new Error("આ મોબાઈલ નંબર પહેલેથી વપરાયેલો છે");
    u.name = name;
    u.shopName = shopName;
    u.phone = phone;
    if (password) {
      if (password.length < 6)
        throw new Error("પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો રાખો");
      u.password = await bcrypt.hash(password, 10);
    }
    await u.save();
    res.json({ msg: "એજન્ટની વિગત સુધારી" });
  }),
);
router.delete(
  "/admin/agents/:id",
  A,
  wrap(async (req, res) => {
    const u = await User.findOne({ _id: req.params.id, role: "agent" });
    if (!u) throw new Error("એજન્ટ મળ્યો નહીં");
    if (await Bill.exists({ agent: u._id }))
      throw new Error("આ એજન્ટની પટ્ટીઓ છે, ડિલીટ ન થઈ શકે. તેને બ્લોક કરો");
    await u.deleteOne();
    res.json({ msg: "એજન્ટ કાઢી નાખ્યો" });
  }),
);

// ---- વેપારી સબ્સ્ક્રિપ્શન રદ ----
router.post(
  "/admin/subs/:id/revoke",
  A,
  wrap(async (req, res) => {
    const u = await User.findOne({ _id: req.params.id, role: "trader" });
    if (!u) throw new Error("વેપારી મળ્યો નહીં");
    u.subscriptionUntil = null;
    u.subRequest = "none";
    await u.save();
    res.json({ msg: "સબ્સ્ક્રિપ્શન રદ કર્યું" });
  }),
);

export default router;
