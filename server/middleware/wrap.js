// રૂટ હેન્ડલર: આપણે જાતે લખેલા error સંદેશા યુઝરને દેખાય, પણ ડેટાબેઝ/કોડની અંદરની ભૂલ ક્યારેય નહીં
const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    if (e?.name === "Error" && !e.code)
      return res.status(400).json({ error: e.message });
    if (e?.code === 11000)
      return res.status(400).json({ error: "આ વિગત પહેલેથી નોંધાયેલી છે" });
    if (e?.name === "CastError")
      return res.status(400).json({ error: "વિગત સાચી નથી" });
    if (e?.name === "ValidationError")
      return res.status(400).json({ error: "વિગતો સાચી નથી, ફરી તપાસો" });
    console.error("Unexpected error:", e);
    res
      .status(500)
      .json({ error: "સર્વરમાં ભૂલ થઈ, થોડી વાર પછી ફરી પ્રયાસ કરો" });
  });

export default wrap;
