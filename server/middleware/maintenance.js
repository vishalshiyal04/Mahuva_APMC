import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { getMaintenance } from "../services/maintenance.js";

async function isAdminToken(req) {
  try {
    const t = (req.headers.authorization || "").replace("Bearer ", "");
    if (!t) return false;
    const p = jwt.verify(t, process.env.JWT_SECRET);
    const u = await User.findById(p.id).select("role");
    return u?.role === "admin";
  } catch {
    return false;
  }
}

// મેન્ટેનન્સ ચાલુ હોય ત્યારે એડમિન સિવાય બધી API રિક્વેસ્ટ બંધ (503)
export default async function maintenance(req, res, next) {
  try {
    const m = await getMaintenance();
    if (!m.on) return next();
    if (req.method === "GET" && req.path === "/maintenance") return next(); // સ્થિતિ જોવા માટે ખુલ્લું
    if (await isAdminToken(req)) return next();
    if (req.method === "POST" && req.path === "/login") {
      // એડમિન લોગિન માટે છૂટ
      const u = await User.findOne({
        phone: String(req.body?.phone || ""),
      }).select("role");
      if (u?.role === "admin") return next();
    }
    res
      .status(503)
      .json({
        error:
          m.message || "સાઇટ હાલ મેન્ટેનન્સમાં છે, થોડી વાર પછી પ્રયાસ કરો",
        maintenance: true,
        until: m.until,
      });
  } catch (e) {
    next(e);
  }
}
