import { Router } from "express";

import { Rate, Crop, Page, Patti } from "../models/index.js";

import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";

import {
  indiaDay,
  validateConfig,
  validateRate,
  answer,
  accountReply,
} from "../services/assistant.js";

const router = Router();
const SLUG = "assistant-config";

async function readConfig() {
  const page = await Page.findOne({ slug: SLUG }).lean();

  return {
    ...validateConfig(page ? JSON.parse(page.body) : {}),
    updatedAt: page?.updatedAt,
  };
}

// જાહેર માહિતી: ભાવ, આવક અને Adminની મંજૂર માહિતી.
router.post(
  "/assistant/message",
  wrap(async (req, res) => {
    if (
      typeof req.body.text !== "string" ||
      !req.body.text.trim() ||
      req.body.text.length > 500
    ) {
      throw new Error("પ્રશ્ન ૧ થી ૫૦૦ અક્ષરમાં લખો.");
    }

    const today = indiaDay();
    const start = new Date(`${today}T00:00:00+05:30`);
    const end = new Date(start.getTime() + 86400000);

    const [config, rates, arrivals] = await Promise.all([
      readConfig(),

      Rate.aggregate([
        {
          $match: {
            date: {
              $lte: today,
              $regex: /^\d{4}-\d{2}-\d{2}$/,
            },
          },
        },
        { $sort: { date: -1, createdAt: -1, _id: -1 } },
        {
          $group: {
            _id: "$crop",
            record: { $first: "$$ROOT" },
          },
        },
        { $replaceRoot: { newRoot: "$record" } },
        { $sort: { crop: 1 } },
      ]),

      Crop.aggregate([
        {
          $match: {
            enteredAt: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: "$name",
            man: { $sum: "$man" },
            lots: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            crop: "$_id",
            man: 1,
            lots: 1,
          },
        },
        { $sort: { crop: 1 } },
      ]),
    ]);

    res.json(
      answer(req.body.text, {
        today,
        config,
        rates,
        arrivals,
      }),
    );
  }),
);

// ખાનગી હિસાબ: JWTમાં રહેલા યુઝરનો જ ડેટા.
router.get(
  "/assistant/account",
  auth("farmer", "trader", "admin", "agent"),
  wrap(async (req, res) => {
    if (req.user.role === "admin") {
      return res.json({
        text: "બધા યુઝર્સનો હિસાબ Adminના આવક અને ચુકવણી પેજમાં જુઓ.",
        links: [
          {
            label: "હિસાબ ખોલો",
            href: "/admin/settlements",
          },
        ],
      });
    }

    if (req.user.role === "agent") {
      return res.json({
        text: "આ ખાતાનો સારાંશ હાલમાં ખેડૂત અને વેપારી માટે છે. એજન્ટની માહિતી તમારા એજન્ટ પેજમાં જુઓ.",
        links: [],
      });
    }

    // Query/bodyમાંથી farmerId અથવા traderId લેવાતો નથી.
    const pattis = await Patti.find({
      [req.user.role]: req.user._id,
    })
      .select(
        "cropName man gross farmerNet payments.side payments.amountPaise farmerPaymentTracked traderPaymentTracked",
      )
      .lean();

    res.json(accountReply(pattis, req.user.role));
  }),
);

router.get(
  "/admin/assistant",
  auth("admin"),
  wrap(async (_, res) => {
    res.json(await readConfig());
  }),
);

router.put(
  "/admin/assistant",
  auth("admin"),
  wrap(async (req, res) => {
    const config = validateConfig(req.body);

    await Page.findOneAndUpdate(
      { slug: SLUG },
      {
        title: "ડિજિટલ સહાયકની જાહેર માહિતી",
        body: JSON.stringify(config),
      },
      {
        upsert: true,
        runValidators: true,
      },
    );

    res.json({ msg: "સહાયકની માહિતી સેવ થઈ." });
  }),
);

router.post(
  "/admin/assistant/rates",
  auth("admin"),
  wrap(async (req, res) => {
    await Rate.create(validateRate(req.body));

    res.json({ msg: "એકમ સાથે ભાવ પ્રકાશિત થયા." });
  }),
);

export default router;
