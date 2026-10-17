// import { Router } from "express";
// import { Rate, Ad } from "../models/index.js";
// import wrap from "../middleware/wrap.js";
// import { indiaDay } from "../services/assistant.js";
// const router = Router();

// router.get(
//   "/rates",
//   wrap(async (_, res) =>
//     res.json(await Rate.find().sort({ createdAt: -1 }).limit(100)),
//   ),
// );

// router.get(
//   "/ads",
//   wrap(async (_, res) => res.json(await Ad.find({ active: true }))),
// );

// // ---- 7-day price trend ----
// // router.get(
// //   "/rates/trend",
// //   wrap(async (req, res) => {
// //     const since = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
// //     res.json(
// //       await Rate.aggregate([
// //         { $match: { crop: req.query.crop, date: { $gte: since } } },
// //         {
// //           $group: {
// //             _id: "$date",
// //             min: { $avg: "$min" },
// //             max: { $avg: "$max" },
// //           },
// //         },
// //         { $sort: { _id: 1 } },
// //       ]),
// //     );
// //   }),
// // );

// // router.get(
// //   "/rates/trend",
// //   wrap(async (req, res) => {
// //     if (
// //       typeof req.query.crop !== "string" ||
// //       !req.query.crop.trim() ||
// //       req.query.crop.length > 80
// //     ) {
// //       throw new Error("પાકનું નામ આપો.");
// //     }

// //     const today = indiaDay();

// //     const since = indiaDay(
// //       new Date(new Date(`${today}T00:00:00+05:30`).getTime() - 6 * 86400000),
// //     );

// //     const list = await Rate.aggregate([
// //       {
// //         $match: {
// //           crop: req.query.crop,
// //           date: { $gte: since, $lte: today },
// //           unitKg: { $gt: 0 },
// //           min: { $gte: 0 },
// //           max: { $gte: 0 },
// //         },
// //       },
// //       {
// //         $sort: {
// //           date: 1,
// //           createdAt: -1,
// //           _id: -1,
// //         },
// //       },
// //       {
// //         $group: {
// //           _id: "$date",
// //           min: {
// //             $first: {
// //               $multiply: ["$min", { $divide: [20, "$unitKg"] }],
// //             },
// //           },
// //           max: {
// //             $first: {
// //               $multiply: ["$max", { $divide: [20, "$unitKg"] }],
// //             },
// //           },
// //         },
// //       },
// //       { $sort: { _id: 1 } },
// //     ]);

// //     res.json(list);
// //   }),
// // );
// function makeTrend(rows, since, today) {
//   const byDate = new Map();

//   for (const row of rows) {
//     if (
//       typeof row.date !== "string" ||
//       row.date < since ||
//       row.date > today ||
//       byDate.has(row.date)
//     ) {
//       continue;
//     }

//     if (
//       row.min == null ||
//       row.max == null ||
//       row.min === "" ||
//       row.max === ""
//     ) {
//       continue;
//     }

//     const min = Number(row.min);
//     const max = Number(row.max);

//     if (
//       !Number.isFinite(min) ||
//       !Number.isFinite(max) ||
//       min < 0 ||
//       max < min
//     ) {
//       continue;
//     }

//     // જૂના appમાં એકમ વગરના ભાવ પ્રતિ મણ બતાવાતા હતા.
//     const legacyUnit =
//       row.unitKg == null && !String(row.unitLabel || "").trim();

//     const kg = legacyUnit ? 20 : Number(row.unitKg);

//     // પ્રતિ નંગ અથવા અજ્ઞાત વજનનો ભાવ વજનના ચાર્ટમાં ન લો.
//     if (!Number.isFinite(kg) || kg <= 0) continue;

//     const normalizedMin = (min * 20) / kg;
//     const normalizedMax = (max * 20) / kg;

//     if (!Number.isFinite(normalizedMin) || !Number.isFinite(normalizedMax)) {
//       continue;
//     }

//     byDate.set(row.date, {
//       _id: row.date,
//       min: normalizedMin,
//       max: normalizedMax,
//       legacyUnit,
//     });
//   }

//   return [...byDate.values()].sort((a, b) => a._id.localeCompare(b._id));
// }

// router.get(
//   "/rates/trend",
//   wrap(async (req, res) => {
//     if (
//       typeof req.query.crop !== "string" ||
//       !req.query.crop.trim() ||
//       req.query.crop.length > 80
//     ) {
//       throw new Error("પાકનું નામ આપો.");
//     }

//     const today = indiaDay();

//     const since = indiaDay(
//       new Date(new Date(`${today}T00:00:00+05:30`).getTime() - 6 * 86400000),
//     );

//     const rows = await Rate.find({
//       crop: req.query.crop.trim(),
//       date: {
//         $gte: since,
//         $lte: today,
//       },
//     })
//       .sort({
//         date: 1,
//         createdAt: -1,
//         _id: -1,
//       })
//       .lean();

//     res.json(makeTrend(rows, since, today));
//   }),
// );
// export default router;
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
