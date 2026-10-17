import { useState } from 'react';
import { api } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import Msg from './Msg.jsx';

export default function AdminUsers() {
  const [list, load] = useLoad(() => api('/admin/users'));
  const [msg, setMsg] = useState('');
  const toggle = async u => {
    try { setMsg((await api(`/admin/users/${u._id}/block`, 'POST', { blocked: !u.blocked })).msg); }
    catch (x) { setMsg('⚠ ' + x.message); }
    load();
  };
  return (
    <div className="card">
      <h3>👥 યુઝર મેનેજમેન્ટ</h3>
      <Msg e={msg} ok />
      <table>
        <thead><tr><th>નામ</th><th>રોલ</th><th>મોબાઈલ</th><th>સ્થિતિ</th><th></th></tr></thead>
        <tbody>
          {list?.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td><td>{u.role}</td><td>{u.phone}</td>
              <td>{u.blocked ? '🚫 બ્લોક' : '✅ ચાલુ'}</td>
              <td><button className={u.blocked ? '' : 'alt'} onClick={() => toggle(u)}>{u.blocked ? 'અનબ્લોક' : 'બ્લોક'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}