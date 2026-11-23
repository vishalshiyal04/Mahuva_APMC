import { useState } from 'react';
import { api, getAuth } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import Msg from '../components/Msg.jsx';
import CropPicker from '../components/CropPicker.jsx';
import { displayCropName } from '../constants.js';
import '../notify.css';

const rs = n => '₹' + Math.round(Number(n || 0)).toLocaleString('en-IN');

function Status({ a }) {
  if (a.active) return <span className="al-tag on">🟢 ચાલુ</span>;
  if (a.triggeredAt) return <span className="al-tag hit">✅ વાગ્યું • {rs(a.triggeredPrice)} • {new Date(a.triggeredAt).toLocaleDateString('en-GB')}</span>;
  return <span className="al-tag off">⏸ બંધ</span>;
}

// ભાવ એલર્ટ: "આ પાકનો ભાવ આટલો થાય તો મને જણાવો"
export default function Alerts() {
  const [list, load, err] = useLoad(() => api('/alerts'));
  const [crop, setCrop] = useState('');
  const [direction, setDirection] = useState('above');
  const [target, setTarget] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  if (getAuth()?.user?.role === 'admin') return <div className="card">એડમિન માટે ભાવ એલર્ટ ઉપલબ્ધ નથી.</div>;

  const add = async e => {
    e.preventDefault();
    if (!crop) return setMsg('⚠ પાકની જાત / નંબર પસંદ કરો');
    if (!(Number(target) > 0)) return setMsg('⚠ લક્ષ્ય ભાવ સાચો લખો');
    setBusy(true); setMsg('');
    try {
      await api('/alerts', 'POST', { crop, direction, target: Number(target) });
      setTarget('');
      setMsg('એલર્ટ સેવ થયું. ભાવ મળતાં જ ઘંટડી 🔔 માં સૂચના આવશે.');
      load();
    } catch (x) { setMsg('⚠ ' + x.message); }
    setBusy(false);
  };

  const toggle = async a => {
    try { await api(`/alerts/${a._id}`, 'PUT', { active: !a.active }); load(); }
    catch (x) { setMsg('⚠ ' + x.message); }
  };
  const del = async a => {
    if (!confirm('આ એલર્ટ કાઢી નાખવું છે?')) return;
    try { await api(`/alerts/${a._id}`, 'DELETE'); load(); }
    catch (x) { setMsg('⚠ ' + x.message); }
  };

  return (
    <>
      <div className="card">
        <h3>💹 ભાવ એલર્ટ</h3>
        <p className="al-help">તમારો મનપસંદ ભાવ આવે ત્યારે ઘંટડી 🔔 માં સૂચના મળશે. ભાવ પ્રતિ મણ (20 કિલો) મુજબ ગણાય છે. એલર્ટ એક વાર વાગે પછી બંધ થઈ જાય, ફરી ચાલુ કરી શકાય.</p>
        <form onSubmit={add} style={{ marginTop: 14 }}>
          <CropPicker value={crop} onChange={setCrop} label="પાક અને જાત" required={false} />
          <div className="al-form" style={{ marginTop: 12 }}>
            <label className="field"><span>ક્યારે જણાવવું?</span>
              <select value={direction} onChange={e => setDirection(e.target.value)}>
                <option value="above">આજનો ઊંચો ભાવ આટલો કે વધુ થાય</option>
                <option value="below">આજનો નીચો ભાવ આટલો કે ઓછો થાય</option>
              </select>
            </label>
            <label className="field"><span>લક્ષ્ય ભાવ (₹ પ્રતિ મણ)</span>
              <input type="number" inputMode="numeric" min="1" placeholder="દા.ત. 400" value={target} onChange={e => setTarget(e.target.value)} />
            </label>
            <button disabled={busy}>{busy ? 'થોભો...' : '➕ એલર્ટ ઉમેરો'}</button>
          </div>
        </form>
        <Msg e={msg} ok />
      </div>

      <div className="card">
        <h3>મારા એલર્ટ</h3>
        {!list && <p>{err || 'લોડ થઈ રહ્યું છે...'}</p>}
        {list && !list.length && <p>હજી કોઈ એલર્ટ નથી.</p>}
        {list?.map(a => (
          <div key={a._id} className="al-row">
            <div>
              <b>{displayCropName(a.crop)}</b> <Status a={a} /><br />
              <small>{a.direction === 'above' ? 'ઊંચો ભાવ ≥' : 'નીચો ભાવ ≤'} {rs(a.target)} પ્રતિ મણ</small>
            </div>
            <div className="al-actions">
              <button className="alt" onClick={() => toggle(a)}>{a.active ? '⏸ બંધ કરો' : '▶ ફરી ચાલુ કરો'}</button>
              <button className="alt" onClick={() => del(a)}>🗑 કાઢો</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}