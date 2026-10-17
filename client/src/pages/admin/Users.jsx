// import { useState } from 'react';
// import { api } from '../../api.js';
// import useLoad from '../../hooks/useLoad.js';
// import useAction from '../../hooks/useAction.js';
// import Msg from '../../components/Msg.jsx';
// import CrudTable from '../../components/admin/CrudTable.jsx';

// const ROLE = { farmer: '🌾 ખેડૂત', trader: '💼 વેપારી', agent: '🏪 એજન્ટ' };

// export default function Users() {
//   const [list, load] = useLoad(() => api('/admin/users'));
//   const [msg, run] = useAction();
//   const [role, setRole] = useState('');
//   const [q, setQ] = useState('');
//   const shown = list?.filter(u => (!role || u.role === role) && (!q || (u.name + u.phone).toLowerCase().includes(q.toLowerCase())));
//   return (
//     <>
//       <h2>👥 યુઝર્સ</h2>
//       <div className="card">
//         <select value={role} onChange={e => setRole(e.target.value)}>
//           <option value="">બધા રોલ</option>
//           {Object.entries(ROLE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
//         </select>
//         <input placeholder="🔍 નામ કે મોબાઈલ શોધો" value={q} onChange={e => setQ(e.target.value)} />
//         <Msg e={msg} ok />
//         <CrudTable
//           items={shown}
//            resetKey={role + q}
//           columns={[
//             { label: 'નામ', render: u => u.name },
//             { label: 'રોલ', render: u => ROLE[u.role] },
//             { label: 'મોબાઈલ', render: u => u.phone },
//             { label: 'સ્થિતિ', render: u => (u.blocked ? '🚫 બ્લોક' : '✅ ચાલુ') },
//           ]}
//           fields={[{ key: 'name', label: 'નામ' }, { key: 'phone', label: 'મોબાઈલ' }]}
//           onSave={(u, d) => run(() => api(`/admin/users/${u._id}`, 'PUT', d), load)}
//           onDelete={u => run(() => api(`/admin/users/${u._id}`, 'DELETE'), load)}
//           extra={u => (
//             <button className={u.blocked ? '' : 'alt'} onClick={() => run(() => api(`/admin/users/${u._id}/block`, 'POST', { blocked: !u.blocked }), load)}>
//               {u.blocked ? 'અનબ્લોક' : 'બ્લોક'}
//             </button>
//           )}
//         />
//       </div>
//     </>
//   );
// }


import { useState } from 'react';
import { api } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';

const ROLE = {
  farmer: '🌾 ખેડૂત',
  trader: '💼 વેપારી',
  agent: '🏪 એજન્ટ',
};

export default function Users() {
  const [list, load] = useLoad(() => api('/admin/users'));
  const [msg, run] = useAction();
  const [role, setRole] = useState('');
  const [q, setQ] = useState('');

  const shown = list?.filter(
    u =>
      (!role || u.role === role) &&
      (!q ||
        (u.name + u.phone)
          .toLowerCase()
          .includes(q.toLowerCase())),
  );

  return (
    <>
      <h2>👥 યુઝર્સ</h2>

      <div className="card">
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          <option value="">બધા રોલ</option>

          {Object.entries(ROLE).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <input
          placeholder="🔍 નામ કે મોબાઈલ શોધો"
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <Msg e={msg} ok />

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>નામ</th>
                <th>રોલ</th>
                <th>મોબાઈલ</th>
                <th>સ્થિતિ</th>
                <th>ક્રિયા</th>
              </tr>
            </thead>

            <tbody>
              {shown?.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{ROLE[u.role] || u.role}</td>
                  <td>{u.phone}</td>
                  <td>
                    {u.blocked ? '🚫 બ્લોક' : '✅ ચાલુ'}
                  </td>

                  <td>
                    <button
                      type="button"
                      className={u.blocked ? '' : 'alt'}
                      onClick={() =>
                        run(
                          () =>
                            api(
                              `/admin/users/${u._id}/block`,
                              'POST',
                              { blocked: !u.blocked },
                            ),
                          load,
                        )
                      }
                    >
                      {u.blocked ? 'અનબ્લોક' : 'બ્લોક'}
                    </button>
                  </td>
                </tr>
              ))}

              {shown?.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    કોઈ યુઝર મળ્યા નથી.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}