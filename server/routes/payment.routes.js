import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Settings from "../config/settings.js";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { subActive } from "../utils/helpers.js";
import { Payment, Patti } from "../models/index.js";
import { io } from "../socket.js";
const router = Router();

// ---- Razorpay ----
const rzp = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

router.get("/pay/config", (_, res) =>
  res.json({
    enabled: !!rzp,
    key: process.env.RAZORPAY_KEY_ID || "",
    fee: Settings.traderMonthlyFee,
  }),
);

router.post(
  "/pay/order",
  auth("trader"),
  wrap(async (req, res) => {
    if (!rzp) throw new Error("Razorpay કી સેટ નથી");
    res.json(
      await rzp.orders.create({
        amount: Settings.traderMonthlyFee * 100,
        currency: "INR",
        receipt: "sub_" + Date.now(),
      }),
    );
  }),
);

router.post(
  "/pay/verify",
  auth("trader"),
  wrap(async (req, res) => {
    const {
      razorpay_order_id: o,
      razorpay_payment_id: p,
      razorpay_signature: sg,
    } = req.body;
    const sig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(o + "|" + p)
      .digest("hex");
    if (sig !== sg) throw new Error("પેમેન્ટ ચકાસણી નિષ્ફળ");
    await Payment.create({
      paymentId: p,
      user: req.user._id,
      amount: Settings.traderMonthlyFee,
    }); // unique: replay blocked
    const base = subActive(req.user) ? req.user.subscriptionUntil : new Date();
    req.user.subscriptionUntil = new Date(base.getTime() + 30 * 864e5);
    req.user.subRequest = "approved";
    await req.user.save();
    res.json({ msg: "પેમેન્ટ સફળ, સબ્સ્ક્રિપ્શન ચાલુ" });
  }),
);
// ---- પટ્ટીનું પેમેન્ટ: વેપારી ખરીદેલા માલના પૈસા ઓનલાઈન ચૂકવે ----
router.post(
  "/pay/patti/:id/order",
  auth("trader"),
  wrap(async (req, res) => {
    if (!rzp) throw new Error("ઓનલાઈન પેમેન્ટ ચાલુ નથી (Razorpay કી સેટ નથી)");
    const p = await Patti.findOne({ _id: req.params.id, trader: req.user._id });
    if (!p) throw new Error("પટ્ટી મળી નહીં");
    if (p.paid) throw new Error("આ પટ્ટીનું પેમેન્ટ થઈ ગયું છે");
    const o = await rzp.orders.create({
      amount: Math.round(p.gross * 100),
      currency: "INR",
      receipt: "patti_" + String(p._id).slice(-10),
      notes: { pattiId: String(p._id) },
    });
    p.orderId = o.id;
    await p.save(); // આ ઓર્ડર આ જ પટ્ટીનો છે તે યાદ રાખીએ
    res.json(o);
  }),
);

router.post(
  "/pay/patti/:id/verify",
  auth("trader"),
  wrap(async (req, res) => {
    const {
      razorpay_order_id: o,
      razorpay_payment_id: pay,
      razorpay_signature: sg,
    } = req.body;
    const p = await Patti.findOne({ _id: req.params.id, trader: req.user._id });
    if (!p) throw new Error("પટ્ટી મળી નહીં");
    if (p.paid) return res.json({ msg: "પેમેન્ટ પહેલેથી નોંધાયેલું છે" });
    if (!p.orderId || p.orderId !== o) throw new Error("ઓર્ડર મેળ ખાતો નથી");
    const sig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(o + "|" + pay)
      .digest("hex");
    if (sig !== sg) throw new Error("પેમેન્ટ ચકાસણી નિષ્ફળ");
    await Payment.create({
      paymentId: pay,
      user: req.user._id,
      amount: p.gross,
    }); // એક જ પેમેન્ટ બે વાર નહીં
    p.paid = true;
    p.paidAt = new Date();
    p.paymentId = pay;
    await p.save();
    io.emit("auction:update", { patti: p._id }); // ખેડૂતનું પેજ પણ અપડેટ થાય
    res.json({ msg: "પેમેન્ટ સફળ, પટ્ટી ચૂકવાઈ ગઈ" });
  }),
);

export default router;
