// Gujarati -> English runtime translator.
// Gujarati is the source language of the whole app. When English is selected, every
// visible text node / placeholder / title / aria-label is translated through the
// dictionary in en.js. Selecting Gujarati restores the original text.
import { EN_PHRASES } from "./en.js";

const GU = "\\u0A80-\\u0AFF";
const DIGITS = "૦૧૨૩૪૫૬૭૮૯";

const dict = new Map();
EN_PHRASES.forEach(([gu, en]) => dict.set(gu, en));

// Longest phrase first, whole-word only (never match the middle of a longer Gujarati word)
const keys = [...dict.keys()].sort((a, b) => b.length - a.length);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const RE = new RegExp(
  `(?<![${GU}])(?:${keys.map(esc).join("|")})(?![${GU}])`,
  "g",
);
const HAS_GU = new RegExp(`[${GU}]`);

export const hasGujarati = (s) => HAS_GU.test(s);

export function toEnglish(text) {
  if (!text || !HAS_GU.test(text)) return text;
  const exact = dict.get(text.trim());
  if (exact !== undefined) return text.replace(text.trim(), exact);
  return text
    .replace(/(\d[\d\/.\-]*\d)\s*સુધી/g, "until $1") // "15/12/2026 સુધી" -> "until 15/12/2026"
    .replace(RE, (m) => dict.get(m))
    .replace(/[૦-૯]/g, (d) => String(DIGITS.indexOf(d)));
}

const ATTRS = ["placeholder", "title", "aria-label", "alt"];
const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "CODE", "NOSCRIPT"]);

const textRec = new WeakMap(); // text node -> { orig, out }
const attrRec = new WeakMap(); // element   -> { attr: { orig, out } }
let observer = null;
let active = false;

function doText(node) {
  const p = node.parentNode;
  if (!p || SKIP.has(p.nodeName) || p.isContentEditable) return;
  const cur = node.nodeValue;
  let rec = textRec.get(node);
  if (rec && cur === rec.out) return; // already translated, unchanged
  if (!HAS_GU.test(cur)) {
    if (rec) textRec.delete(node);
    return;
  }
  const out = toEnglish(cur);
  textRec.set(node, { orig: cur, out });
  if (out !== cur) node.nodeValue = out;
}

function doAttrs(el) {
  if (el.nodeType !== 1) return;
  let rec = attrRec.get(el);
  for (const a of ATTRS) {
    const cur = el.getAttribute(a);
    if (cur == null) continue;
    if (rec?.[a] && cur === rec[a].out) continue;
    if (!HAS_GU.test(cur)) continue;
    const out = toEnglish(cur);
    rec = rec || {};
    rec[a] = { orig: cur, out };
    attrRec.set(el, rec);
    if (out !== cur) el.setAttribute(a, out);
  }
}

function walk(root) {
  if (!root) return;
  if (root.nodeType === 3) return doText(root);
  if (root.nodeType !== 1) return;
  doAttrs(root);
  const tw = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );
  let n;
  while ((n = tw.nextNode())) n.nodeType === 3 ? doText(n) : doAttrs(n);
}

function restore(root) {
  const tw = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );
  let n;
  while ((n = tw.nextNode())) {
    if (n.nodeType === 3) {
      const r = textRec.get(n);
      if (r && n.nodeValue === r.out) n.nodeValue = r.orig;
      textRec.delete(n);
    } else {
      const r = attrRec.get(n);
      if (r)
        for (const a in r)
          if (n.getAttribute(a) === r[a].out) n.setAttribute(a, r[a].orig);
      attrRec.delete(n);
    }
  }
}

// window.alert / confirm / prompt messages are plain strings, so patch them too
const native = {
  alert: window.alert,
  confirm: window.confirm,
  prompt: window.prompt,
};
function patchDialogs(on) {
  window.alert = on
    ? (m) => native.alert.call(window, toEnglish(String(m ?? "")))
    : native.alert;
  window.confirm = on
    ? (m) => native.confirm.call(window, toEnglish(String(m ?? "")))
    : native.confirm;
  window.prompt = on
    ? (m, d) => native.prompt.call(window, toEnglish(String(m ?? "")), d)
    : native.prompt;
}

let origTitle = null;
export function startTranslating() {
  if (active) return;
  active = true;
  const root = document.getElementById("root") || document.body;
  walk(root);
  if (origTitle === null) origTitle = document.title;
  document.title = toEnglish(origTitle);
  patchDialogs(true);
  observer = new MutationObserver((muts) => {
    observer.disconnect(); // don't react to our own edits
    for (const m of muts) {
      if (m.type === "characterData") doText(m.target);
      else if (m.type === "attributes") doAttrs(m.target);
      else m.addedNodes.forEach(walk);
    }
    attach(root);
  });
  attach(root);
}

function attach(root) {
  observer.observe(root, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ATTRS,
  });
}

export function stopTranslating() {
  if (!active) return;
  active = false;
  observer?.disconnect();
  observer = null;
  restore(document.getElementById("root") || document.body);
  if (origTitle !== null) document.title = origTitle;
  patchDialogs(false);
}
