import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Msg from './Msg.jsx';
import { Link } from 'react-router-dom';
const toLocal = d => {
  if (!d) return '';
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 16);
};

// એડમિન: વેબસાઇટ મેન્ટેનન્સ મોડ ચાલુ/બંધ
export default function AdminMaintenance() {
  const [f, setF] = useState({ on: false, message: '', until: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api('/maintenance').then(d => setF({ on: d.on, message: d.message || '', until: toLocal(d.until) })).catch(() => {});
  }, []);

  const save = async on => {
    if (on && !f.on && !confirm('મેન્ટેનન્સ ચાલુ કરતાં જ બધા ખેડૂત, વેપારી અને એજન્ટને મેન્ટેનન્સ પેજ દેખાશે. ચાલુ કરવું છે?')) return;
    try {
      const d = await api('/admin/maintenance', 'PUT', { on, message: f.message, until: f.until ? new Date(f.until).toISOString() : '' });
      setF(x => ({ ...x, on: d.on }));
      setMsg(d.msg);
    } catch (x) { setMsg('⚠ ' + x.message); }
  };

  return (
    <div className={'card mt-admin-card' + (f.on ? ' on' : '')}>
      <h3>🚧 વેબસાઇટ મેન્ટેનન્સ મોડ</h3>
      <p>સ્થિતિ: <b>{f.on ? '🔴 ચાલુ (ફક્ત એડમિન સાઇટ જોઈ શકે)' : '🟢 બંધ (સાઇટ બધા માટે ખુલ્લી)'}</b></p>
      <label className="field"><span>યુઝરને બતાવવાનો સંદેશ</span>
        <textarea rows="3" placeholder="દા.ત. નવા ફીચર ઉમેરવાનું કામ ચાલુ છે, સાંજે 6 વાગ્યા સુધીમાં સાઇટ ખુલશે." value={f.message} onChange={e => setF({ ...f, message: e.target.value })} />
      </label>
      <label className="field"><span>અંદાજિત પૂરું થવાનો સમય (વૈકલ્પિક, કાઉન્ટડાઉન માટે)</span>
        <input type="datetime-local" value={f.until} onChange={e => setF({ ...f, until: e.target.value })} />
      </label>
      {f.on ? (
        <>
          <button onClick={() => save(true)}>💾 સંદેશ/સમય અપડેટ કરો</button>
          <button className="alt" onClick={() => save(false)}>✅ સાઇટ ફરી ચાલુ કરો</button>
        </>
      ) : (
        <button className="alt" onClick={() => save(true)}>🚧 મેન્ટેનન્સ ચાલુ કરો</button>
      )}
      <Link className="btn-yellow dark" style={{ marginLeft: 8 }} to="/maintenance-preview">👁 યુઝરને કેવું દેખાશે?</Link>
<Msg e={msg} ok />
    </div>
  );
}