// export const TOPICS = {
//   hours: "ઓફિસનો સમય અને રજાઓ",
//   auction: "હરાજીનો સમય",
//   registration: "વેપારી રજીસ્ટ્રેશન",
//   documents: "લાઇસન્સના દસ્તાવેજ",
//   fees: "ફી અને સેસ",
//   schemes: "સરકારી યોજનાઓ",
//   transport: "ટ્રાન્સપોર્ટ અને ગેટ નિયમો",
// };

// export function indiaDay(now = new Date()) {
//   const parts = new Intl.DateTimeFormat("en-CA", {
//     timeZone: "Asia/Kolkata",
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   }).formatToParts(now);

//   const part = (name) => parts.find((p) => p.type === name).value;

//   return `${part("year")}-${part("month")}-${part("day")}`;
// }

// const dayOK = (value) =>
//   typeof value === "string" &&
//   /^\d{4}-\d{2}-\d{2}$/.test(value) &&
//   Number.isFinite(Date.parse(value)) &&
//   new Date(value).toISOString().slice(0, 10) === value;

// const str = (value, max) => {
//   if (value == null) return "";

//   if (typeof value !== "string" || value.length > max) {
//     throw new Error("લખાણ અમાન્ય અથવા ખૂબ લાંબું છે.");
//   }

//   return value.trim();
// };

// export function validateConfig(body) {
//   const expiry = (value) => {
//     const valueString = str(value, 10);

//     if (valueString && !dayOK(valueString)) {
//       throw new Error("સાચી માન્યતા તારીખ આપો.");
//     }

//     return valueString;
//   };

//   const phone = (value) => {
//     const valueString = str(value, 25).replace(/[\s()+-]/g, "");

//     if (valueString && !/^\d{10,15}$/.test(valueString)) {
//       throw new Error("સાચો ફોન નંબર આપો. WhatsApp માટે દેશનો કોડ પણ લખો.");
//     }

//     return valueString;
//   };

//   const status = body.yardStatus || "unknown";

//   if (!["unknown", "open", "closed", "limited"].includes(status)) {
//     throw new Error("યાર્ડની સ્થિતિ અમાન્ય છે.");
//   }

//   const config = {
//     officePhone: phone(body.officePhone),
//     whatsappPhone: phone(body.whatsappPhone),
//     yardStatus: status,
//     yardNote: str(body.yardNote, 500),
//     yardUntil: expiry(body.yardUntil),
//     faq: {},
//   };

//   if (status !== "unknown" && !config.yardUntil) {
//     throw new Error("યાર્ડની સ્થિતિ માટે માન્યતા તારીખ જરૂરી છે.");
//   }

//   for (const key of Object.keys(TOPICS)) {
//     const entry = body.faq?.[key] || {};

//     const text = str(entry.text, 1800);
//     const url = str(entry.url, 500);
//     const until = expiry(entry.until);

//     if (text && !until) {
//       throw new Error(`${TOPICS[key]} માટે માન્યતા તારીખ આપો.`);
//     }

//     if (url) {
//       const parsed = new URL(url);

//       if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
//         throw new Error("સોર્સ માટે સાચી HTTPS લિંક આપો.");
//       }
//     }

//     config.faq[key] = { text, url, until };
//   }

//   return config;
// }

// export function validateRate(body, today = indiaDay()) {
//   const crop = str(body.crop, 80);
//   const unitLabel = str(body.unitLabel, 60);

//   if (!crop || !unitLabel || !dayOK(body.date) || body.date > today) {
//     throw new Error("પાક, એકમ અને સાચી તારીખ આપો.");
//   }

//   const number = (value) => {
//     if (
//       value === "" ||
//       value == null ||
//       !Number.isFinite(Number(value)) ||
//       Number(value) < 0 ||
//       Number(value) > 1e8
//     ) {
//       throw new Error("ભાવ અમાન્ય છે.");
//     }

//     return Number(value);
//   };

//   const min = number(body.min);
//   const max = number(body.max);

//   const avg =
//     body.avg === "" || body.avg == null ? undefined : number(body.avg);

//   const unitKg =
//     body.unitKg === "" || body.unitKg == null ? undefined : number(body.unitKg);

//   if (
//     max < min ||
//     (avg != null && (avg < min || avg > max)) ||
//     (unitKg != null && unitKg <= 0)
//   ) {
//     throw new Error("ભાવની શ્રેણી અથવા એકમનું વજન અમાન્ય છે.");
//   }

//   return {
//     crop,
//     min,
//     max,
//     avg,
//     unitLabel,
//     unitKg,
//     date: body.date,
//   };
// }

// const normalize = (value) =>
//   String(value)
//     .toLowerCase()
//     .replace(/[૦-૯]/g, (digit) => String("૦૧૨૩૪૫૬૭૮૯".indexOf(digit)))
//     .replace(/\s+/g, " ")
//     .trim();

