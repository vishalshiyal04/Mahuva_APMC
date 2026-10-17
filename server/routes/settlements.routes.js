import { Router } from "express";
import { Patti, User } from "../models/index.js";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";

import {
  buildReport,
  makePayment,
  paymentMatch,
  samePayment,
} from "../services/settlements.js";

const router = Router();

router.use("/admin/settlements", auth("admin"));

const validId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const validDate = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;

router.get(
  "/admin/settlements/options",
  wrap(async (_, res) => {
    const [people, crops] = await Promise.all([
      User.find({
        role: { $in: ["farmer", "trader"] },
      })
        .select("name phone role")
        .sort({ name: 1 })
        .lean(),

      Patti.distinct("cropName"),
    ]);

    res.json({
      farmers: people.filter((person) => person.role === "farmer"),
      traders: people.filter((person) => person.role === "trader"),
      crops: crops.filter(Boolean).sort(),
    });
  }),
);

router.get(
  "/admin/settlements",
  wrap(async (req, res) => {
    const query = req.query;
    const match = {};

    for (const name of ["farmer", "trader"]) {
      if (query[name]) {
        if (!validId(query[name])) {
          throw new Error("ખેડૂત અથવા વેપારી અમાન્ય છે.");
        }

        match[name] = query[name];
      }
    }

    if (query.crop) {
      if (typeof query.crop !== "string" || query.crop.length > 100) {
        throw new Error("પાક અમાન્ય છે.");
      }

      match.cropName = query.crop;
    }

    if (query.from || query.to) {
      if (
        (query.from && !validDate(query.from)) ||
        (query.to && !validDate(query.to)) ||
        (query.from && query.to && query.from > query.to)
      ) {
        throw new Error("તારીખની શ્રેણી યોગ્ય નથી.");
      }

      match.createdAt = {};

      if (query.from) {
        match.createdAt.$gte = new Date(query.from + "T00:00:00+05:30");
      }

      if (query.to) {
        match.createdAt.$lt = new Date(
          new Date(query.to + "T00:00:00+05:30").getTime() + 86400000,
        );
      }
    }

    const missing = (document, id) =>
      document || { _id: id, name: "ખાતું ઉપલબ્ધ નથી" };

    const pattis = await Patti.find(match)
      .select(
        "farmer trader cropName man rate gross commission " +
          "farmerNet createdAt payments " +
          "traderPaymentTracked farmerPaymentTracked",
      )
      .sort({ createdAt: -1 })
      .populate({
        path: "farmer",
        select: "name phone",
        transform: missing,
      })
      .populate({
        path: "trader",
        select: "name phone",
        transform: missing,
      })
      .populate("payments.recordedBy", "name")
      .lean();

    res.json(buildReport(pattis));
  }),
);

router.post(
  "/admin/settlements/:id/payments",
  wrap(async (req, res) => {
    if (!validId(req.params.id)) {
      throw new Error("સોદાનો ઓળખ નંબર અમાન્ય છે.");
    }

    const payment = makePayment(req.body, req.user._id);

    const replay = async () => {
      const patti = await Patti.findOne({
        _id: req.params.id,
        "payments.key": payment.key,
      })
        .select("payments")
        .lean();

      if (!patti) return false;

      const existing = patti.payments.find(
        (entry) => entry.key === payment.key,
      );

      if (!samePayment(existing, payment)) {
        throw new Error("આ ઓળખ નંબર બીજી ચુકવણી માટે વપરાયેલો છે.");
      }

      return true;
    };

    if (await replay()) {
      return res.json({
        msg: "આ ચુકવણી પહેલેથી નોંધાયેલી છે.",
      });
    }

    const updated = await Patti.findOneAndUpdate(
      paymentMatch(req.params.id, payment),
      {
        $push: { payments: payment },

        ...(payment.historyComplete
          ? {
              $set: {
                [`${payment.side}PaymentTracked`]: true,
              },
            }
          : {}),
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .select("_id")
      .lean();

    if (!updated) {
      if (await replay()) {
        return res.json({
          msg: "આ ચુકવણી પહેલેથી નોંધાયેલી છે.",
        });
      }

      if (!(await Patti.exists({ _id: req.params.id }))) {
        return res.status(404).json({
          error: "સોદો મળ્યો નથી.",
        });
      }

      return res.status(409).json({
        error: "રકમ બાકી રકમ કરતાં વધુ છે. તાજી વિગતો તપાસો.",
      });
    }

    res.status(201).json({
      msg: "ચુકવણી નોંધાઈ ગઈ.",
    });
  }),
);

export default router;
