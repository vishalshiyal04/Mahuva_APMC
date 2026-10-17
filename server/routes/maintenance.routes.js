import { Router } from "express";
import auth from "../middleware/auth.js";
import wrap from "../middleware/wrap.js";
import { io } from "../socket.js";
import { getMaintenance, setMaintenance } from "../services/maintenance.js";

const router = Router();
const pub = (m) => ({
  on: !!m.on,
  message: m.message || "",
  until: m.until || null,
});

router.get(
  "/maintenance",
  wrap(async (req, res) => {
    res.set("Cache-Control", "no-store"); // બ્રાઉઝર જૂનો જવાબ યાદ ન રાખે
    res.json(pub(await getMaintenance()));
  }),
);

// એડમિન: મેન્ટેનન્સ ચાલુ/બંધ, સંદેશ અને અંદાજિત સમય
router.put(
  "/admin/maintenance",
  auth("admin"),
  wrap(async (req, res) => {
    const { on, message, until } = req.body;
    const d = until ? new Date(until) : null;
    if (d && isNaN(d)) throw new Error("અમાન્ય સમય");
    const m = await setMaintenance({
      on: !!on,
      message: String(message || "").slice(0, 300),
      until: d,
    });
    io.emit("maintenance:update", pub(m)); // ખુલ્લી બધી ટેબમાં તરત અસર
    res.json({
      msg: m.on ? "મેન્ટેનન્સ મોડ ચાલુ કર્યો" : "સાઇટ ફરી ચાલુ કરી",
      ...pub(m),
    });
  }),
);

export default router;
