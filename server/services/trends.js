import { normalizeCropName, cropMatches } from "../../shared/crops.mjs";
import { indiaDay } from "./assistant.js";

export function trendDays(now = new Date()) {
  const anchor = Date.parse(indiaDay(now) + "T00:00:00Z");
  return Array.from({ length: 7 }, (_, i) =>
    new Date(anchor - (6 - i) * 86400000).toISOString().slice(0, 10),
  );
}
export function normalizeWeightRate(row) {
  if (row.min == null || row.max == null || row.min === "" || row.max === "")
    return null;
  const min = Number(row.min),
    max = Number(row.max);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < min)
    return null;
  const legacyUnit = row.unitKg == null && !String(row.unitLabel || "").trim();
  const kg = legacyUnit ? 20 : Number(row.unitKg);
  if (!Number.isFinite(kg) || kg <= 0) return null;
  const lo = (min * 20) / kg,
    hi = (max * 20) / kg;
  return Number.isFinite(lo) && Number.isFinite(hi)
    ? { min: lo, max: hi, legacyUnit }
    : null;
}
const latestFirst = (a, b) =>
  String(
    b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt || "",
  ).localeCompare(
    String(
      a.createdAt instanceof Date
        ? a.createdAt.toISOString()
        : a.createdAt || "",
    ),
  ) || String(b._id || "").localeCompare(String(a._id || ""));

export function buildTrend(rows, days, selection) {
  const byDate = new Map();
  for (const row of [...rows].sort(latestFirst)) {
    if (
      !days.includes(row.date) ||
      !cropMatches(row.crop, selection) ||
      byDate.has(row.date)
    )
      continue;
    const price = normalizeWeightRate(row);
    if (price) byDate.set(row.date, { _id: row.date, ...price });
  }
  return [...byDate.values()].sort((a, b) => a._id.localeCompare(b._id));
}
export function buildAllTrends(rows, days) {
  const series = {};
  for (const name of new Set(
    rows.map((r) => normalizeCropName(r.crop)).filter(Boolean),
  )) {
    series[name] = Object.fromEntries(
      buildTrend(rows, days, name).map(({ _id, ...price }) => [_id, price]),
    );
  }
  return { days, series };
}
