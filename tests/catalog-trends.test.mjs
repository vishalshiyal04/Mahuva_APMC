import test from "node:test";
import assert from "node:assert/strict";
import {
  CROPS,
  CROP_GROUPS,
  validateCropName,
  displayCropName,
  cropMatches,
} from "../shared/crops.mjs";
import {
  buildTrend,
  buildAllTrends,
  trendDays,
} from "../server/services/trends.js";

test("catalog contains both onion colours and all seven groundnut numbers exactly once", () => {
  assert.deepEqual(
    CROP_GROUPS.find((g) => g.name === "મગફળી").varieties,
    ["24", "32", "35", "23", "20", "37", "128"].map((n) => `મગફળી ${n}`),
  );
  assert.ok(CROPS.includes("લાલ ડુંગળી"));
  assert.ok(CROPS.includes("સફેદ ડુંગળી"));
  assert.equal(new Set(CROPS).size, CROPS.length);
});
test("new records require a variety; unchanged legacy edits remain valid", () => {
  for (const name of ["ડુંગળી", "મગફળી", "મગફળી 66", ""])
    assert.throws(() => validateCropName(name));
  assert.equal(validateCropName("ડુંગળી", "ડુંગળી"), "ડુંગળી");
  assert.throws(() => validateCropName("મગફળી", "ડુંગળી"));
  assert.equal(validateCropName("મગફળી ૩૨ નંબર"), "મગફળી 32");
});
test("generic data stays separate from exact varieties and is labelled explicitly", () => {
  assert.equal(displayCropName("ડુંગળી"), "ડુંગળી — જાત નોંધેલી નથી");
  assert.ok(!cropMatches("ડુંગળી", "લાલ ડુંગળી"));
  assert.ok(!cropMatches("મગફળી", "મગફળી 24"));
  assert.ok(cropMatches("મગફળી ૨૪ નંબર", "મગફળી 24"));
});
const days = trendDays(new Date("2026-10-10T20:15:00Z"));
const rows = [
  {
    crop: "મગફળી 24",
    date: "2026-10-11",
    min: 100,
    max: 150,
    createdAt: "2026-10-11T01:00:00Z",
  },
  {
    crop: "મગફળી 24 નંબર",
    date: "2026-10-11",
    min: 1000,
    max: 1500,
    unitKg: 100,
    unitLabel: "ક્વિન્ટલ",
    createdAt: "2026-10-11T02:00:00Z",
  },
  {
    crop: "મગફળી 32",
    date: "2026-10-11",
    min: 300,
    max: 350,
    unitKg: 20,
    unitLabel: "મણ",
  },
  { crop: "મગફળી", date: "2026-10-11", min: 1, max: 2 },
  { crop: "લાલ ડુંગળી", date: "2026-10-11", min: 10, max: 20 },
  { crop: "સફેદ ડુંગળી", date: "2026-10-11", min: 30, max: 40 },
  { crop: "મગફળી 24", date: "2026-10-10", min: 1, max: 2, unitLabel: "નંગ" },
  { crop: "મગફળી 24", date: "2026-10-04", min: 1, max: 2 },
];
test("week ends on India day after midnight and contains exactly seven days", () => {
  assert.equal(days[0], "2026-10-05");
  assert.equal(days.at(-1), "2026-10-11");
  assert.equal(days.length, 7);
});
test("graph uses latest rate for exact variety and normalizes quintals to 20kg", () => {
  assert.deepEqual(buildTrend(rows, days, "મગફળી 24"), [
    { _id: "2026-10-11", min: 200, max: 300, legacyUnit: false },
  ]);
});
test("all graph series retain separate colours/numbers/generic legacy data", () => {
  const { series } = buildAllTrends(rows, days);
  assert.equal(series["મગફળી 32"]["2026-10-11"].min, 300);
  assert.equal(series["મગફળી"]["2026-10-11"].min, 1);
  assert.equal(series["લાલ ડુંગળી"]["2026-10-11"].min, 10);
  assert.equal(series["સફેદ ડુંગળી"]["2026-10-11"].min, 30);
  assert.equal(series["મગફળી 24"]["2026-10-10"], undefined);
});
test("graphs skip invalid weights, invalid prices and future dates without mutating source rows", () => {
  const invalid = [
    ...rows,
    { crop: "મગફળી 24", date: "2026-10-11", min: 50, max: 20, createdAt: "z" },
    { crop: "મગફળી 24", date: "2026-10-12", min: 500, max: 600 },
  ];
  const snapshot = JSON.stringify(invalid);
  assert.equal(buildTrend(invalid, days, "મગફળી 24")[0].min, 200);
  assert.equal(JSON.stringify(invalid), snapshot);
});
