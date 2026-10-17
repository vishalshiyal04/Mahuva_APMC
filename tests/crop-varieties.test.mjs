import test from "node:test";
import assert from "node:assert/strict";
import {
  answer,
  validateConfig,
  validateRate,
} from "../server/services/assistant.js";

const today = "2026-10-11";
const numbers = [24, 32, 35, 23, 20, 37, 128];
const rates = [
  { crop: "ડુંગળી", min: 100, max: 200, date: today },
  { crop: "લાલ ડુંગળી", min: 300, max: 400, date: today },
  { crop: "સફેદ ડુંગળી", min: 500, max: 600, date: today },
  ...numbers.map((n) => ({
    crop: `મગફળી ${n}`,
    min: n * 10,
    max: n * 10 + 10,
    unitLabel: "મણ (20 કિલો)",
    unitKg: 20,
    date: today,
  })),
  { crop: "મગફળી", min: 1, max: 2, date: today },
];
const data = { today, config: validateConfig({}), rates, arrivals: [] };
for (const n of numbers) {
  test(`assistant isolates groundnut ${n} including Gujarati digits`, () => {
    for (const digits of [
      String(n),
      String(n).replace(/\d/g, (d) => "૦૧૨૩૪૫૬૭૮૯"[d]),
    ]) {
      const text = answer(`મગફળી ${digits} નંબર ભાવ`, data).text;
      assert.match(text, new RegExp(`મગફળી ${n}`));
      for (const other of numbers.filter((v) => v !== n))
        assert.ok(!text.includes(`મગફળી ${other} —`));
    }
  });
}
test("assistant asks for groundnut number rather than mixing prices", () => {
  const text = answer("મગફળીના ભાવ", data).text;
  assert.match(text, /નંબર.*પસંદ|પસંદ.*નંબર/);
  for (const n of numbers) assert.ok(text.includes(String(n)));
  assert.ok(!text.includes("નીચો:"));
});
test("assistant asks onion colour even when only one colour has prices", () => {
  const text = answer("ડુંગળી ભાવ", { ...data, rates: [rates[1]] }).text;
  assert.match(text, /લાલ/);
  assert.match(text, /સફેદ/);
  assert.ok(!text.includes("નીચો:"));
});
test("24 man is a quantity, not automatically groundnut number 24", () => {
  assert.ok(
    !answer("24 મણ મગફળી ભાવ", data).text.includes("કુલ વેચાણનો અંદાજ:"),
  );
  const text = answer("24 મણ મગફળી 35 નંબર ભાવ", data).text;
  assert.match(text, /મગફળી 35/);
  assert.match(text, /કુલ વેચાણનો અંદાજ/);
  assert.ok(!text.includes("મગફળી 24 —"));
});
test("unsupported requested number never returns other varieties", () => {
  assert.ok(!answer("મગફળી 66 નંબર ભાવ", data).text.includes("નીચો:"));
});
test("rate publication rejects unspecified onion and groundnut", () => {
  for (const crop of ["ડુંગળી", "મગફળી"])
    assert.throws(
      () =>
        validateRate(
          { crop, min: 1, max: 2, date: today, unitLabel: "મણ", unitKg: 20 },
          today,
        ),
      /જાત|નંબર/,
    );
});
