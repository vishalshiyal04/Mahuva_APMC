import { Router } from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { Patti } from "../models/index.js";

const router = Router();

// પટ્ટીનો PDF: ફક્ત તે પટ્ટીનો ખેડૂત / વેપારી અથવા એડમિન
router.get(
  "/patti/:id/pdf",
  auth("farmer", "trader", "admin"),
  wrap(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id))
      throw new Error("પટ્ટી મળી નહીં");
    const p = await Patti.findById(req.params.id)
      .populate("farmer", "name phone")
      .populate("trader", "name phone");
    if (!p) throw new Error("પટ્ટી મળી નહીં");
    const uid = String(req.user._id);
    const isFarmer = String(p.farmer?._id) === uid;
    const isTrader = String(p.trader?._id) === uid;
    if (req.user.role !== "admin" && !isFarmer && !isTrader)
      throw new Error("પરવાનગી નથી");

    // PDF લાઇબ્રેરી જરૂર પડે ત્યારે જ લોડ થાય: npm install બાકી હોય તો પણ આખું સર્વર બંધ ન પડે
    let buildPattiPdf;
    try {
      ({ buildPattiPdf } = await import("../services/pattiPdf.js"));
    } catch (e) {
      console.error("PDF module load failed:", e.message);
      throw new Error("PDF સુવિધા તૈયાર નથી, સર્વરમાં 'npm install' ચલાવો");
    }
    const pdf = await buildPattiPdf(p.toObject(), {
      trader: isTrader && !isFarmer,
    });
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="patti-PT-${String(p._id).slice(-6).toUpperCase()}.pdf"`,
      "Cache-Control": "private, no-store",
    });
    res.send(pdf);
  }),
);

export default router;
