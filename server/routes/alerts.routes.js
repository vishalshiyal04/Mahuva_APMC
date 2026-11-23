import { Router } from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { PriceAlert } from "../models/index.js";
import { CROPS, normalizeCropName } from "../../shared/crops.mjs";

const router = Router();
const MAX_ALERTS = 10;
const noAdmin = (req) => {
  if (req.user.role === "admin") throw new Error("પરવાનગી નથી");
};

router.get(
  "/alerts",
  auth(),
  wrap(async (req, res) => {
    noAdmin(req);
    res.json(
      await PriceAlert.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .lean(),
    );
  }),
);

router.post(
  "/alerts",
  auth(),
  wrap(async (req, res) => {
    noAdmin(req);
    const crop = normalizeCropName(req.body.crop);
    if (!CROPS.includes(crop))
      throw new Error("પાકની માન્ય જાત / નંબર પસંદ કરો.");
    const direction = req.body.direction;
    if (!["above", "below"].includes(direction))
      throw new Error("ઉપર કે નીચે પસંદ કરો");
    const target = Number(req.body.target);
    if (!Number.isFinite(target) || target < 1 || target > 1e7)
      throw new Error("લક્ષ્ય ભાવ સાચો લખો");
    if ((await PriceAlert.countDocuments({ user: req.user._id })) >= MAX_ALERTS)
      throw new Error(
        `વધુમાં વધુ ${MAX_ALERTS} એલર્ટ રાખી શકાય, જૂનું કાઢી નાખો`,
      );
    const dup = await PriceAlert.findOne({
      user: req.user._id,
      crop,
      direction,
      target,
      active: true,
    });
    if (dup) throw new Error("આવું એલર્ટ પહેલેથી ચાલુ છે");
    const a = await PriceAlert.create({
      user: req.user._id,
      crop,
      direction,
      target,
    });
    res.json(a);
  }),
);

// ફરી ચાલુ / બંધ કરો
router.put(
  "/alerts/:id",
  auth(),
  wrap(async (req, res) => {
    noAdmin(req);
    if (!mongoose.isValidObjectId(req.params.id))
      throw new Error("એલર્ટ મળ્યું નહીં");
    const a = await PriceAlert.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!a) throw new Error("એલર્ટ મળ્યું નહીં");
    a.active = !!req.body.active;
    if (a.active) {
      a.triggeredAt = undefined;
      a.triggeredPrice = undefined;
      a.triggeredDate = undefined;
    }
    await a.save();
    res.json(a);
  }),
);

router.delete(
  "/alerts/:id",
  auth(),
  wrap(async (req, res) => {
    noAdmin(req);
    if (!mongoose.isValidObjectId(req.params.id))
      throw new Error("એલર્ટ મળ્યું નહીં");
    await PriceAlert.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ msg: "એલર્ટ કાઢી નાખ્યું" });
  }),
);

export default router;
