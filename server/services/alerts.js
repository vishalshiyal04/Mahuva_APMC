import { PriceAlert, Rate } from "../models/index.js";
import { cropMatches, displayCropName } from "../../shared/crops.mjs";
import { normalizeWeightRate } from "./trends.js";
import { indiaDay } from "./assistant.js";
import { notify } from "./notify.js";

// ભાવ → "પ્રતિ મણ" (20 કિલો). એકમ નક્કી ન થાય તો null
export const perMan = (rate) => normalizeWeightRate(rate);

// "ઉપર": આજનો ઊંચો ભાવ ≥ લક્ષ્ય, "નીચે": આજનો નીચો ભાવ ≤ લક્ષ્ય
export function alertHit(alert, price) {
  if (!price) return null;
  if (alert.direction === "above" && price.max >= alert.target)
    return price.max;
  if (alert.direction === "below" && price.min <= alert.target)
    return price.min;
  return null;
}

const rs = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// નવો/સુધારેલો ભાવ સેવ થયા પછી આ બોલાવો. જૂની તારીખના ભાવથી એલર્ટ વાગતા નથી.
export async function checkAlerts(rateDoc) {
  try {
    const rate = rateDoc.toObject ? rateDoc.toObject() : rateDoc;
    if (!rate || rate.date !== indiaDay()) return;
    const price = perMan(rate);
    if (!price) return;
    const active = await PriceAlert.find({ active: true }).lean();
    for (const a of active) {
      if (!cropMatches(rate.crop, a.crop)) continue;
      const hit = alertHit(a, price);
      if (hit == null) continue;
      // બે વાર ન વાગે એટલે પહેલાં બંધ કરો (શરત સાથે), સફળ થાય તો જ સૂચના મોકલો
      const done = await PriceAlert.findOneAndUpdate(
        { _id: a._id, active: true },
        {
          active: false,
          triggeredAt: new Date(),
          triggeredPrice: hit,
          triggeredDate: rate.date,
        },
      );
      if (!done) continue;
      const word = a.direction === "above" ? "ઊંચો" : "નીચો";
      await notify(a.user, {
        type: "alert",
        title: `🔔 ભાવ એલર્ટ: ${displayCropName(a.crop)}`,
        body: `આજનો ${word} ભાવ ${rs(hit)}/મણ થયો (તમારું લક્ષ્ય ${rs(a.target)}).`,
        link: "/alerts",
      });
    }
  } catch (e) {
    console.error("checkAlerts failed:", e.message);
  }
}
