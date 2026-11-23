import { useState } from 'react';
import { api } from '../api.js';
import Msg from './Msg.jsx';
import { SECURITY_QUESTIONS } from '../../../shared/securityQuestions.mjs';

// પ્રોફાઇલમાં: સુરક્ષા પ્રશ્ન સેટ / બદલો (જૂના યુઝર માટે પણ)
export default function SecurityQuestionCard({ current, onSaved }) {
  const [q, setQ] = useState(current || '');
  const [a, setA] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');

  const save = async () => {
    try {
      const d = await api('/security', 'PUT', { currentPassword: pw, secQuestion: q, secAnswer: a });
      setMsg(d.msg); setA(''); setPw('');
      onSaved?.();
    } catch (x) { setMsg('⚠ ' + x.message); }
  };

  return (
    <div className="card">
      <h3>🔐 સુરક્ષા પ્રશ્ન</h3>
      <p style={{ marginTop: 0 }}>{current ? '✅ સેટ છે. બદલવો હોય તો નીચે નવો પસંદ કરો.' : '⚠ હજી સેટ નથી. પાસવર્ડ ભુલાઈ જાય તો રીસેટ માટે આ જરૂરી છે.'}</p>
      <label className="field"><span>સુરક્ષા પ્રશ્ન</span>
        <select value={q} onChange={e => setQ(e.target.value)}>
          <option value="">-- પ્રશ્ન પસંદ કરો --</option>
          {SECURITY_QUESTIONS.map(x => <option key={x.id} value={x.id}>{x.text}</option>)}
        </select>
      </label>
      <label className="field"><span>તમારો જવાબ</span>
        <input value={a} onChange={e => setA(e.target.value)} autoComplete="off" />
      </label>
      <label className="field"><span>હાલનો પાસવર્ડ</span>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} />
      </label>
      <button onClick={save}>સેવ કરો</button>
      <Msg e={msg} ok />
    </div>
  );
}