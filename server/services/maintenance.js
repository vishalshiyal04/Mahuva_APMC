// import { Setting } from "../models/index.js";

// const DEFAULT = { on: false, message: "", until: null };
// let cache = null; // એક સર્વર પ્રોસેસ માટે (દરેક રિક્વેસ્ટ પર DB ન વાંચવા)

// export async function getMaintenance() {
//   if (!cache) {
//     const s = await Setting.findOne({ key: "maintenance" });
//     cache = { ...DEFAULT, ...(s?.value || {}) };
//   }
//   return cache;
// }

// export async function setMaintenance(value) {
//   cache = { ...DEFAULT, ...value };
//   await Setting.findOneAndUpdate(
//     { key: "maintenance" },
//     { value: cache },
//     { upsert: true },
//   );
//   return cache;
// }

import { Setting } from "../models/index.js";

const DEFAULT = { on: false, message: "", until: null };
const TTL_MS = 2000; // થોડી સેકન્ડ જ યાદ રાખે, પછી હંમેશા ડેટાબેઝમાંથી સાચી સ્થિતિ વાંચે
let cache = null;
let at = 0;

export async function getMaintenance() {
  if (cache && Date.now() - at < TTL_MS) return cache;
  const s = await Setting.findOne({ key: "maintenance" });
  cache = { ...DEFAULT, ...(s?.value || {}) };
  at = Date.now();
  return cache;
}

export async function setMaintenance(value) {
  const v = { ...DEFAULT, ...value };
  await Setting.findOneAndUpdate(
    { key: "maintenance" },
    { value: v },
    { upsert: true, new: true },
  ); // પહેલાં DB માં સેવ
  cache = v;
  at = Date.now();
  return v;
}
