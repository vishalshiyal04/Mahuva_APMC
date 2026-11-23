// પટ્ટીનો PDF (A4). ગુજરાતી અક્ષરો માટે Noto Sans Gujarati, અંગ્રેજી/અંકો માટે Noto Sans.
import PDFDocument from "pdfkit";
import { createRequire } from "node:module";
import { displayCropName } from "../../shared/crops.mjs";

// ફોન્ટ npm પેકેજમાંથી આવે છે (npm install થી આપોઆપ), અલગ ફાઇલ મૂકવાની જરૂર નથી
const require = createRequire(import.meta.url);
const font = (pkg, file) => require.resolve(`@fontsource/${pkg}/files/${file}`);
const F = {
  gu: font("noto-sans-gujarati", "noto-sans-gujarati-gujarati-400-normal.woff"),
  guB: font(
    "noto-sans-gujarati",
    "noto-sans-gujarati-gujarati-700-normal.woff",
  ),
  en: font("noto-sans", "noto-sans-latin-400-normal.woff"),
  enB: font("noto-sans", "noto-sans-latin-700-normal.woff"),
};

const GU_CHAR = /[\u0A80-\u0AFF]/;
// લખાણને ગુજરાતી / બિન-ગુજરાતી ટુકડામાં વહેંચો.
// ગુજરાતી ફોન્ટમાં ફક્ત ગુજરાતી અક્ષરો અને ₹ છે; અંકો, સ્પેસ અને ચિહ્નો (: ( ) / -) અંગ્રેજી ફોન્ટથી દોરાય.
function runs(str) {
  const out = [];
  let cur = null;
  for (const ch of String(str ?? "")) {
    const kind =
      GU_CHAR.test(ch) || ch === "\u200c" || ch === "\u200d" || ch === "₹"
        ? "gu"
        : "en";
    if (cur && cur.kind === kind) cur.t += ch;
    else {
      cur = { kind, t: ch };
      out.push(cur);
    }
  }
  return out;
}

const rs = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const pid = (p) => "PT-" + String(p._id).slice(-6).toUpperCase();
const dt = (d) =>
  new Date(d).toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" });
const tm = (d) =>
  new Date(d).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

