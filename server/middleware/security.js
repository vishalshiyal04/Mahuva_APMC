// સુરક્ષા: security headers, CORS, rate limit, NoSQL-injection સફાઈ, સલામત error જવાબ
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";

const isProd = process.env.NODE_ENV === "production";

// ફક્ત આ સાઇટ(ઓ)ને API વાપરવા દેવી. .env: ALLOWED_ORIGINS=https://mahuva-apmc.vercel.app
export const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // same-origin / સર્વર-ટુ-સર્વર / curl
    if (!allowedOrigins.length) return cb(null, true); // સેટ નથી: જૂની રીતે ચાલે (નીચે ચેતવણી છપાય છે)
    if (allowedOrigins.includes(origin)) return cb(null, true);
    if (!isProd && LOCAL.test(origin)) return cb(null, true); // ડેવલપમેન્ટમાં localhost
    cb(null, false);
  },
};

// ---- શરૂઆતમાં જ ખોટી/નબળી .env પકડો ----
export function checkEnv() {
  const warn = (m) => console.warn("⚠️  SECURITY:", m);
  const jwt = process.env.JWT_SECRET || "";
  if (!jwt)
    throw new Error(
      "JWT_SECRET .env માં નથી, સર્વર સુરક્ષિત રીતે ચાલી શકે નહીં",
    );
  if (jwt.length < 32)
    warn("JWT_SECRET ટૂંકો છે. ઓછામાં ઓછા 32 અક્ષરનો લાંબો, રેન્ડમ શબ્દ રાખો.");
  const ap = process.env.ADMIN_PASSWORD || "";
  if (
    ap &&
    (ap.length < 10 || /^(admin|password|123456|12345678|qwerty)/i.test(ap))
  )
    warn("ADMIN_PASSWORD નબળો છે. ઓછામાં ઓછા 10 અક્ષર, અક્ષર+અંક+ચિહ્ન રાખો.");
  if (isProd && !allowedOrigins.length)
    warn(
      "ALLOWED_ORIGINS સેટ નથી, એટલે કોઈ પણ વેબસાઇટ તમારી API વાપરી શકે. .env માં તમારી સાઇટનું સરનામું મૂકો.",
    );
}

// ---- NoSQL injection: {"phone": {"$ne": null}} જેવું ઘૂસે નહીં ----
const MAX_DEPTH = 8;
function clean(o, depth = 0) {
  if (!o || typeof o !== "object") return o;
  if (depth > MAX_DEPTH) return {};
  for (const k of Object.keys(o)) {
    if (k.startsWith("$") || k.includes(".")) delete o[k];
    else clean(o[k], depth + 1);
  }
  return o;
}
export const sanitize = (req, res, next) => {
  clean(req.body);
  clean(req.query);
  clean(req.params);
  next();
};

const tooMany = (msg) => (req, res) => res.status(429).json({ error: msg });
const phoneKey = (prefix) => (req) => {
  const p =
    typeof req.body?.phone === "string"
      ? req.body.phone.trim().slice(0, 20)
      : "";
  return p ? `${prefix}:${p}` : `${prefix}-ip:${ipKeyGenerator(req.ip)}`;
};

// લોગિન: એક જ નંબર પર ખોટા પાસવર્ડના પ્રયાસ મર્યાદિત (સફળ લોગિન ગણાતા નથી)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: phoneKey("login"),
  handler: tooMany("ઘણા ખોટા પ્રયાસ થયા છે. 15 મિનિટ પછી ફરી પ્રયાસ કરો"),
});

// પાસવર્ડ ભુલાઈ ગયો (પ્રશ્ન + જવાબ): એક નંબર પર મર્યાદિત
export const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: phoneKey("forgot"),
  handler: tooMany("ઘણા પ્રયાસ થયા છે. 15 મિનિટ પછી ફરી પ્રયાસ કરો"),
});

// નકલી ખાતાં: એક IP પરથી કલાકમાં મર્યાદિત રજીસ્ટ્રેશન
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_REGISTER) || 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: tooMany(
    "આ નેટવર્ક પરથી ઘણા રજીસ્ટ્રેશન થયા છે. થોડા સમય પછી ફરી પ્રયાસ કરો",
  ),
});

// આખી API: ફ્લડ/બૉટ સામે ઊંચી મર્યાદા (ઘણા ફોન એક નેટવર્ક પર હોય તો તકલીફ ન પડે)
export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: Number(process.env.RATE_LIMIT_API) || 6000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: tooMany("ઘણી વિનંતીઓ આવી છે. થોડી વાર પછી ફરી પ્રયાસ કરો"),
});

export function applySecurity(app) {
  checkEnv();
  // Render/Vercel પ્રોક્સીની પાછળ સાચો IP મેળવવા. Vercel→Render બંને હોય તો TRUST_PROXY=2 કરી શકાય
  app.set("trust proxy", Number(process.env.TRUST_PROXY ?? 1));
  app.disable("x-powered-by");
  app.use(
    helmet({
      // આ સર્વર ફક્ત JSON/ફોટા આપે છે, એટલે પેજ તરીકે કશું ચાલવા ન દેવું
      contentSecurityPolicy: {
        useDefaults: false,
        directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" }, // ફોટા સાઇટ પર દેખાય
      hsts: isProd ? { maxAge: 15552000, includeSubDomains: true } : false,
      referrerPolicy: { policy: "no-referrer" },
    }),
  );
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "100kb" }));
  app.use(sanitize);
  app.use("/api", apiLimiter);
}

// છેલ્લો error handler: અંદરની માહિતી/stack બહાર ન જાય
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err?.type === "entity.parse.failed")
    return res.status(400).json({ error: "વિનંતી સાચી નથી" });
  if (err?.type === "entity.too.large")
    return res.status(413).json({ error: "વિનંતી ખૂબ મોટી છે" });
  if (err?.code === "LIMIT_FILE_SIZE")
    return res
      .status(400)
      .json({ error: "ફાઇલ ખૂબ મોટી છે (વધુમાં વધુ 5 MB)" });
  if (err?.name === "MulterError")
    return res.status(400).json({ error: "ફાઇલ અપલોડ થઈ શકી નહીં" });
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ error: "સર્વરમાં ભૂલ થઈ, થોડી વાર પછી ફરી પ્રયાસ કરો" });
}
