import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Msg from '../components/Msg.jsx';

// પાસવર્ડ ભુલાઈ ગયો: સ્ટેપ 1 મોબાઈલ → સ્ટેપ 2 સુરક્ષા પ્રશ્નનો જવાબ + નવો પાસવર્ડ
export default function ForgotPassword() {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [pw, setPw] = useState('');
  const [again, setAgain] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [e, setE] = useState('');
  const [done, setDone] = useState('');

  const getQuestion = async ev => {
    ev.preventDefault();
    setE(''); setBusy(true);
    try {
      const d = await api('/forgot/question', 'POST', { phone });
      setQuestion(d.question);
      setStep(2);
    } catch (x) { setE('⚠ ' + x.message); }
    setBusy(false);
  };

  const reset = async ev => {
    ev.preventDefault();
    if (pw.length < 8) return setE('⚠ પાસવર્ડ ઓછામાં ઓછો 8 અક્ષરનો રાખો');
    if (pw !== again) return setE('⚠ બંને પાસવર્ડ સરખા નથી');
    setE(''); setBusy(true);
    try {
      const d = await api('/forgot/reset', 'POST', { phone, answer, password: pw });
      setDone(d.msg);
      setTimeout(() => nav('/login'), 2500);
    } catch (x) { setE('⚠ ' + x.message); }
    setBusy(false);
  };

  return (
    <div className="auth">
      <aside className="auth-side">
        <h2>પાસવર્ડ ભુલાઈ ગયો? 🔐</h2>
        <p>ચિંતા ન કરો. રજીસ્ટ્રેશન વખતે પસંદ કરેલા સુરક્ષા પ્રશ્નનો જવાબ આપી નવો પાસવર્ડ બનાવો.</p>
      </aside>

      {done ? (
        <div className="auth-form">
          <h3>✅ સફળ</h3>
          <p className="ok">{done}</p>
          <Link className="submit" style={{ textAlign: 'center', textDecoration: 'none' }} to="/login">લોગિન કરો →</Link>
        </div>
      ) : step === 1 ? (
        <form className="auth-form" onSubmit={getQuestion}>
          <h3>પાસવર્ડ રીસેટ કરો</h3>
          <label className="field"><span>📱 મોબાઈલ નંબર</span>
            <input type="tel" inputMode="numeric" placeholder="10 અંકનો નંબર" value={phone} onChange={ev => setPhone(ev.target.value)} />
          </label>
          <Msg e={e} />
          <button className="submit" disabled={busy}>{busy ? 'થોભો...' : 'આગળ →'}</button>
          <p className="switch"><Link to="/login">← લોગિન પર પાછા</Link></p>
        </form>
      ) : (
        <form className="auth-form" onSubmit={reset}>
          <h3>સુરક્ષા પ્રશ્ન</h3>
          <p className="fp-q">{question}</p>
          <label className="field"><span>✍️ તમારો જવાબ</span>
            <input value={answer} onChange={ev => setAnswer(ev.target.value)} autoComplete="off" />
          </label>
          <label className="field"><span>🔒 નવો પાસવર્ડ</span>
            <div className="pw">
              <input type={show ? 'text' : 'password'} placeholder="ઓછામાં ઓછા 8 અક્ષર" value={pw} onChange={ev => setPw(ev.target.value)} />
              <button type="button" className="eye" onClick={() => setShow(s => !s)} aria-label="પાસવર્ડ બતાવો">{show ? '🙈' : '👁'}</button>
            </div>
          </label>
          <label className="field"><span>🔁 પાસવર્ડ ફરી લખો</span>
            <input type={show ? 'text' : 'password'} placeholder="પાસવર્ડ ફરી" value={again} onChange={ev => setAgain(ev.target.value)} />
          </label>
          <Msg e={e} />
          <button className="submit" disabled={busy}>{busy ? 'થોભો...' : 'પાસવર્ડ બદલો →'}</button>
          <p className="switch"><a href="#" onClick={ev => { ev.preventDefault(); setStep(1); setE(''); }}>← નંબર બદલો</a></p>
        </form>
      )}
    </div>
  );
}