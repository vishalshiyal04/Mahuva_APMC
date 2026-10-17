import { Router } from "express";
import { Rate, Ad } from "../models/index.js";
import wrap from "../middleware/wrap.js";
import { trendDays, buildTrend } from "../services/trends.js";
const router = Router();

router.get(
  "/rates",
  wrap(async (_, res) =>
    res.json(await Rate.find().sort({ createdAt: -1 }).limit(100)),
  ),
);

router.get(
  "/ads",
  wrap(async (_, res) => res.json(await Ad.find({ active: true }))),
);

router.get(
  "/rates/trend",
  wrap(async (req, res) => {
    if (
      typeof req.query.crop !== "string" ||
      !req.query.crop.trim() ||
      req.query.crop.length > 80
    ) {
      throw new Error("પાક અને જાત પસંદ કરો.");
    }
    const days = trendDays();
    const rows = await Rate.find({ date: { $in: days } }).lean();
    res.set("Cache-Control", "no-store");
    res.json(buildTrend(rows, days, req.query.crop.trim()));
  }),
);
export default router;