// const ALIASES = [
//   ["સફેદ ડુંગળી", ["સફેદ", "white", "safed"]],
//   ["લાલ ડુંગળી", ["લાલ", "red", "lal"]],
//   ["ડુંગળી", ["ડુંગળી", "dungli", "dungali", "onion"]],
//   ["નારિયળ", ["નારિયળ", "નાળિયેર", "coconut", "nariyal"]],
//   ["મગફળી", ["મગફળી", "magfali", "groundnut", "peanut"]],
//   ["કપાસ", ["કપાસ", "kapas", "cotton"]],
//   ["ઘઉં", ["ઘઉં", "ghau", "wheat"]],
//   ["બાજરી", ["બાજરી", "bajri", "millet"]],
//   ["તલ", ["તલ", "sesame"]],
// ];

// function selectedRates(text, rates) {
//   const query = normalize(text);

//   const family = ALIASES.slice(2).find(([, aliases]) =>
//     aliases.some((alias) => query.includes(alias)),
//   )?.[0];

//   const colour =
//     family === "ડુંગળી"
//       ? ALIASES.slice(0, 2).find(([, aliases]) =>
//           aliases.some((alias) => query.includes(alias)),
//         )?.[0]
//       : null;

//   if (!family) {
//     const exact = rates.filter((rate) => query.includes(normalize(rate.crop)));

//     if (exact.length) return exact;

//     const wantsAll =
//       /^(?:આજના\s*)?(?:બજાર\s*)?ભાવો?$|^(?:rates?|prices?)$|અન્ય પાક|બધા પાક|નીકળ|માલ લઈ|trip|મુસાફરી/.test(
//         query,
//       );

//     return wantsAll ? rates : [];
//   }

//   return rates.filter((rate) => {
//     const name = normalize(rate.crop);

//     const aliases = ALIASES.find(([key]) => key === family)[1];

//     if (!aliases.some((alias) => name.includes(alias))) {
//       return false;
//     }

//     if (colour) {
//       const colourAliases = ALIASES.find(([key]) => key === colour)[1];

//       if (!colourAliases.some((alias) => name.includes(alias))) {
//         return false;
//       }
//     }

//     if (family === "મગફળી") {
//       // "24 મણ" quantity છે; તેને "24 નંબર જાત" ન ગણવી.
//       const withoutQuantity = query.replace(
//         /(?:^|\s)(?:\d+(?:\.\d+)?|\.\d+)\s*(?:મણ|man\b)/g,
//         " ",
//       );

//       const variant = withoutQuantity.match(/\b(24|66)\b/)?.[1];

//       if (variant && !new RegExp(`\\b${variant}\\b`).test(name)) {
//         return false;
//       }
//     }

//     return true;
//   });
// }

// const rupee = (value) =>
//   "₹" +
//   Number(value).toLocaleString("en-IN", {
//     maximumFractionDigits: 2,
//   });

// function priceText(rate, today) {
//   const freshness = rate.date === today ? "આજના ભાવ" : "જૂના નોંધાયેલા ભાવ";

//   return [
//     `${rate.crop} — ${freshness} (${rate.date})`,
//     `નીચો: ${rupee(rate.min)} | ઊંચો: ${rupee(rate.max)}`,
//     `સરેરાશ: ${rate.avg == null ? "નોંધાયેલ નથી" : rupee(rate.avg)}`,
//     `એકમ: ${rate.unitLabel || "નોંધાયેલ નથી; ઓફિસમાં ખાતરી કરો."}`,
//   ].join("\n");
// }

// function yardText(config, today) {
//   if (
//     config.yardStatus === "unknown" ||
//     !dayOK(config.yardUntil) ||
//     config.yardUntil < today
//   ) {
//     return (
//       "યાર્ડ ખુલ્લું છે કે બંધ તેની તાજી ખાતરી નથી. " +
//       "નીકળતાં પહેલાં ઓફિસમાં પૂછો."
//     );
//   }

//   const status = {
//     open: "ચાલુ",
//     closed: "બંધ",
//     limited: "મર્યાદિત પ્રવેશ",
//   }[config.yardStatus];

//   return [
//     `યાર્ડ: ${status}`,
//     config.yardNote,
//     `Adminની નોંધ ${config.yardUntil} સુધી માન્ય.`,
//   ].join("\n");
// }

// function arrivalsText(arrivals, today) {
//   const list = arrivals.length
//     ? arrivals
//         .map(
//           (arrival) =>
//             `${arrival.crop}: ${arrival.man} મણ, ${arrival.lots} એન્ટ્રી`,
//         )
//         .join("\n")
//     : "હજુ કોઈ એન્ટ્રી નોંધાઈ નથી.";

