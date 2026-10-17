// import { Router } from "express";
// import QRCode from "qrcode";
// import { Crop, Patti } from "../models/index.js";
// import auth from "../middleware/auth.js";
// import wrap from "../middleware/wrap.js";
// import upload from "../middleware/upload.js";
// import { bidInfo } from "../services/bids.js";

// const router = Router();

// router.post(
//   "/crops",
//   auth("farmer"),
//   upload.single("photo"),
//   wrap(async (req, res) => {
//     const { name, grade, man, basePrice } = req.body;
//     if (!(+man > 0) || !(+basePrice > 0)) throw new Error("મણ અને ભાવ ભરો");
//     const passId =
//       "GP" +
//       Date.now().toString(36).toUpperCase() +
//       Math.floor(Math.random() * 99);
//     res.json(
//       await Crop.create({
//         farmer: req.user._id,
//         name,
//         grade,
//         man: +man,
//         basePrice: +basePrice,
//         passId,
//         photo: req.file ? "/uploads/" + req.file.filename : "",
//       }),
//     );
//   }),
// );

// router.get(
//   "/crops/mine",
//   auth("farmer"),
//   wrap(async (req, res) =>
//     res.json(await Crop.find({ farmer: req.user._id }).sort({ createdAt: -1 })),
//   ),
// );

// router.get(
//   "/crops/:id/qr",
//   auth("farmer"),
//   wrap(async (req, res) => {
//     const c = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
//     if (!c) throw new Error("માલ મળ્યો નહીં");
//     res.json({
//       passId: c.passId,
//       qr: await QRCode.toDataURL(c.passId, { width: 280 }),
//     });
//   }),
// );

// router.get(
//   "/patti/mine",
//   auth("farmer", "trader"),
//   wrap(async (req, res) => {
//     const q =
//       req.user.role === "farmer"
//         ? { farmer: req.user._id }
//         : { trader: req.user._id };
//     res.json(
//       await Patti.find(q)
//         .sort({ createdAt: -1 })
//         .populate("farmer trader", "name phone"),
//     );
//   }),
// );

// router.get(
//   "/crops/:id/bids",
//   auth("farmer"),
//   wrap(async (req, res) => {
//     const c = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
//     if (!c) throw new Error("માલ મળ્યો નહીં");
//     res.json(await bidInfo(c._id));
//   }),
// );

// export default router;
import { Router } from "express";
import QRCode from "qrcode";
import { Crop, Patti } from "../models/index.js";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import upload from "../middleware/upload.js";
import { bidInfo } from "../services/bids.js";

import { validateCropName } from "../../shared/crops.mjs";

const router = Router();

router.post(
  "/crops",
  auth("farmer"),
  upload.single("photo"),
  wrap(async (req, res) => {
    const { name, grade, man, basePrice } = req.body;
    if (!(+man > 0) || !(+basePrice > 0)) throw new Error("મણ અને ભાવ ભરો");
    const passId =
      "GP" +
      Date.now().toString(36).toUpperCase() +
      Math.floor(Math.random() * 99);
    res.json(
      await Crop.create({
        farmer: req.user._id,
        name: validateCropName(name),
        grade,
        man: +man,
        basePrice: +basePrice,
        passId,
        photo: req.file ? "/uploads/" + req.file.filename : "",
      }),
    );
  }),
);

router.get(
  "/crops/mine",
  auth("farmer"),
  wrap(async (req, res) =>
    res.json(await Crop.find({ farmer: req.user._id }).sort({ createdAt: -1 })),
  ),
);

router.get(
  "/crops/:id/qr",
  auth("farmer"),
  wrap(async (req, res) => {
    const c = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!c) throw new Error("માલ મળ્યો નહીં");
    res.json({
      passId: c.passId,
      qr: await QRCode.toDataURL(c.passId, { width: 280 }),
    });
  }),
);

router.get(
  "/patti/mine",
  auth("farmer", "trader"),
  wrap(async (req, res) => {
    const q =
      req.user.role === "farmer"
        ? { farmer: req.user._id }
        : { trader: req.user._id };
    res.json(
      await Patti.find(q)
        .sort({ createdAt: -1 })
        .populate("farmer trader", "name phone"),
    );
  }),
);

router.get(
  "/crops/:id/bids",
  auth("farmer"),
  wrap(async (req, res) => {
    const c = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!c) throw new Error("માલ મળ્યો નહીં");
    res.json(await bidInfo(c._id));
  }),
);

export default router;
