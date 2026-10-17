import { useState } from 'react';
import { api } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import Msg from '../components/Msg.jsx';

// એડમિન: એજન્ટ ખાતાં અને વાર્ષિક લાયસન્સ
export default function AdminAgents() {
  const [list, load] = useLoad(() => api('/admin/agents')); const [f, setF] = useState({}); const [m, setM] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const run = async fn => { try { setM((await fn()).msg); } catch (x) { setM(x.message); } load(); };
  return <div className="card"><h3>કમિશન એજન્ટ સોફ્ટવેર લાયસન્સ</h3>
    <input placeholder="માલિકનું નામ" onChange={set('name')} /><input placeholder="દુકાનનું નામ" onChange={set('shopName')} />
    <input placeholder="મોબાઈલ" onChange={set('phone')} /><input type="password" placeholder="પાસવર્ડ" onChange={set('password')} />
    <button onClick={() => run(() => api('/admin/agents', 'POST', f))}>એજન્ટ ઉમેરો</button><Msg e={m} ok />
    <table><tbody>{list?.map(u => <tr key={u._id}><td>{u.shopName}</td><td>{u.name}</td><td>{u.phone}</td>
      <td>{u.licenseUntil ? new Date(u.licenseUntil).toLocaleDateString() : 'લાયસન્સ નથી'}</td>
      <td><button onClick={() => run(() => api(`/admin/agents/${u._id}/renew`, 'POST'))}>1 વર્ષ ચાલુ કરો</button></td></tr>)}</tbody></table></div>;
}
