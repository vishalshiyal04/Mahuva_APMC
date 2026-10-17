// import { useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';
// import { api } from '../api.js';
// import useLoad from '../hooks/useLoad.js';
// import { CROPS } from '../constants.js';
// import { shortDay, summarize } from '../utils/trends.js';

// const MIN = '#b02a62';
// const MAX = '#2f7d46';

// function Change({ label, d }) {
//   if (d === null || d === undefined) return null;
//   if (d === 0) return <span className="chg flat">{label}: કોઈ ફેરફાર નહીં</span>;
//   return <span className={'chg ' + (d > 0 ? 'up' : 'down')}>{label}: {d > 0 ? '▲ +' : '▼ −'}₹{Math.abs(d)}</span>;
// }

// // એક પાકનો ૭ દિવસનો ગ્રાફ
// function CropChart({ crop, days, byDay }) {
//   const ref = useRef();
//   const s = summarize(days, byDay);

//   useEffect(() => {
//     if (!s.points) return;
//     const ch = new Chart(ref.current, {
//       type: 'line',
//       data: {
//         labels: days.map(shortDay),
//         datasets: [
//           { label: 'ઊંચો ભાવ', data: days.map(d => byDay[d]?.max ?? null), borderColor: MAX, backgroundColor: MAX, tension: 0.3, spanGaps: true, pointRadius: 4 },
//           { label: 'નીચો ભાવ', data: days.map(d => byDay[d]?.min ?? null), borderColor: MIN, backgroundColor: 'rgba(176,42,98,.12)', tension: 0.3, spanGaps: true, pointRadius: 4, fill: '-1' },
//         ],
//       },
//       options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: v => '₹' + v } } } },
//     });
//     return () => ch.destroy();
//   }, [JSON.stringify(byDay)]);

//   return (
//     <div className="card">
//       <div className="thead"><h3>{crop}</h3>{s.points > 0 && <b>₹{s.cur.min} – ₹{s.cur.max}</b>}</div>
//       {s.points === 0 ? <p className="muted">છેલ્લા ૭ દિવસમાં ભાવ નથી.</p> : (
//         <>
//           <div className="chgs"><Change label="ઊંચો" d={s.dMax} /><Change label="નીચો" d={s.dMin} /></div>
//           <div className="tchart"><canvas ref={ref} /></div>
//           {s.points < 2 && <p className="muted">ગ્રાફની લાઈન બનવા ઓછામાં ઓછા 2 દિવસના ભાવ જોઈએ.</p>}
//           <small>છેલ્લો ભાવ: {shortDay(s.last)}</small>
//         </>
//       )}
//     </div>
//   );
// }

// // બધા પાકના અલગ-અલગ ગ્રાફ
// export default function TrendCharts() {
//   const [d] = useLoad(() => api('/rates/trends?t=' + Date.now()));
//   const crops = d ? [...new Set([...CROPS, ...Object.keys(d.series)])] : [];
//   return (
//     <>
//       <h2>📈 ૭ દિવસનો ભાવ ટ્રેન્ડ</h2>
//       <div className="tgrid">
//         {crops.map(c => <CropChart key={c} crop={c} days={d.days} byDay={d.series[c] || {}} />)}
//       </div>
//     </>
//   );
// }

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { api } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import { CROPS, displayCropName } from '../constants.js';
import { shortDay, summarize } from '../utils/trends.js';

const MIN = '#b02a62';
const MAX = '#2f7d46';

function Change({ label, d }) {
  if (d === null || d === undefined) return null;
  if (d === 0) return <span className="chg flat">{label}: કોઈ ફેરફાર નહીં</span>;
  return <span className={'chg ' + (d > 0 ? 'up' : 'down')}>{label}: {d > 0 ? '▲ +' : '▼ −'}₹{Math.abs(d)}</span>;
}

// એક પાકનો ૭ દિવસનો ગ્રાફ
function CropChart({ crop, days, byDay }) {
  const ref = useRef();
  const s = summarize(days, byDay);

  useEffect(() => {
    if (!s.points) return;
    const ch = new Chart(ref.current, {
      type: 'line',
      data: {
        labels: days.map(shortDay),
        datasets: [
          { label: 'ઊંચો ભાવ', data: days.map(d => byDay[d]?.max ?? null), borderColor: MAX, backgroundColor: MAX, tension: 0.3, spanGaps: false, pointRadius: 4 },
          { label: 'નીચો ભાવ', data: days.map(d => byDay[d]?.min ?? null), borderColor: MIN, backgroundColor: 'rgba(176,42,98,.12)', tension: 0.3, spanGaps: false, pointRadius: 4, fill: '-1' },
        ],
      },
      options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { ticks: { callback: v => '₹' + v } } } },
    });
    return () => ch.destroy();
  }, [JSON.stringify(byDay)]);

  return (
    <div className="card">
      <div className="thead"><h3>{displayCropName(crop)}</h3>{s.points > 0 && <b>₹{s.cur.min} – ₹{s.cur.max}</b>}</div>
      {s.points === 0 ? <p className="muted">છેલ્લા ૭ દિવસમાં ભાવ નથી.</p> : (
        <>
          <div className="chgs"><Change label="ઊંચો" d={s.dMax} /><Change label="નીચો" d={s.dMin} /></div>
          <div className="tchart"><canvas ref={ref} /></div>
          {s.points < 2 && <p className="muted">ગ્રાફની લાઈન બનવા ઓછામાં ઓછા 2 દિવસના ભાવ જોઈએ.</p>}
          <small>છેલ્લો ભાવ: {shortDay(s.last)}</small>
          {Object.values(byDay).some(p => p.legacyUnit) && <p className="muted">જૂના એકમ વગરના ભાવ અગાઉના ફોર્મેટ પ્રમાણે ₹ / મણ ગણેલા છે. એકમની ખાતરી કરો.</p>}
        </>
      )}
    </div>
  );
}

// બધા પાકના અલગ-અલગ ગ્રાફ
export default function TrendCharts() {
  const [d] = useLoad(() => api('/rates/trends?t=' + Date.now()));
  const crops = d ? [...new Set([...CROPS, ...Object.keys(d.series)])] : [];
  return (
    <>
      <h2>📈 ૭ દિવસનો ભાવ ટ્રેન્ડ — જાત / નંબર મુજબ</h2>
      <p>બધા વજન આધારિત ભાવ ₹ / મણ (20 કિલો) મુજબ છે.</p>
      <div className="tgrid">
        {crops.map(c => <CropChart key={c} crop={c} days={d.days} byDay={d.series[c] || {}} />)}
      </div>
    </>
  );
}