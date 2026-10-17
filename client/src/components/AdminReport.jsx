import { useState } from 'react';
import { tok } from '../api.js';
import Msg from './Msg.jsx';

export default function AdminReport() {
  const [range, setRange] = useState({});
  const [e, setE] = useState('');
  const download = async () => {
    try {
      const r = await fetch('/api/admin/report.csv?' + new URLSearchParams(range), { headers: { Authorization: 'Bearer ' + tok() } });
      if (!r.ok) throw new Error((await r.json()).error || 'ભૂલ');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(await r.blob());
      a.download = 'sales-report.csv';
      a.click();
      URL.revokeObjectURL(a.href);
      setE('');
    } catch (x) { setE('⚠ ' + x.message); }
  };
  return (
    <div className="card">
      <h3>📊 વેચાણ રિપોર્ટ (Excel/CSV)</h3>
      <input type="date" onChange={ev => setRange({ ...range, from: ev.target.value })} />
      <input type="date" onChange={ev => setRange({ ...range, to: ev.target.value })} />
      <button onClick={download}>ડાઉનલોડ</button>
      <Msg e={e} />
    </div>
  );
}