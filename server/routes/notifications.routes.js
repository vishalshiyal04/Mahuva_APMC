import { Router } from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { Notification } from "../models/index.js";

const router = Router();

// છેલ્લી 40 સૂચના + ન વાંચેલાની સંખ્યા
router.get(
  "/notifications",
  auth(),
  wrap(async (req, res) => {
    const [items, unread] = await Promise.all([
      Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(40)
        .lean(),
      Notification.countDocuments({ user: req.user._id, read: false }),
    ]);
    res.json({ items, unread });
  }),
);

router.post(
  "/notifications/read-all",
  auth(),
  wrap(async (req, res) => {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true },
    );
    res.json({ ok: true });
  }),
);

router.post(
  "/notifications/:id/read",
  auth(),
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id))
      throw new Error("સૂચના મળી નહીં");
    await Notification.updateOne(
      { _id: req.params.id, user: req.user._id },
      { read: true },
    );
    res.json({ ok: true });
  }),
);

router.delete(
  "/notifications",
  auth(),
  wrap(async (req, res) => {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ ok: true });
  }),
);

export default router;
