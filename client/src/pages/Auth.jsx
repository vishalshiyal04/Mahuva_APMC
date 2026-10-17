import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Msg from '../components/Msg.jsx';

const ROLES = [
  { id: 'farmer', icon: '🌾', title: 'ખેડૂત', text: 'માલ વેચો' },
  { id: 'trader', icon: '💼', title: 'વેપારી', text: 'બોલી લગાવો' },
];

export default function Auth({ mode }) {
  const nav = useNavigate();
  const isReg = mode === 'register';
  const [f, setF] = useState({ role: 'farmer' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [e, setE] = useState('');
  const set = k => ev => setF({ ...f, [k]: ev.target.value });

  const go = async ev => {
    ev.preventDefault();
    const { again, ...payload } = f;
    if (isReg && (f.password || '').length < 8) return setE('પાસવર્ડ ઓછામાં ઓછો 8 અક્ષરનો રાખો');
    if (isReg && f.password !== again) return setE('બંને પાસવર્ડ સરખા નથી');
    setBusy(true);
    try {
      const d = await api(isReg ? '/register' : '/login', 'POST', payload);
      sessionStorage.setItem('auth', JSON.stringify(d));
      nav('/' + d.user.role);
    } catch (x) { setE(x.message); }
    setBusy(false);
  };

  return (
    <div className="auth">
      <aside className="auth-side">
        <h2>{isReg ? 'મહુવા APMC સાથે જોડાઓ' : 'ફરી સ્વાગત છે 👋'}</h2>
        <p>{isReg ? 'ખેડૂત અને વેપારી માટે ડિજિટલ બજાર, થોડી જ મિનિટમાં શરૂ કરો.' : 'તમારા ખાતામાં લોગિન કરીને આગળ વધો.'}</p>
        <ul>
          <li>📈 લાઈવ બજાર ભાવ</li>
          <li>🔨 પારદર્શક ઓનલાઈન હરાજી</li>
          <li>📲 QR ગેટ પાસ</li>
          <li>🧾 ઓટોમેટિક ડિજિટલ પટ્ટી</li>
        </ul>
      </aside>

      <form className="auth-form" onSubmit={go}>
        <h3>{isReg ? 'નવું ખાતું બનાવો' : 'લોગિન કરો'}</h3>

        {isReg && (
          <div className="roles">
            {ROLES.map(r => (
              <button type="button" key={r.id} className={'role' + (f.role === r.id ? ' on' : '')} onClick={() => setF({ ...f, role: r.id })}>
                <span>{r.icon}</span><b>{r.title}</b><small>{r.text}</small>
              </button>
            ))}
          </div>
        )}

        {isReg && (
          <label className="field"><span>👤 પૂરું નામ</span>
            <input placeholder="દા.ત. રમેશભાઈ પટેલ" value={f.name || ''} onChange={set('name')} />
          </label>
        )}

        <label className="field"><span>📱 મોબાઈલ નંબર</span>
          <input type="tel" inputMode="numeric" placeholder="10 અંકનો નંબર" value={f.phone || ''} onChange={set('phone')} />
        </label>

        {isReg && f.role === 'trader' && (
          <div className="slide">
            <label className="field"><span>🏢 GST નંબર</span><input placeholder="GST નંબર" value={f.gst || ''} onChange={set('gst')} /></label>
            <label className="field"><span>📄 લાયસન્સ નંબર</span><input placeholder="લાયસન્સ નંબર" value={f.license || ''} onChange={set('license')} /></label>
          </div>
        )}

        <label className="field"><span>🔒 પાસવર્ડ</span>
          <div className="pw">
            <input type={show ? 'text' : 'password'} placeholder={isReg ? 'ઓછામાં ઓછા 8 અક્ષર' : 'પાસવર્ડ'} value={f.password || ''} onChange={set('password')} />
            <button type="button" className="eye" onClick={() => setShow(s => !s)} aria-label="પાસવર્ડ બતાવો">{show ? '🙈' : '👁'}</button>
          </div>
        </label>

        {isReg && (
          <label className="field"><span>🔁 પાસવર્ડ ફરી લખો</span>
            <input type={show ? 'text' : 'password'} placeholder="પાસવર્ડ ફરી" value={f.again || ''} onChange={set('again')} />
          </label>
        )}

        <Msg e={e} />
        <button className="submit" disabled={busy}>{busy ? 'થોભો...' : isReg ? 'રજીસ્ટર કરો →' : 'લોગિન કરો →'}</button>

        <p className="switch">
          {isReg ? <>પહેલેથી ખાતું છે? <Link to="/login">લોગિન કરો</Link></> : <>નવા છો? <Link to="/register">રજીસ્ટર કરો</Link></>}
        </p>
      </form>
    </div>
  );
}