//   return [
//     `આજની ગેટમાં નોંધાયેલી આવક (${today}):`,
//     list,
//     "ગેટની એન્ટ્રીઓ પરથી યાર્ડ ખુલ્લું છે કે બંધ તે નક્કી થતું નથી.",
//   ].join("\n");
// }

// export function answer(message, data) {
//   const query = normalize(message);
//   const { today, config, arrivals } = data;

//   const rates = data.rates.filter(
//     (rate) =>
//       dayOK(rate.date) &&
//       rate.date <= today &&
//       Number.isFinite(rate.min) &&
//       Number.isFinite(rate.max) &&
//       rate.min <= rate.max,
//   );

//   const reply = (text) => ({ text, links: [] });

//   if (
//     /મારા પૈસા|મારી આવક|મારી ખરીદી|મારું ખાતું|my account|payment status/.test(
//       query,
//     )
//   ) {
//     return {
//       ...reply("તમારી પોતાની નોંધાયેલી વિગતો માટે લોગિન જરૂરી છે."),
//       action: "account",
//     };
//   }

//   if (/નીકળ|માલ લઈ|trip|મુસાફરી/.test(query)) {
//     const prices = selectedRates(query, rates)
//       .slice(0, 6)
//       .map((rate) => priceText(rate, today))
//       .join("\n\n");

//     return reply(
//       [
//         yardText(config, today),
//         prices || "ભાવ નોંધાયેલા નથી.",
//         arrivalsText(arrivals, today),
//         "પાસ/QR અને જરૂરી દસ્તાવેજ તપાસો. ગુણવત્તા મુજબ હરાજીનો ભાવ બદલાઈ શકે છે.",
//       ].join("\n\n"),
//     );
//   }

//   if (/આવક|arrival/.test(query)) {
//     return reply(arrivalsText(arrivals, today));
//   }

//   if (/સંપર્ક|ફોન|contact|whatsapp|વોટ્સએપ/.test(query)) {
//     const result = reply(
//       config.officePhone
//         ? `ઓફિસ: ${config.officePhone}`
//         : "ઓફિસનો સંપર્ક નંબર હજુ Adminએ નોંધ્યો નથી.",
//     );

//     if (config.officePhone) {
//       result.links.push({
//         label: "ઓફિસમાં ફોન કરો",
//         href: `tel:${config.officePhone}`,
//       });
//     }

//     if (config.whatsappPhone) {
//       result.links.push({
//         label: "ઓફિસને WhatsApp કરો",
//         href:
//           `https://wa.me/${config.whatsappPhone}?text=` +
//           encodeURIComponent("રામ રામ, મહુવા APMC અંગે માહિતી જોઈએ છે."),
//       });
//     }

//     return result;
//   }

//   const topic = [
//     ["schemes", /યોજના|સબસિડી|scheme|subsidy/],
//     ["documents", /દસ્તાવેજ|ડોક્યુમેન્ટ|લાઇસન્સ|document|license/],
//     ["registration", /રજીસ્ટ|નોંધણી|registration/],
//     ["fees", /ફી|સેસ|કમિશન|fee|cess/],
//     ["transport", /ટ્રાન્સપોર્ટ|ટ્રક|ગેટ નિયમ|transport/],
//     ["auction", /હરાજી|auction/],
//     ["hours", /સમય|રજા|holiday|hours/],
//   ].find(([, regex]) => regex.test(query))?.[0];

//   if (topic) {
//     const entry = config.faq[topic];

//     if (!entry?.text || !dayOK(entry.until) || entry.until < today) {
//       return reply(
//         `${TOPICS[topic]} અંગે તાજી મંજૂર માહિતી નથી. ઓફિસમાં ખાતરી કરો.`,
//       );
//     }

//     return {
//       text: [
//         TOPICS[topic],
//         entry.text,
//         `માહિતી ${entry.until} સુધી માન્ય.`,
//       ].join("\n"),

//       links: entry.url ? [{ label: "માહિતીનો સોર્સ", href: entry.url }] : [],
//     };
//   }

//   if (/યાર્ડ|yard|ચાલુ|બંધ/.test(query)) {
//     return reply(yardText(config, today));
//   }

//   const hasCrop =
//     ALIASES.some(([, aliases]) =>
//       aliases.some((alias) => query.includes(alias)),
//     ) || rates.some((rate) => query.includes(normalize(rate.crop)));

//   if (/ભાવ|rate|price|પાક|અંદાજ|estimate/.test(query) || hasCrop) {
//     const selected = selectedRates(query, rates);

//     if (!selected.length) {
//       return reply(
//         "આ પાક અથવા જાતના ભાવ નોંધાયેલા મળ્યા નથી. નામ અને જાત તપાસો અથવા ઓફિસમાં પૂછો.",
//       );
//     }