export function buildPattiPdf(p, { trader = false } = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      info: {
        Title: `Patti ${pid(p)}`,
        Author: "Mahuva APMC",
        Subject: "Digital sales patti",
      },
    });
    const bufs = [];
    doc.on("data", (b) => bufs.push(b));
    doc.on("end", () => resolve(Buffer.concat(bufs)));
    doc.on("error", reject);

    for (const [k, v] of Object.entries(F)) doc.registerFont(k, v);

    // મિશ્ર ભાષાનું લખાણ: width માપો અને ટુકડા-ટુકડે દોરો
    const widthOf = (str, size, bold) =>
      runs(str).reduce((w, r) => {
        doc
          .font(r.kind === "gu" ? (bold ? "guB" : "gu") : bold ? "enB" : "en")
          .fontSize(size);
        return w + doc.widthOfString(r.t);
      }, 0);
    const text = (str, x, y, o = {}) => {
      const size = o.size || 10;
      const w = widthOf(str, size, o.bold);
      let cx = x;
      if (o.align === "center") cx = x + ((o.width || 0) - w) / 2;
      if (o.align === "right") cx = x + (o.width || 0) - w;
      doc.fillColor(o.color || "#17151f");
      for (const r of runs(str)) {
        doc
          .font(
            r.kind === "gu" ? (o.bold ? "guB" : "gu") : o.bold ? "enB" : "en",
          )
          .fontSize(size);
        doc.text(r.t, cx, y, { lineBreak: false });
        cx += doc.widthOfString(r.t);
      }
      return w;
    };

    const W = doc.page.width; // 595
    const L = 40;
    const R = W - 40;
    const CW = R - L;

    // બાહ્ય ફ્રેમ
    doc
      .lineWidth(1.2)
      .strokeColor("#17151f")
      .rect(28, 28, W - 56, 600)
      .stroke();
    doc
      .lineWidth(0.5)
      .strokeColor("#b02a62")
      .rect(32, 32, W - 64, 592)
      .stroke();

    // હેડર
    let y = 52;
    text("મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ", L, y, {
      size: 20,
      bold: true,
      align: "center",
      width: CW,
    });
    y += 32;
    text("ડિજિટલ વેચાણ પટ્ટી", L, y, {
      size: 14,
      bold: true,
      align: "center",
      width: CW,
      color: "#b02a62",
    });
    y += 26;
    doc.moveTo(L, y).lineTo(R, y).lineWidth(1).strokeColor("#17151f").stroke();
    y += 14;

    // મેટા
    text("પટ્ટી નં:", L, y, { size: 10.5, bold: true });
    text(pid(p), L + 56, y, { size: 10.5 });
    const when = `${dt(p.createdAt)} ${tm(p.createdAt)}`;
    const wl = widthOf("તારીખ: ", 10.5, true);
    const ww = widthOf(when, 10.5, false);
    text("તારીખ:", R - wl - ww, y, { size: 10.5, bold: true });
    text(when, R - ww, y, { size: 10.5 });
    y += 20;
    text("વેપારીની ચૂકવણી:", L, y, { size: 10.5, bold: true });
    text(p.paid ? `ચૂકવાઈ ગયું (${dt(p.paidAt)})` : "બાકી", L + 100, y, {
      size: 10.5,
      color: p.paid ? "#1e7a46" : "#b45309",
      bold: true,
    });
    if (p.paid && p.paymentId) {
      const idw = widthOf(`Payment ID: ${p.paymentId}`, 9.5, false);
      text(`Payment ID: ${p.paymentId}`, R - idw, y, { size: 9.5 });
    }
    y += 28;

    // ખેડૂત / વેપારી બોક્સ
    const bw = (CW - 14) / 2;
    const party = (x, title, u) => {
      doc
        .roundedRect(x, y, bw, 62, 6)
        .lineWidth(0.8)
        .strokeColor("#c9c4d6")
        .stroke();
      text(title, x + 12, y + 9, { size: 10, bold: true, color: "#6c6a7a" });
      text(u?.name || "-", x + 12, y + 25, { size: 12.5, bold: true });
      text(u?.phone || "", x + 12, y + 43, { size: 10 });
    };
    party(L, "ખેડૂત", p.farmer);
    party(L + bw + 14, "વેપારી", p.trader);
    y += 84;

    // કોષ્ટક
    const cols = [
      { h: "ક્રમ", w: 40, a: "center" },
      { h: "પાકની વિગત", w: CW - 40 - 60 - 100 - 110, a: "left" },
      { h: "મણ", w: 60, a: "right" },
      { h: "ભાવ (₹/મણ)", w: 100, a: "right" },
      { h: "રકમ", w: 110, a: "right" },
    ];
    doc.rect(L, y, CW, 26).fillColor("#17151f").fill();
    let cx = L;
    for (const c of cols) {
      text(c.h, cx + 8, y + 7, {
        size: 10.5,
        bold: true,
        color: "#ffffff",
        align: c.a,
        width: c.w - 16,
      });
      cx += c.w;
    }
    y += 26;
    const row = [
      "1",
      displayCropName(p.cropName),
      String(p.man),
      Number(p.rate || 0).toLocaleString("en-IN"),
      rs(p.gross),
    ];
    cx = L;
    cols.forEach((c, i) => {
      text(row[i], cx + 8, y + 9, { size: 11, align: c.a, width: c.w - 16 });
      cx += c.w;
    });
    y += 32;
    doc
      .moveTo(L, y)
      .lineTo(R, y)
      .lineWidth(0.8)
      .strokeColor("#c9c4d6")
      .stroke();
    y += 18;

    // સરવાળો
    const sw = 300;
    const sx = R - sw;
    const sumRow = (label, val, o = {}) => {
      if (o.grand) {
        doc
          .rect(sx, y - 5, sw, 28)
          .fillColor("#f3effc")
          .fill();
      }
      text(label, sx + 10, y + 1, {
        size: o.grand ? 11.5 : 10.5,
        bold: !!o.grand,
      });
      text(val, sx, y + 1, {
        size: o.grand ? 12.5 : 10.5,
        bold: !!o.grand,
        align: "right",
        width: sw - 10,
      });
      y += o.grand ? 34 : 24;
    };
    sumRow("કુલ રકમ", rs(p.gross));
    if (!trader) {
      const perMan = p.man ? p.commission / p.man : 0;
      sumRow(`બજાર કમિશન (${rs(perMan)} × ${p.man} મણ)`, rs(p.commission));
      sumRow("ખેડૂતને ચૂકવવાપાત્ર રકમ", rs(p.farmerNet), { grand: true });
    } else {
      sumRow("વેપારીએ ચૂકવવાપાત્ર રકમ", rs(p.gross), { grand: true });
    }

    // સહીઓ
    y = 500;
    const sigW = (CW - 40) / 3;
    ["ખેડૂતની સહી", "વેપારીની સહી", "APMC ની સહી"].forEach((s, i) => {
      const x = L + i * (sigW + 20);
      doc
        .moveTo(x, y)
        .lineTo(x + sigW, y)
        .lineWidth(0.8)
        .strokeColor("#17151f")
        .stroke();
      text(s, x, y + 6, { size: 10, align: "center", width: sigW });
    });

    text("આ કમ્પ્યુટર દ્વારા બનાવેલી પટ્ટી છે.", L, 590, {
      size: 9.5,
      align: "center",
      width: CW,
      color: "#6c6a7a",
    });

    doc.end();
  });
}
