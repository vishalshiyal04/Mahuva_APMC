import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { api } from '../api.js';

// લાઈવ બોલી પેનલ (એડમિન અને ખેડૂત માટે)
export default function BidPanel({ cropId, role }) {
  const [d, setD] = useState(null);
  useEffect(() => {
    const url = role === 'admin' ? `/admin/bids/${cropId}` : `/crops/${cropId}/bids`;
    const load = () => api(url).then(setD).catch(() => {});
    load(); const s = io(import.meta.env.VITE_SOCKET_URL); s.on('auction:update', load); return () => s.close();
  }, [cropId]);
  if (!d) return null;
  const top = d.bids.reduce((a, b) => (!a || b.amount > a.amount ? b : a), null);
  const done = d.eligible > 0 && d.responded >= d.eligible;
  return <div className="card" style={{ margin: '8px 0', minWidth: 220 }}>
    {top ? <b>🏆 સૌથી ઊંચી: ₹{top.amount}/મણ ({top.name})</b> : <b>હજી કોઈ બોલી નથી</b>}
    <div>બોલી લગાવનાર: {new Set(d.bids.map(b => b.name)).size}{role === 'admin' && ` | પાસ: ${d.passes.length} | જવાબ: ${d.responded}/${d.eligible}`}</div>
    {role === 'admin' && done && !d.bids.length && <p className="err">⚠ બધા વેપારીએ પાસ કર્યું, કોઈએ બોલી નથી લગાવી. હરાજી રદ કરી શકો.</p>}
    {role === 'admin' && done && d.bids.length > 0 && <p className="ok">✅ બધા વેપારીએ જવાબ આપી દીધો, સોદો પાકો કરી શકાય.</p>}
    {d.bids.slice(0, 8).map((b, i) => <div key={i}><small>{new Date(b.at).toLocaleTimeString()} — {b.name}: ₹{b.amount}</small></div>)}
    {role === 'admin' && d.passes.length > 0 && <small className="err">પાસ કર્યું: {d.passes.join(', ')}</small>}
  </div>;
}
