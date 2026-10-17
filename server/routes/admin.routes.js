import { indiaDay, validateRate } from "../services/assistant.js";
import { Router } from "express";
import { User, Crop, Rate, Patti, Ad, Bid } from "../models/index.js";
import Settings from "../config/settings.js";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { subActive } from "../utils/helpers.js";
import { bidInfo } from "../services/bids.js";
import { io } from "../socket.js";

const router = Router();

router.get(
  "/admin/stats",
  auth("admin"),
  wrap(async (_, res) => {
    const [farmers, traders, crops, pattis] = await Promise.all([
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "trader" }),
      Crop.countDocuments(),
      Patti.find(),
    ]);
    res.json({
      farmers,
      traders,
      crops,
      deals: pattis.length,
      commission: pattis.reduce((a, p) => a + p.commission, 0),
      turnover: pattis.reduce((a, p) => a + p.gross, 0),
    });
  }),
);

router.get(
  "/admin/crops",
  auth("admin"),
  wrap(async (_, res) =>
    res.json(
      await Crop.find()
        .sort({ createdAt: -1 })
        .populate("farmer", "name phone"),
    ),
  ),
);

router.post(
  "/admin/crops/:id/verify",
  auth("admin"),
  wrap(async (req, res) => {
    res.json(
      await Crop.findByIdAndUpdate(
        req.params.id,
        { status: "verified", shed: req.body.shed },
        { new: true },
      ),
    );
  }),
);

router.post(
  "/admin/scan",
  auth("admin"),
  wrap(async (req, res) => {
    const c = await Crop.findOne({
      passId: (req.body.passId || "").trim(),
    }).populate("farmer", "name");
    if (!c) throw new Error("ગેટ પાસ અમાન્ય છે");
    if (c.status === "pending") throw new Error("માલ હજી વેરીફાય થયો નથી");
    if (c.status !== "verified") throw new Error("આ પાસ પહેલેથી વપરાઈ ગયો છે");
    c.status = "entered";
    c.enteredAt = new Date();
    await c.save();
    res.json({
      msg: `પ્રવેશ મંજૂર: ${c.farmer.name} - ${c.name} ${c.man} મણ → શેડ ${c.shed || "-"}`,
    });
  }),
);

router.post(
  "/admin/auction/:id/start",
  auth("admin"),
  wrap(async (req, res) => {
    const c = await Crop.findById(req.params.id);
    if (c.status !== "entered")
      throw new Error("માલ યાર્ડમાં એન્ટ્રી થયા પછી જ હરાજી થાય");
    await Bid.deleteMany({ crop: c._id });
    c.status = "auction";
    c.highestBid = c.basePrice;
    c.highestBidder = null;
    await c.save();
    io.emit("auction:update", c);
    res.json({ msg: "હરાજી શરૂ" });
  }),
);

router.post(
  "/admin/auction/:id/close",
  auth("admin"),
  wrap(async (req, res) => {
    const c = await Crop.findById(req.params.id);
    if (c.status !== "auction") throw new Error("હરાજી ચાલુ નથી");
    if (!c.highestBidder) throw new Error("કોઈ બોલી લાગી નથી");
    const gross = c.highestBid * c.man,
      commission = Settings.commissionPerMan * c.man;
    await Patti.create({
      crop: c._id,
      farmer: c.farmer,
      trader: c.highestBidder,
      cropName: c.name,
      man: c.man,
      rate: c.highestBid,
      gross,
      commission,
      farmerNet: gross - commission,
    });
    c.status = "sold";
    await c.save();
    io.emit("auction:update", c);
    res.json({ msg: "સોદો પાકો, પટ્ટી બની ગઈ" });
  }),
);

router.post(
  "/admin/rates",
  auth("admin"),
  wrap(async (req, res) => {
    await Rate.create(
      validateRate({ ...req.body, date: req.body.date || indiaDay() }),
    );
    res.json({ msg: "ભાવ સેવ થયો" });
  }),
);
router.get(
  "/admin/subs",
  auth("admin"),
  wrap(async (_, res) =>
    res.json(await User.find({ role: "trader" }).select("-password")),
  ),
);

router.post(
  "/admin/subs/:id/approve",
  auth("admin"),
  wrap(async (req, res) => {
    const u = await User.findById(req.params.id);
    const base = subActive(u) ? u.subscriptionUntil : new Date();
    u.subscriptionUntil = new Date(base.getTime() + 30 * 864e5);
    u.subRequest = "approved";
    await u.save();
    res.json({ msg: "સબ્સ્ક્રિપ્શન મંજૂર" });
  }),
);

router.get(
  "/admin/ads",
  auth("admin"),
  wrap(async (_, res) => res.json(await Ad.find())),
);

router.post(
  "/admin/ads",
  auth("admin"),
  wrap(async (req, res) => {
    await Ad.create(req.body);
    res.json({ msg: "જાહેરાત ઉમેરાઈ" });
  }),
);

router.delete(
  "/admin/ads/:id",
  auth("admin"),
  wrap(async (req, res) => {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ msg: "કાઢી નાખી" });
  }),
);

router.get(
  "/admin/bids/:id",
  auth("admin"),
  wrap(async (req, res) => res.json(await bidInfo(req.params.id))),
);

router.post(
  "/admin/auction/:id/cancel",
  auth("admin"),
  wrap(async (req, res) => {
    const c = await Crop.findOne({ _id: req.params.id, status: "auction" });
    if (!c) throw new Error("હરાજી ચાલુ નથી");
    c.status = "entered";
    c.highestBid = 0;
    c.highestBidder = null;
    await c.save();
    io.emit("auction:update", c);
    res.json({ msg: "હરાજી રદ થઈ, માલ ફરી હરાજી માટે તૈયાર" });
  }),
);

export default router;
