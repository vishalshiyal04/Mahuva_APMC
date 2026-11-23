import { tok } from "../api.js";

// પટ્ટીનો PDF સર્વર પાસેથી લાવો (લોગિન ટોકન સાથે)
export async function fetchPattiPdf(id) {
  const r = await fetch(`/api/patti/${id}/pdf`, {
    headers: { Authorization: "Bearer " + tok() },
  });
  if (!r.ok) {
    let m = "PDF બનાવી શકાયો નહીં";
    try {
      m = (await r.json()).error || m;
    } catch {
      /* ignore */
    }
    throw new Error(m);
  }
  return r.blob();
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export const pattiFile = (p) =>
  `patti-PT-${String(p._id).slice(-6).toUpperCase()}.pdf`;

export async function downloadPatti(p) {
  downloadBlob(await fetchPattiPdf(p._id), pattiFile(p));
}

// મોબાઈલ: શેર શીટ ખુલે (WhatsApp પસંદ કરો) અને PDF ફાઇલ સીધી જોડાય.
// કમ્પ્યુટર: PDF ડાઉનલોડ થાય અને WhatsApp (wa.me) ખુલે, ત્યાં ફાઇલ જોડવી.
export async function sharePatti(p, text) {
  const blob = await fetchPattiPdf(p._id);
  const file = new File([blob], pattiFile(p), { type: "application/pdf" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "મહુવા APMC પટ્ટી", text });
      return "shared";
    } catch (e) {
      if (e.name === "AbortError") return "cancelled";
      /* બીજી ભૂલ: નીચે ડાઉનલોડ વાળા રસ્તે જાઓ */
    }
  }
  downloadBlob(blob, pattiFile(p));
  window.open(
    "https://wa.me/?text=" + encodeURIComponent(text),
    "_blank",
    "noopener",
  );
  return "fallback";
}