//     const amount = query.match(/(?:^|\s)([^\s]+?)\s*(?:મણ|man\b)/);

//     if (amount) {
//       if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(amount[1])) {
//         return reply("મણની સંખ્યા જેમ કે 10 અથવા 10.5 લખો.");
//       }

//       const man = Number(amount[1]);

//       if (man <= 0 || man > 100000) {
//         return reply("મણની સંખ્યા 0 કરતાં વધુ અને 1,00,000 સુધી આપો.");
//       }

//       if (selected.length !== 1) {
//         return reply(
//           "અંદાજ માટે એક પાક અને જાત સ્પષ્ટ લખો. જેમ કે: ૧૦ મણ સફેદ ડુંગળી.",
//         );
//       }

//       const rate = selected[0];

//       if (
//         !rate.unitLabel ||
//         !Number.isFinite(rate.unitKg) ||
//         rate.unitKg <= 0
//       ) {
//         return reply(
//           "ભાવના એકમનું વજન નોંધાયેલ નથી. એકમની ખાતરી વગર મણનો અંદાજ કાઢી શકાય નહીં.",
//         );
//       }

//       const units = (man * 20) / rate.unitKg;

//       return reply(
//         [
//           priceText(rate, today),
//           "",
//           `${man} મણ (૧ મણ = ૨૦ કિલો) માટે કુલ વેચાણનો અંદાજ: ${rupee(
//             units * rate.min,
//           )} થી ${rupee(units * rate.max)}`,
//           "આ ખર્ચ/કમિશન પહેલાંનો અંદાજ છે. અંતિમ હરાજી ભાવ અને ખેડૂતની ચોખ્ખી આવક અલગ હોઈ શકે છે.",
//         ].join("\n"),
//       );
//     }

//     return reply(
//       selected
//         .slice(0, 12)
//         .map((rate) => priceText(rate, today))
//         .join("\n\n") +
//         (selected.length > 12 ? "\nવધુ માટે પાકનું નામ લખો." : ""),
//     );
//   }

//   return reply(
//     "રામ રામ! 🙏 પાકનું નામ અથવા વિકલ્પ લખો: ડુંગળીના ભાવ, આજની આવક, માલ લઈ નીકળતાં પહેલાં, હરાજી સમય, દસ્તાવેજ, ફી, યોજનાઓ, સંપર્ક, મારા પૈસા.\nઅંદાજ માટે: ૧૦ મણ સફેદ ડુંગળી.",
//   );
// }

// export function accountReply(pattis, role) {
//   const farmer = role === "farmer";
//   const side = farmer ? "farmer" : "trader";

//   let due = 0;
//   let paid = 0;
//   let pending = 0;
//   let unknown = 0;

//   const crops = new Map();

//   for (const patti of pattis) {
//     const total = Math.round(
//       Number(farmer ? patti.farmerNet : patti.gross) * 100,
//     );

//     const receipts = (patti.payments || [])
//       .filter((payment) => payment.side === side)
//       .reduce((sum, payment) => sum + Number(payment.amountPaise || 0), 0);

//     const known = patti[`${side}PaymentTracked`] === true;

//     if (
//       !Number.isSafeInteger(total) ||
//       total < 0 ||
//       !Number.isSafeInteger(receipts)
//     ) {
//       throw new Error("રકમની નોંધ તપાસવાની જરૂર છે.");
//     }

//     due += total;
//     paid += receipts;

//     if (known) {
//       pending += Math.max(0, total - receipts);
//     } else {
//       unknown++;
//     }

//     const crop = crops.get(patti.cropName) || {
//       man: 0,
//       amount: 0,
//     };

//     crop.man += Number(patti.man || 0);
//     crop.amount += total;

//     crops.set(patti.cropName, crop);
//   }

//   const cropLines = [...crops]
//     .map(
//       ([name, crop]) => `${name}: ${crop.man} મણ — ${rupee(crop.amount / 100)}`,
//     )
//     .join("\n");

//   return {
//     text: [
//       `તમારી નોંધાયેલી ${pattis.length} પટ્ટી`,
//       `${farmer ? "કમિશન બાદ હકની રકમ" : "કુલ ખરીદી"}: ${rupee(due / 100)}`,
//       `${
//         farmer ? "ખેડૂતને નોંધાયેલી પ્રાપ્તિ" : "APMC/એજન્ટને નોંધાયેલી ચુકવણી"
//       }: ${rupee(paid / 100)}`,
//       `ખાતરીવાળી બાકી: ${rupee(pending / 100)}`,
//       `ઇતિહાસ અધૂરો: ${unknown} સોદા (તેમની બાકી ઉપર ગણેલી નથી).`,
//       "",
//       "પાક મુજબ:",
//       cropLines || "હજુ પટ્ટી નોંધાઈ નથી.",
//       "",
//       "આ Adminએ નોંધેલો હિસાબ છે; બેંક બેલેન્સ નથી. વેપારીની ચુકવણી અને ખેડૂતની પ્રાપ્તિ અલગ છે.",
//     ].join("\n"),

