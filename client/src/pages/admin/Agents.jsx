import { useState } from 'react';
import { api } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import CrudTable from '../../components/admin/CrudTable.jsx';

export default function Agents() {
  const [list, load] = useLoad(() => api('/admin/agents'));
  const [msg, run] = useAction();
  const [f, setF] = useState({});
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (
    <>
      <h2>🏪 કમિશન એજન્ટ</h2>
      <div className="card">
        <h3>નવો એજન્ટ ઉમેરો</h3>
        <input placeholder="માલિકનું નામ" onChange={set('name')} />
        <input placeholder="દુકાનનું નામ" onChange={set('shopName')} />
        <input placeholder="મોબાઈલ" onChange={set('phone')} />
        <input type="password" placeholder="પાસવર્ડ" onChange={set('password')} />
        <button onClick={() => run(() => api('/admin/agents', 'POST', f), load)}>એજન્ટ ઉમેરો</button>
        <Msg e={msg} ok />
      </div>
      <div className="card">
        <CrudTable
          items={list}
          columns={[
            { label: 'દુકાન', render: u => u.shopName },
            { label: 'માલિક', render: u => u.name },
            { label: 'મોબાઈલ', render: u => u.phone },
            { label: 'લાયસન્સ', render: u => (u.licenseUntil ? new Date(u.licenseUntil).toLocaleDateString() : 'લાયસન્સ નથી') },
          ]}
          fields={[
            { key: 'name', label: 'માલિકનું નામ' },
            { key: 'shopName', label: 'દુકાનનું નામ' },
            { key: 'phone', label: 'મોબાઈલ' },
            { key: 'password', label: 'નવો પાસવર્ડ (બદલવો હોય તો જ)', type: 'password' },
          ]}
          onSave={(u, d) => { const body = { ...d }; if (!body.password) delete body.password; return run(() => api(`/admin/agents/${u._id}`, 'PUT', body), load); }}
          onDelete={u => run(() => api(`/admin/agents/${u._id}`, 'DELETE'), load)}
          extra={u => <button onClick={() => run(() => api(`/admin/agents/${u._id}/renew`, 'POST'), load)}>1 વર્ષ ચાલુ કરો</button>}
        />
      </div>
    </>
  );
}