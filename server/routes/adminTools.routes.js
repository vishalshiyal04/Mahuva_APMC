import { Router } from "express";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { User, Patti } from "../models/index.js";

const router = Router();

// યુઝર મેનેજમેન્ટ
router.get(
  "/admin/users",
  auth("admin"),
  wrap(async (req, res) =>
    res.json(
      await User.find({ role: { $in: ["farmer", "trader", "agent"] } })
        .select("-password")
        .sort({ createdAt: -1 }),
    ),
  ),
);

router.post(
  "/admin/users/:id/block",
  auth("admin"),
  wrap(async (req, res) => {
    const u = await User.findOne({
      _id: req.params.id,
      role: { $in: ["farmer", "trader", "agent"] },
    });
    if (!u) throw new Error("યુઝર મળ્યો નહીં");
    u.blocked = !!req.body.blocked;
    await u.save();
    res.json({
      msg: u.blocked ? "ખાતું બ્લોક કર્યું" : "ખાતું ફરી ચાલુ કર્યું",
    });
  }),
);

// વેચાણ રિપોર્ટ (CSV, Excel માં ખુલે)
router.get(
  "/admin/report.csv",
  auth("admin"),
  wrap(async (req, res) => {
    const q = {};
    if (req.query.from) q.$gte = new Date(req.query.from + "T00:00:00+05:30");
    if (req.query.to) q.$lte = new Date(req.query.to + "T23:59:59.999+05:30");
    const list = await Patti.find(Object.keys(q).length ? { createdAt: q } : {})
      .sort({ createdAt: -1 })
      .populate("farmer trader", "name phone");

    const esc = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
    const head = [
      "તારીખ",
      "પાક",
      "મણ",
      "ભાવ/મણ",
      "કુલ રકમ",
      "કમિશન",
      "કમિશન બાદ ખેડૂતની હકની રકમ",
      "ખેડૂત",
      "ખેડૂત ફોન",
      "વેપારી",
    ];
    const rows = list.map((p) =>
      [
        new Date(p.createdAt).toLocaleDateString("en-GB"),
        p.cropName,
        p.man,
        p.rate,
        p.gross,
        p.commission,
        p.farmerNet,
        p.farmer?.name,
        p.farmer?.phone,
        p.trader?.name,
      ]
        .map(esc)
        .join(","),
    );

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.csv",
    );
    res.send("\ufeff" + [head.map(esc).join(","), ...rows].join("\n"));
  }),
);

export default router;