//     links: [],
//   };
// }

import {
  GROUNDNUT_NUMBERS,
  validateCropName,
  normalizeCropName,
} from "../../shared/crops.mjs";

export const TOPICS = {
  hours: "ઓફિસનો સમય અને રજાઓ",
  auction: "હરાજીનો સમય",
  registration: "વેપારી રજીસ્ટ્રેશન",
  documents: "લાઇસન્સના દસ્તાવેજ",
  fees: "ફી અને સેસ",
  schemes: "સરકારી યોજનાઓ",
  transport: "ટ્રાન્સપોર્ટ અને ગેટ નિયમો",
};

export function indiaDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const part = (name) => parts.find((p) => p.type === name).value;

  return `${part("year")}-${part("month")}-${part("day")}`;
}

const dayOK = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;

const str = (value, max) => {
  if (value == null) return "";

  if (typeof value !== "string" || value.length > max) {
    throw new Error("લખાણ અમાન્ય અથવા ખૂબ લાંબું છે.");
  }

  return value.trim();
};

export function validateConfig(body) {
  const expiry = (value) => {
    const valueString = str(value, 10);

    if (valueString && !dayOK(valueString)) {
      throw new Error("સાચી માન્યતા તારીખ આપો.");
    }

    return valueString;
  };

  const phone = (value) => {
    const valueString = str(value, 25).replace(/[\s()+-]/g, "");

    if (valueString && !/^\d{10,15}$/.test(valueString)) {
      throw new Error("સાચો ફોન નંબર આપો. WhatsApp માટે દેશનો કોડ પણ લખો.");
    }

    return valueString;
  };

  const status = body.yardStatus || "unknown";

  if (!["unknown", "open", "closed", "limited"].includes(status)) {
    throw new Error("યાર્ડની સ્થિતિ અમાન્ય છે.");
  }

  const config = {
    officePhone: phone(body.officePhone),
    whatsappPhone: phone(body.whatsappPhone),
    yardStatus: status,
    yardNote: str(body.yardNote, 500),
    yardUntil: expiry(body.yardUntil),
    faq: {},
  };

  if (status !== "unknown" && !config.yardUntil) {
    throw new Error("યાર્ડની સ્થિતિ માટે માન્યતા તારીખ જરૂરી છે.");
  }

  for (const key of Object.keys(TOPICS)) {
    const entry = body.faq?.[key] || {};

    const text = str(entry.text, 1800);
    const url = str(entry.url, 500);
    const until = expiry(entry.until);

    if (text && !until) {
      throw new Error(`${TOPICS[key]} માટે માન્યતા તારીખ આપો.`);
    }

    if (url) {
      const parsed = new URL(url);

      if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
        throw new Error("સોર્સ માટે સાચી HTTPS લિંક આપો.");
      }
    }

    config.faq[key] = { text, url, until };
  }

  return config;
}

export function validateRate(body, today = indiaDay(), existingCrop) {
  const crop = validateCropName(str(body.crop, 80), existingCrop);
  const unitLabel = str(body.unitLabel, 60);

  if (!crop || !unitLabel || !dayOK(body.date) || body.date > today) {
    throw new Error("પાક, એકમ અને સાચી તારીખ આપો.");
  }

  const number = (value) => {
    if (
      value === "" ||
      value == null ||
      !Number.isFinite(Number(value)) ||
      Number(value) < 0 ||
      Number(value) > 1e8
    ) {
      throw new Error("ભાવ અમાન્ય છે.");
    }

    return Number(value);
  };

  const min = number(body.min);
  const max = number(body.max);

  const avg =
    body.avg === "" || body.avg == null ? undefined : number(body.avg);

  const unitKg =
    body.unitKg === "" || body.unitKg == null ? undefined : number(body.unitKg);

  if (
    max < min ||
    (avg != null && (avg < min || avg > max)) ||
    (unitKg != null && unitKg <= 0)
  ) {
    throw new Error("ભાવની શ્રેણી અથવા એકમનું વજન અમાન્ય છે.");
  }

  return {
    crop,
    min,
    max,
    avg,
    unitLabel,
    unitKg,
    date: body.date,
  };
}

const normalize = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[૦-૯]/g, (digit) => String("૦૧૨૩૪૫૬૭૮૯".indexOf(digit)))
    .replace(/\s+/g, " ")
    .trim();

