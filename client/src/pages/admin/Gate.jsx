import { useState } from 'react';
import { api } from '../../api.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import Scanner from '../../components/Scanner.jsx';

export default function Gate() {
  const [pass, setPass] = useState('');
  const [msg, run] = useAction();
  const enter = id => run(() => api('/admin/scan', 'POST', { passId: id }));
  return (
    <>
      <h2>🚪 ગેટ એન્ટ્રી</h2>
      <div className="card">
        <h3>QR પાસ ID થી પ્રવેશ</h3>
        <input placeholder="ગેટ પાસ ID" value={pass} onChange={e => setPass(e.target.value)} />
        <button onClick={() => enter(pass)}>પ્રવેશ આપો</button>
        <Scanner onScan={enter} />
        <Msg e={msg} ok />
      </div>
    </>
  );
}