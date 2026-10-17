import { Router } from "express";
import wrap from "../middleware/wrap.js";
import { Rate } from "../models/index.js";
import { trendDays, buildAllTrends } from "../services/trends.js";
const router = Router();
router.get(
  "/rates/trends",
  wrap(async (req, res) => {
    const days = trendDays();
    const rows = await Rate.find({ date: { $in: days } }).lean();
    res.set("Cache-Control", "no-store");
    res.json(buildAllTrends(rows, days));
  }),
);
export default router;
