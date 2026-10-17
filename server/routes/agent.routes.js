import { Router } from "express";
import bcrypt from "bcryptjs";
import { User, Bill } from "../models/index.js";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { licOk } from "../utils/helpers.js";

import { validateCropName } from "../../shared/crops.mjs";

const router = Router();

router.get(
  "/admin/agents",
  auth("admin"),
  wrap(async (_, res) =>
    res.json(await User.find({ role: "agent" }).select("-password")),
  ),
);

router.post(
  "/admin/agents",
  auth("admin"),
  wrap(async (req, res) => {
    const { name, shopName, phone, password } = req.body;
    if (!name || !shopName || !phone || !password)
      throw new Error("બધી વિગતો ભરો");
    await User.create({
      name,
      shopName,
      phone,
      role: "agent",
      password: await bcrypt.hash(password, 10),
    });
    res.json({ msg: "એજન્ટ ખાતું બન્યું" });
  }),
);

router.post(
  "/admin/agents/:id/renew",
  auth("admin"),
  wrap(async (req, res) => {
    const u = await User.findOne({ _id: req.params.id, role: "agent" });
    const base = licOk(u) ? u.licenseUntil : new Date();
    u.licenseUntil = new Date(base.getTime() + 365 * 864e5);
    await u.save();
    res.json({ msg: "લાયસન્સ 1 વર્ષ વધ્યું" });
  }),
);

router.get(
  "/agent/bills",
  auth("agent"),
  wrap(async (req, res) =>
    res.json({
      shopName: req.user.shopName,
      licenseUntil: req.user.licenseUntil,
      active: !!licOk(req.user),
      bills: await Bill.find({ agent: req.user._id }).sort({ createdAt: -1 }),
    }),
  ),
);

router.post(
  "/agent/bills",
  auth("agent"),
  wrap(async (req, res) => {
    if (!licOk(req.user))
      throw new Error("સોફ્ટવેર લાયસન્સ સક્રિય નથી, એડમિનનો સંપર્ક કરો");
    const { party, cropName, man, rate, commissionPct } = req.body;
    if (!party || !(+man > 0) || !(+rate > 0))
      throw new Error("પાર્ટી, મણ અને ભાવ ભરો");
    const gross = +man * +rate,
      commission = +((gross * (+commissionPct || 0)) / 100).toFixed(2);
    await Bill.create({
      agent: req.user._id,
      party,
      cropName: validateCropName(cropName),
      man: +man,
      rate: +rate,
      commissionPct: +commissionPct || 0,
      gross,
      commission,
      net: gross - commission,
    });
    res.json({ msg: "પટ્ટી બની ગઈ" });
  }),
);

export default router;