const ALIASES = [
  ["સફેદ ડુંગળી", ["સફેદ", "white", "safed"]],
  ["લાલ ડુંગળી", ["લાલ", "red", "lal"]],
  ["ડુંગળી", ["ડુંગળી", "dungli", "dungali", "onion"]],
  ["નારિયળ", ["નારિયળ", "નાળિયેર", "coconut", "nariyal"]],
  ["મગફળી", ["મગફળી", "magfali", "groundnut", "peanut"]],
  ["કપાસ", ["કપાસ", "kapas", "cotton"]],
  ["ઘઉં", ["ઘઉં", "ghau", "wheat"]],
  ["બાજરી", ["બાજરી", "bajri", "millet"]],
  ["તલ", ["તલ", "sesame"]],
];

function selectedRates(text, rates) {
  const query = normalize(text);

  const family = ALIASES.slice(2).find(([, aliases]) =>
    aliases.some((alias) => query.includes(alias)),
  )?.[0];

  const colour =
    family === "ડુંગળી"
      ? ALIASES.slice(0, 2).find(([, aliases]) =>
          aliases.some((alias) => query.includes(alias)),
        )?.[0]
      : null;

  if (!family) {
    const exact = rates.filter((rate) => query.includes(normalize(rate.crop)));

    if (exact.length) return exact;

    const wantsAll =
      /^(?:આજના\s*)?(?:બજાર\s*)?ભાવો?$|^(?:rates?|prices?)$|અન્ય પાક|બધા પાક|નીકળ|માલ લઈ|trip|મુસાફરી/.test(
        query,
      );

    return wantsAll ? rates : [];
  }

  return rates.filter((rate) => {
    const name = normalize(normalizeCropName(rate.crop));

    const aliases = ALIASES.find(([key]) => key === family)[1];

    if (!aliases.some((alias) => name.includes(alias))) {
      return false;
    }

    if (colour) {
      const colourAliases = ALIASES.find(([key]) => key === colour)[1];

      if (!colourAliases.some((alias) => name.includes(alias))) {
        return false;
      }
    }

    if (family === "મગફળી") {
      // "24 મણ" quantity છે; તેને "24 નંબર જાત" ન ગણવી.
      const withoutQuantity = query.replace(
        /(?:^|\s)(?:\d+(?:\.\d+)?|\.\d+)\s*(?:મણ|man\b)/g,
        " ",
      );

      const variant = withoutQuantity.match(/\b(\d+)\b/)?.[1];

      if (variant && !new RegExp(`\\b${variant}\\b`).test(name)) {
        return false;
      }
    }

    return true;
  });
}

const rupee = (value) =>
  "₹" +
  Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

function priceText(rate, today) {
  const freshness = rate.date === today ? "આજના ભાવ" : "જૂના નોંધાયેલા ભાવ";

  return [
    `${rate.crop} — ${freshness} (${rate.date})`,
    `નીચો: ${rupee(rate.min)} | ઊંચો: ${rupee(rate.max)}`,
    `સરેરાશ: ${rate.avg == null ? "નોંધાયેલ નથી" : rupee(rate.avg)}`,
    `એકમ: ${rate.unitLabel || "નોંધાયેલ નથી; ઓફિસમાં ખાતરી કરો."}`,
  ].join("\n");
}

function yardText(config, today) {
  if (
    config.yardStatus === "unknown" ||
    !dayOK(config.yardUntil) ||
    config.yardUntil < today
  ) {
    return (
      "યાર્ડ ખુલ્લું છે કે બંધ તેની તાજી ખાતરી નથી. " +
      "નીકળતાં પહેલાં ઓફિસમાં પૂછો."
    );
  }

  const status = {
    open: "ચાલુ",
    closed: "બંધ",
    limited: "મર્યાદિત પ્રવેશ",
  }[config.yardStatus];

  return [
    `યાર્ડ: ${status}`,
    config.yardNote,
    `Adminની નોંધ ${config.yardUntil} સુધી માન્ય.`,
  ].join("\n");
}

function arrivalsText(arrivals, today) {
  const list = arrivals.length
    ? arrivals
        .map(
          (arrival) =>
            `${arrival.crop}: ${arrival.man} મણ, ${arrival.lots} એન્ટ્રી`,
        )
        .join("\n")
    : "હજુ કોઈ એન્ટ્રી નોંધાઈ નથી.";

  return [
    `આજની ગેટમાં નોંધાયેલી આવક (${today}):`,
    list,
    "ગેટની એન્ટ્રીઓ પરથી યાર્ડ ખુલ્લું છે કે બંધ તે નક્કી થતું નથી.",
  ].join("\n");
}

