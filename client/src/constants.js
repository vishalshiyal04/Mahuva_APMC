// export const CROPS = ["ડુંગળી", "કપાસ", "મગફળી", "તલ"];
// // માહિતી પેજ (એડમિન એડિટ કરી શકે) અને ટોપ-મેનુ
// export const PAGES = [
//   { slug: "facilities", label: "સુવિધાઓ" },
//   { slug: "chairman", label: "ચેરમેનશ્રીનું નિવેદન" },
//   { slug: "development", label: "વિકાસ કામોની યાદી" },
//   { slug: "technology", label: "અદ્યતન ટેકનોલોજી" },
//   { slug: "committee", label: "વ્યવસ્થાપક મંડળ" },
//   { slug: "guidance", label: "ખેડૂત માર્ગદર્શન" },
// ];
// // ફૂટરમાં બતાવવાની સંપર્ક વિગત: આ કિંમતો તમારી સાચી વિગતથી બદલો.
// // social લિંક ખાલી ('') હોય તો તે આઇકન દેખાશે નહીં.
// export const CONTACT = {
//   address: "કૃષિ ઉત્પન્ન બજાર સમિતિ, માર્કેટિંગ યાર્ડ, મહુવા, ગુજરાત",
//   phone: "+91 00000 00000",
//   email: "info@example.com",
//   hours: "સોમ – શનિ: સવારે 8:00 થી સાંજે 6:00",
//   whatsapp: "", // દા.ત. https://wa.me/919999999999
//   facebook: "",
//   youtube: "",
// };

export {
  CROPS,
  CROP_GROUPS,
  GROUNDNUT_NUMBERS,
  cropGroup,
  normalizeCropName,
  displayCropName,
  isLegacyCrop,
  cropMatches,
} from "../../shared/crops.mjs";
// માહિતી પેજ (એડમિન એડિટ કરી શકે) અને ટોપ-મેનુ
export const PAGES = [
  { slug: "facilities", label: "સુવિધાઓ" },
  { slug: "chairman", label: "ચેરમેનશ્રીનું નિવેદન" },
  { slug: "development", label: "વિકાસ કામોની યાદી" },
  { slug: "technology", label: "અદ્યતન ટેકનોલોજી" },
  { slug: "committee", label: "વ્યવસ્થાપક મંડળ" },
  { slug: "guidance", label: "ખેડૂત માર્ગદર્શન" },
];
// ફૂટરમાં બતાવવાની સંપર્ક વિગત: આ કિંમતો તમારી સાચી વિગતથી બદલો.
// social લિંક ખાલી ('') હોય તો તે આઇકન દેખાશે નહીં.
export const CONTACT = {
  address: "કૃષિ ઉત્પન્ન બજાર સમિતિ, માર્કેટિંગ યાર્ડ, મહુવા, ગુજરાત",
  phone: "+91 00000 00000",
  email: "info@example.com",
  hours: "સોમ – શનિ: સવારે 8:00 થી સાંજે 6:00",
  whatsapp: "", // દા.ત. https://wa.me/919999999999
  facebook: "",
  youtube: "",
};
