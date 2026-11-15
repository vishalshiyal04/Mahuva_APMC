import { toEnglish } from "./translator.js";

// Voice features follow the selected language
export const isEnglish = () => document.documentElement.lang === "en";
export const speechLang = () => (isEnglish() ? "en-IN" : "gu-IN");
export const spoken = (text) => (isEnglish() ? toEnglish(text) : text);