export function answer(message, data) {
  const query = normalize(message);
  const { today, config, arrivals } = data;

  const rates = data.rates.filter(
    (rate) =>
      dayOK(rate.date) &&
      rate.date <= today &&
      Number.isFinite(rate.min) &&
      Number.isFinite(rate.max) &&
      rate.min <= rate.max,
  );

  const reply = (text) => ({ text, links: [] });

  if (
    /મારા પૈસા|મારી આવક|મારી ખરીદી|મારું ખાતું|my account|payment status/.test(
      query,
    )
  ) {
    return {
      ...reply("તમારી પોતાની નોંધાયેલી વિગતો માટે લોગિન જરૂરી છે."),
      action: "account",
    };
  }

  if (/નીકળ|માલ લઈ|trip|મુસાફરી/.test(query)) {
    const prices = selectedRates(query, rates)
      .slice(0, 6)
      .map((rate) => priceText(rate, today))
      .join("\n\n");

    return reply(
      [
        yardText(config, today),
        prices || "ભાવ નોંધાયેલા નથી.",
        arrivalsText(arrivals, today),
        "પાસ/QR અને જરૂરી દસ્તાવેજ તપાસો. ગુણવત્તા મુજબ હરાજીનો ભાવ બદલાઈ શકે છે.",
      ].join("\n\n"),
    );
  }

  if (/આવક|arrival/.test(query)) {
    return reply(arrivalsText(arrivals, today));
  }

  if (/સંપર્ક|ફોન|contact|whatsapp|વોટ્સએપ/.test(query)) {
    const result = reply(
      config.officePhone
        ? `ઓફિસ: ${config.officePhone}`
        : "ઓફિસનો સંપર્ક નંબર હજુ Adminએ નોંધ્યો નથી.",
    );

    if (config.officePhone) {
      result.links.push({
        label: "ઓફિસમાં ફોન કરો",
        href: `tel:${config.officePhone}`,
      });
    }

    if (config.whatsappPhone) {
      result.links.push({
        label: "ઓફિસને WhatsApp કરો",
        href:
          `https://wa.me/${config.whatsappPhone}?text=` +
          encodeURIComponent("રામ રામ, મહુવા APMC અંગે માહિતી જોઈએ છે."),
      });
    }

    return result;
  }

  const topic = [
    ["schemes", /યોજના|સબસિડી|scheme|subsidy/],
    ["documents", /દસ્તાવેજ|ડોક્યુમેન્ટ|લાઇસન્સ|document|license/],
    ["registration", /રજીસ્ટ|નોંધણી|registration/],
    ["fees", /ફી|સેસ|કમિશન|fee|cess/],
    ["transport", /ટ્રાન્સપોર્ટ|ટ્રક|ગેટ નિયમ|transport/],
    ["auction", /હરાજી|auction/],
    ["hours", /સમય|રજા|holiday|hours/],
  ].find(([, regex]) => regex.test(query))?.[0];

  if (topic) {
    const entry = config.faq[topic];

    if (!entry?.text || !dayOK(entry.until) || entry.until < today) {
      return reply(
        `${TOPICS[topic]} અંગે તાજી મંજૂર માહિતી નથી. ઓફિસમાં ખાતરી કરો.`,
      );
    }

    return {
      text: [
        TOPICS[topic],
        entry.text,
        `માહિતી ${entry.until} સુધી માન્ય.`,
      ].join("\n"),

      links: entry.url ? [{ label: "માહિતીનો સોર્સ", href: entry.url }] : [],
    };
  }

  if (/યાર્ડ|yard|ચાલુ|બંધ/.test(query)) {
    return reply(yardText(config, today));
  }

  const hasCrop =
    ALIASES.some(([, aliases]) =>
      aliases.some((alias) => query.includes(alias)),
    ) || rates.some((rate) => query.includes(normalize(rate.crop)));

  if (/ભાવ|rate|price|પાક|અંદાજ|estimate/.test(query) || hasCrop) {
    const withoutQuantity = query.replace(
      /(?:^|\s)(?:\d+(?:\.\d+)?|\.\d+)\s*(?:મણ|man\b)/g,
      " ",
    );
    if (
      /ડુંગળી|dungli|dungali|onion/.test(query) &&
      !/સફેદ|લાલ|white|red|safed|lal/.test(query)
    ) {
      return reply(
        "ડુંગળીની જાત પસંદ કરો: લાલ ડુંગળી અથવા સફેદ ડુંગળી. જેમ કે: લાલ ડુંગળીના ભાવ.",
      );
    }
    if (
      /મગફળી|magfali|groundnut|peanut/.test(query) &&
      !withoutQuantity.match(/\b\d+\b/)
    ) {
      return reply(
        "મગફળીનો નંબર પસંદ કરો: " +
          GROUNDNUT_NUMBERS.join(", ") +
          ". જેમ કે: મગફળી 24 નંબરના ભાવ.",
      );
    }
    const selected = selectedRates(query, rates);

    if (!selected.length) {
      return reply(
        "આ પાક અથવા જાતના ભાવ નોંધાયેલા મળ્યા નથી. નામ અને જાત તપાસો અથવા ઓફિસમાં પૂછો.",
      );
    }

    const amount = query.match(/(?:^|\s)([^\s]+?)\s*(?:મણ|man\b)/);

    if (amount) {
      if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(amount[1])) {
        return reply("મણની સંખ્યા જેમ કે 10 અથવા 10.5 લખો.");
      }

      const man = Number(amount[1]);

      if (man <= 0 || man > 100000) {
        return reply("મણની સંખ્યા 0 કરતાં વધુ અને 1,00,000 સુધી આપો.");
      }

      if (selected.length !== 1) {
        return reply(
          "અંદાજ માટે એક પાક અને જાત સ્પષ્ટ લખો. જેમ કે: ૧૦ મણ સફેદ ડુંગળી.",
        );
      }

      const rate = selected[0];

      if (
        !rate.unitLabel ||
        !Number.isFinite(rate.unitKg) ||
        rate.unitKg <= 0
      ) {
        return reply(
          "ભાવના એકમનું વજન નોંધાયેલ નથી. એકમની ખાતરી વગર મણનો અંદાજ કાઢી શકાય નહીં.",
        );
      }

      const units = (man * 20) / rate.unitKg;

      return reply(
        [
          priceText(rate, today),
          "",
          `${man} મણ (૧ મણ = ૨૦ કિલો) માટે કુલ વેચાણનો અંદાજ: ${rupee(
            units * rate.min,
          )} થી ${rupee(units * rate.max)}`,
          "આ ખર્ચ/કમિશન પહેલાંનો અંદાજ છે. અંતિમ હરાજી ભાવ અને ખેડૂતની ચોખ્ખી આવક અલગ હોઈ શકે છે.",
        ].join("\n"),
      );
    }

    return reply(
      selected
        .slice(0, 12)
        .map((rate) => priceText(rate, today))
        .join("\n\n") +
        (selected.length > 12 ? "\nવધુ માટે પાકનું નામ લખો." : ""),
    );
  }

  return reply(
    "રામ રામ! 🙏 પાકનું નામ અથવા વિકલ્પ લખો: ડુંગળીના ભાવ, આજની આવક, માલ લઈ નીકળતાં પહેલાં, હરાજી સમય, દસ્તાવેજ, ફી, યોજનાઓ, સંપર્ક, મારા પૈસા.\nઅંદાજ માટે: ૧૦ મણ સફેદ ડુંગળી.",
  );
}

