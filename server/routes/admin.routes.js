import { notify } from "../services/notify.js";
import { checkAlerts } from "../services/alerts.js";
import { displayCropName } from "../../shared/crops.mjs";
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
    const c = await Crop.findByIdAndUpdate(
      req.params.id,
      { status: "verified", shed: req.body.shed },
      { new: true },
    );
    if (c)
      notify(c.farmer, {
        type: "gate",
        title: "✅ તમારો માલ વેરીફાય થયો",
        body: `${displayCropName(c.name)} ${c.man} મણ${c.shed ? ` • શેડ ${c.shed}` : ""}. યાર્ડના ગેટ પર QR સ્કેન કરાવો.`,
        link: "/farmer",
      });
    res.json(c);
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
    notify(c.farmer?._id, {
      type: "gate",
      title: "🚪 ગેટ પ્રવેશ મંજૂર",
      body: `${displayCropName(c.name)} ${c.man} મણ યાર્ડમાં દાખલ થયો${c.shed ? ` • શેડ ${c.shed}` : ""}.`,
      link: "/farmer",
    });
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
    const crop = `${displayCropName(c.name)} ${c.man} મણ`;
    notify(c.farmer, {
      type: "auction",
      title: "🔨 તમારા માલની હરાજી શરૂ થઈ",
      body: `${crop} • શરૂઆતનો ભાવ ₹${c.basePrice}/મણ`,
      link: "/farmer",
    });
    // સક્રિય સબ્સ્ક્રિપ્શન વાળા બધા વેપારીને
    User.find({
      role: "trader",
      blocked: { $ne: true },
      subscriptionUntil: { $gt: new Date() },
    })
      .select("_id")
      .lean()
      .then((ts) =>
        notify(
          ts.map((t) => t._id),
          {
            type: "auction",
            title: "🔨 નવી હરાજી ચાલુ",
            body: `${crop} • શરૂઆતનો ભાવ ₹${c.basePrice}/મણ. બોલી લગાવો.`,
            link: "/trader",
          },
        ),
      )
      .catch(() => {});
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
    const patti = await Patti.create({
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
    const pt = `PT-${String(patti._id).slice(-6).toUpperCase()}`;
    const what = `${displayCropName(c.name)} ${c.man} મણ × ₹${c.highestBid}`;
    notify(c.farmer, {
      type: "patti",
      title: "🧾 સોદો પાકો, પટ્ટી બની ગઈ",
      body: `${pt} • ${what} • તમને મળશે ₹${Math.round(patti.farmerNet).toLocaleString("en-IN")}`,
      link: "/farmer",
    });
    notify(c.highestBidder, {
      type: "patti",
      title: "🧾 તમારી બોલી જીતી, પટ્ટી બની ગઈ",
      body: `${pt} • ${what} • ચૂકવવાપાત્ર ₹${Math.round(patti.gross).toLocaleString("en-IN")}`,
      link: "/trader",
    });
    res.json({ msg: "સોદો પાકો, પટ્ટી બની ગઈ" });
  }),
);

router.post(
  "/admin/rates",
  auth("admin"),
  wrap(async (req, res) => {
    const rate = await Rate.create(
      validateRate({ ...req.body, date: req.body.date || indiaDay() }),
    );
    checkAlerts(rate); // ભાવ એલર્ટ તપાસો (પાછળ ચાલે, જવાબ રોકતું નથી)
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
    notify(u._id, {
      type: "subscription",
      title: "✅ સબ્સ્ક્રિપ્શન મંજૂર",
      body: `તમારો માસિક પ્લાન ${u.subscriptionUntil.toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" })} સુધી ચાલુ છે. હવે લાઈવ હરાજીમાં બોલી લગાવો.`,
      link: "/trader",
    });
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
