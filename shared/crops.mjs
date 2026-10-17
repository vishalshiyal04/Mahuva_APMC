// Canonical full names use the existing crop/name/cropName fields.
// This catalog never migrates or relabels stored generic records as a variety.
export const GROUNDNUT_NUMBERS = ["24", "32", "35", "23", "20", "37", "128"];
export const CROP_GROUPS = [
  { name: "ડુંગળી", varieties: ["લાલ ડુંગળી", "સફેદ ડુંગળી"] },
  { name: "કપાસ", varieties: [] },
  { name: "મગફળી", varieties: GROUNDNUT_NUMBERS.map((n) => `મગફળી ${n}`) },
  { name: "તલ", varieties: [] },
];
export const CROPS = CROP_GROUPS.flatMap((g) =>
  g.varieties.length ? g.varieties : [g.name],
);
export const cropText = (value) =>
  String(value ?? "")
    .trim()
    .replace(/[૦-૯]/g, (d) => String("૦૧૨૩૪૫૬૭૮૯".indexOf(d)))
    .replace(/\s+/g, " ");

export function normalizeCropName(value) {
  const name = cropText(value);
  if (/^(?:લાલ ડુંગળી|ડુંગળી[\s—-]+લાલ)$/.test(name)) return "લાલ ડુંગળી";
  if (/^(?:સફેદ ડુંગળી|ડુંગળી[\s—-]+સફેદ)$/.test(name)) return "સફેદ ડુંગળી";
  const number = name.match(/^મગફળી[\s—-]+(?:નંબર\s*)?(\d+)(?:\s*નંબર)?$/)?.[1];
  if (number) return `મગફળી ${number}`;
  return name;
}

export function cropGroup(value) {
  const name = normalizeCropName(value);
  return (
    CROP_GROUPS.find((g) => g.name === name || g.varieties.includes(name))
      ?.name || ""
  );
}
export function isLegacyCrop(value) {
  return ["ડુંગળી", "મગફળી"].includes(normalizeCropName(value));
}
export function displayCropName(value) {
  const name = normalizeCropName(value);
  if (isLegacyCrop(name)) return `${name} — જાત નોંધેલી નથી`;
  const number = name.match(/^મગફળી (\d+)$/)?.[1];
  return number ? `મગફળી — ${number} નંબર` : name;
}
export function cropMatches(recordName, selection) {
  return normalizeCropName(recordName) === normalizeCropName(selection);
}
export function validateCropName(value, existingValue) {
  if (typeof value !== "string" || !value.trim() || value.length > 80)
    throw new Error("પાક અને જાત પસંદ કરો.");
  // Editing unrelated fields may retain an existing historical name.
  if (existingValue !== undefined && value === existingValue) return value;
  const name = normalizeCropName(value);
  if (isLegacyCrop(name))
    throw new Error("ડુંગળીની જાત અથવા મગફળીનો નંબર પસંદ કરો.");
  if (!CROPS.includes(name))
    throw new Error("પાકની માન્ય જાત / નંબર પસંદ કરો.");
  return name;
}
