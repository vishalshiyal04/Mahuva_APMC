import { Router } from "express";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { Crop } from "../models/index.js";

const router = Router();

// પ્રોફાઇલ જુઓ (પાસવર્ડ વગર)
router.get(
  "/profile",
  auth(),
  wrap(async (req, res) => {
    const { password, ...user } = req.user.toObject();
    res.json(user);
  }),
);

// પ્રોફાઇલ સુધારો: નામ (બધા), GST/લાયસન્સ (ફક્ત વેપારી)
router.put(
  "/profile",
  auth(),
  wrap(async (req, res) => {
    const { name, gst, license } = req.body;
    if (!String(name || "").trim()) throw new Error("નામ લખો");
    req.user.name = String(name).trim();
    if (req.user.role === "trader") {
      if (gst !== undefined) req.user.gst = gst;
      if (license !== undefined) req.user.license = license;
    }
    await req.user.save();
    res.json({ msg: "પ્રોફાઇલ સેવ થઈ", name: req.user.name });
  }),
);

// ખેડૂત: વેરીફાય થયા પહેલાં માલ રદ કરી શકે
router.delete(
  "/crops/:id",
  auth("farmer"),
  wrap(async (req, res) => {
    const c = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!c) throw new Error("માલ મળ્યો નહીં");
    if (c.status !== "pending")
      throw new Error("વેરીફાય થયેલો માલ રદ ન થઈ શકે");
    await c.deleteOne();
    res.json({ msg: "માલ રદ થયો" });
  }),
);

export default router;
