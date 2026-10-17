// import { Router } from "express";
// import wrap from "../middleware/wrap.js";
// import { Rate } from "../models/index.js";

// const router = Router();

// // છેલ્લા ૭ દિવસ (ભારતની તારીખ પ્રમાણે) માટે દરેક પાકનો દિવસ-વાર ભાવ. એક દિવસમાં ઘણા ભાવ હોય તો છેલ્લો લેવાય.
// router.get(
//   "/rates/trends",
//   wrap(async (req, res) => {
//     res.set("Cache-Control", "no-store");
//     const days = [...Array(7)].map((_, i) =>
//       new Date(Date.now() - (6 - i) * 864e5).toLocaleDateString("en-CA", {
//         timeZone: "Asia/Kolkata",
//       }),
//     );
//     const rows = await Rate.aggregate([
//       { $match: { date: { $in: days } } },
//       { $sort: { createdAt: 1 } },
//       {
//         $group: {
//           _id: { crop: "$crop", date: "$date" },
//           min: { $last: "$min" },
//           max: { $last: "$max" },
//         },
//       },
//     ]);
//     const series = {};
//     rows.forEach((r) => {
//       (series[r._id.crop] ||= {})[r._id.date] = { min: r.min, max: r.max };
//     });
//     res.json({ days, series });
//   }),
// );

// export default router;
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
