import { Router } from "express";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import upload from "../middleware/upload.js";
import { Page, News, Media, Crop, User } from "../models/index.js";

const router = Router();

// ---- પબ્લિક ----
router.get(
  "/news",
  wrap(async (req, res) =>
    res.json(await News.find().sort({ createdAt: -1 }).limit(50)),
  ),
);

router.get(
  "/pages/:slug",
  wrap(async (req, res) => {
    const p = await Page.findOne({ slug: req.params.slug });
    if (!p) throw new Error("પેજ મળ્યું નહીં");
    res.json(p);
  }),
);

router.get(
  "/media",
  wrap(async (req, res) =>
    res.json(
      await Media.find(req.query.type ? { type: req.query.type } : {}).sort({
        createdAt: -1,
      }),
    ),
  ),
);

// દૈનિક આવક: ગેટ એન્ટ્રી થયેલા માલનો છેલ્લા ૭ દિવસનો સરવાળો
router.get(
  "/arrivals",
  wrap(async (req, res) => {
    const since = new Date(Date.now() - 7 * 864e5);
    const rows = await Crop.aggregate([
      { $match: { enteredAt: { $gte: since } } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$enteredAt",
                timezone: "Asia/Kolkata",
              },
            },
            crop: "$name",
          },
          man: { $sum: "$man" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": -1 } },
    ]);
    res.json({
      today: new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata",
      }),
      rows: rows.map((r) => ({
        date: r._id.date,
        crop: r._id.crop,
        man: r.man,
        count: r.count,
      })),
    });
  }),
);

// લાઈસન્સદારની યાદી
router.get(
  "/licensees",
  wrap(async (req, res) => {
    const now = new Date();
    res.json({
      agents: await User.find({
        role: "agent",
        licenseUntil: { $gt: now },
        blocked: { $ne: true },
      }).select("shopName name phone licenseUntil"),
      traders: await User.find({
        role: "trader",
        subscriptionUntil: { $gt: now },
        blocked: { $ne: true },
      }).select("name license"),
    });
  }),
);

// ---- એડમિન ----
router.post(
  "/admin/news",
  auth("admin"),
  wrap(async (req, res) => {
    if (!req.body.title) throw new Error("શીર્ષક લખો");
    await News.create({ title: req.body.title, body: req.body.body });
    res.json({ msg: "સમાચાર ઉમેરાયા" });
  }),
);
router.delete(
  "/admin/news/:id",
  auth("admin"),
  wrap(async (req, res) => {
    await News.findByIdAndDelete(req.params.id);
    res.json({ msg: "સમાચાર કાઢી નાખ્યા" });
  }),
);

router.put(
  "/admin/pages/:slug",
  auth("admin"),
  wrap(async (req, res) => {
    await Page.findOneAndUpdate(
      { slug: req.params.slug },
      { title: req.body.title, body: req.body.body },
      { upsert: true },
    );
    res.json({ msg: "પેજ સેવ થયું" });
  }),
);

router.post(
  "/admin/media",
  auth("admin"),
  upload.single("photo"),
  wrap(async (req, res) => {
    const { type, title, url } = req.body;
    if (type === "photo") {
      if (!req.file) throw new Error("ફોટો પસંદ કરો (JPG/PNG/WEBP)");
      await Media.create({ type, title, url: "/uploads/" + req.file.filename });
    } else {
      if (!/^https?:\/\//.test(url || "")) throw new Error("YouTube લિંક નાખો");
      await Media.create({ type: "video", title, url });
    }
    res.json({ msg: "ઉમેરાયું" });
  }),
);
router.delete(
  "/admin/media/:id",
  auth("admin"),
  wrap(async (req, res) => {
    await Media.findByIdAndDelete(req.params.id);
    res.json({ msg: "કાઢી નાખ્યું" });
  }),
);

export default router;
