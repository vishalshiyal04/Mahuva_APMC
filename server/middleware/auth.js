import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const auth =
  (...roles) =>
  async (req, res, next) => {
    try {
      const t = (req.headers.authorization || "").replace("Bearer ", "");
      const p = jwt.verify(t, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      req.user = await User.findById(p.id);
      // પાસવર્ડ બદલાયા પહેલાંનું ટોકન હવે ચાલે નહીં (ચોરાયેલું ટોકન પણ બંધ)
      if (
        req.user?.pwdChangedAt &&
        p.iat < Math.floor(req.user.pwdChangedAt.getTime() / 1000)
      )
        return res.status(401).json({ error: "ફરી લોગિન કરો" });
      if (req.user?.blocked)
        return res.status(403).json({ error: "આ ખાતું બ્લોક કરેલું છે" });
      if (!req.user || (roles.length && !roles.includes(req.user.role)))
        return res.status(403).json({ error: "પરવાનગી નથી" });
      next();
    } catch {
      res.status(401).json({ error: "ફરી લોગિન કરો" });
    }
  };

export default auth;