export function accountReply(pattis, role) {
  const farmer = role === "farmer";
  const side = farmer ? "farmer" : "trader";

  let due = 0;
  let paid = 0;
  let pending = 0;
  let unknown = 0;

  const crops = new Map();

  for (const patti of pattis) {
    const total = Math.round(
      Number(farmer ? patti.farmerNet : patti.gross) * 100,
    );

    const receipts = (patti.payments || [])
      .filter((payment) => payment.side === side)
      .reduce((sum, payment) => sum + Number(payment.amountPaise || 0), 0);

    const known = patti[`${side}PaymentTracked`] === true;

    if (
      !Number.isSafeInteger(total) ||
      total < 0 ||
      !Number.isSafeInteger(receipts)
    ) {
      throw new Error("રકમની નોંધ તપાસવાની જરૂર છે.");
    }

    due += total;
    paid += receipts;

    if (known) {
      pending += Math.max(0, total - receipts);
    } else {
      unknown++;
    }

    const crop = crops.get(patti.cropName) || {
      man: 0,
      amount: 0,
    };

    crop.man += Number(patti.man || 0);
    crop.amount += total;

    crops.set(patti.cropName, crop);
  }

  const cropLines = [...crops]
    .map(
      ([name, crop]) => `${name}: ${crop.man} મણ — ${rupee(crop.amount / 100)}`,
    )
    .join("\n");

  return {
    text: [
      `તમારી નોંધાયેલી ${pattis.length} પટ્ટી`,
      `${farmer ? "કમિશન બાદ હકની રકમ" : "કુલ ખરીદી"}: ${rupee(due / 100)}`,
      `${
        farmer ? "ખેડૂતને નોંધાયેલી પ્રાપ્તિ" : "APMC/એજન્ટને નોંધાયેલી ચુકવણી"
      }: ${rupee(paid / 100)}`,
      `ખાતરીવાળી બાકી: ${rupee(pending / 100)}`,
      `ઇતિહાસ અધૂરો: ${unknown} સોદા (તેમની બાકી ઉપર ગણેલી નથી).`,
      "",
      "પાક મુજબ:",
      cropLines || "હજુ પટ્ટી નોંધાઈ નથી.",
      "",
      "આ Adminએ નોંધેલો હિસાબ છે; બેંક બેલેન્સ નથી. વેપારીની ચુકવણી અને ખેડૂતની પ્રાપ્તિ અલગ છે.",
    ].join("\n"),

    links: [],
  };
}
