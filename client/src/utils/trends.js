export const shortDay = (d) => d.slice(8) + "/" + d.slice(5, 7); // 2026-10-04 → 04/10

// days: ૭ તારીખ, byDay: { 'YYYY-MM-DD': { min, max } } → છેલ્લો ભાવ અને પાછલા ભાવથી ફેરફાર
export function summarize(days, byDay = {}) {
  const have = days.filter((d) => byDay[d]);
  const last = have[have.length - 1];
  if (!last) return { points: 0 };
  const prev = have[have.length - 2];
  const cur = byDay[last];
  return {
    points: have.length,
    last,
    cur,
    dMax: prev ? cur.max - byDay[prev].max : null,
    dMin: prev ? cur.min - byDay[prev].min : null,
  };
}
