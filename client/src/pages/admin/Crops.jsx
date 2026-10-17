// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import { api } from '../../api.js';
// import useLoad from '../../hooks/useLoad.js';
// import useAction from '../../hooks/useAction.js';
// import Msg from '../../components/Msg.jsx';
// import BidPanel from '../../components/BidPanel.jsx';
// import CrudTable from '../../components/admin/CrudTable.jsx';
// import { CROPS } from '../../constants.js';

// const STATUS = { pending: '⏳ વેરીફાય બાકી', verified: '✔ વેરીફાય', entered: '🚪 યાર્ડમાં', auction: '🔴 હરાજી ચાલુ', sold: '✅ વેચાયું' };
// const locked = c => ['auction', 'sold'].includes(c.status);

// function Verify({ c, run, reload }) {
//   const [shed, setShed] = useState('');
//   return (
//     <>
//       <input size="5" placeholder="શેડ નં" value={shed} onChange={e => setShed(e.target.value)} />
//       <button onClick={() => run(() => api(`/admin/crops/${c._id}/verify`, 'POST', { shed }), reload)}>વેરીફાય</button>
//     </>
//   );
// }

// export default function Crops() {
//   const [crops, load] = useLoad(() => api('/admin/crops'));
//   const [msg, run] = useAction();
//   useEffect(() => { const s = io(); s.on('auction:update', load); return () => s.close(); }, []);
//   const act = (c, a) => run(() => api(`/admin/auction/${c._id}/${a}`, 'POST'), load);

//   return (
//     <>
//       <h2>🌾 માલ અને હરાજી</h2>
//       <Msg e={msg} ok />
//       <div className="card">
//         <CrudTable
//           items={crops}
//           columns={[
//             { label: 'ખેડૂત', render: c => c.farmer?.name },
//             { label: 'માલ', render: c => `${c.name} (${c.grade}) • ${c.man} મણ` },
//             { label: 'સ્થિતિ', render: c => STATUS[c.status] },
//             { label: 'શેડ / ભાવ', render: c => `શેડ: ${c.shed || '-'} • ₹${c.basePrice}` },
//             { label: 'પાસ ID', render: c => <small>{c.passId}</small> },
//           ]}
//           fields={[
//             { key: 'name', label: 'પાક', type: 'select', options: CROPS },
//             { key: 'grade', label: 'ગ્રેડ', type: 'select', options: ['A', 'B', 'C'] },
//             { key: 'man', label: 'મણ', type: 'number' },
//             { key: 'basePrice', label: 'લઘુત્તમ ભાવ/મણ', type: 'number' },
//             { key: 'shed', label: 'શેડ નં' },
//           ]}
//           canEdit={c => !locked(c)}
//           canDelete={c => !locked(c)}
//           onSave={(c, d) => run(() => api(`/admin/crops/${c._id}`, 'PUT', d), load)}
//           onDelete={c => run(() => api(`/admin/crops/${c._id}`, 'DELETE'), load)}
//           extra={c => (
//             <>
//               {c.status === 'pending' && <Verify c={c} run={run} reload={load} />}
//               {c.status === 'entered' && <button onClick={() => act(c, 'start')}>🔨 હરાજી શરૂ</button>}
//               {c.status === 'auction' && <>
//                 <button className="alt" onClick={() => act(c, 'close')}>✅ સોદો પાકો</button>
//                 <button onClick={() => act(c, 'cancel')}>હરાજી રદ</button>
//               </>}
//             </>
//           )}
//         />
//       </div>
//       {crops?.filter(c => c.status === 'auction').map(c => (
//         <div key={c._id} className="card live">
//           <h3><span className="dot" />{c.name} {c.man} મણ • ₹{c.highestBid}/મણ</h3>
//           <BidPanel cropId={c._id} role="admin" />
//         </div>
//       ))}
//     </>
//   );
// }

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import BidPanel from '../../components/BidPanel.jsx';
import CrudTable from '../../components/admin/CrudTable.jsx';
import { displayCropName } from '../../constants.js';

const STATUS = { pending: '⏳ વેરીફાય બાકી', verified: '✔ વેરીફાય', entered: '🚪 યાર્ડમાં', auction: '🔴 હરાજી ચાલુ', sold: '✅ વેચાયું' };
const locked = c => ['auction', 'sold'].includes(c.status);

function Verify({ c, run, reload }) {
  const [shed, setShed] = useState('');
  return (
    <>
      <input size="5" placeholder="શેડ નં" value={shed} onChange={e => setShed(e.target.value)} />
      <button onClick={() => run(() => api(`/admin/crops/${c._id}/verify`, 'POST', { shed }), reload)}>વેરીફાય</button>
    </>
  );
}

export default function Crops() {
  const [crops, load] = useLoad(() => api('/admin/crops'));
  const [msg, run] = useAction();
  useEffect(() => { const s = io(); s.on('auction:update', load); return () => s.close(); }, []);
  const act = (c, a) => run(() => api(`/admin/auction/${c._id}/${a}`, 'POST'), load);

  return (
    <>
      <h2>🌾 માલ અને હરાજી</h2>
      <Msg e={msg} ok />
      <div className="card">
        <CrudTable
          items={crops}
          columns={[
            { label: 'ખેડૂત', render: c => c.farmer?.name },
            { label: 'માલ', render: c => `${displayCropName(c.name)} (${c.grade}) • ${c.man} મણ` },
            { label: 'સ્થિતિ', render: c => STATUS[c.status] },
            { label: 'શેડ / ભાવ', render: c => `શેડ: ${c.shed || '-'} • ₹${c.basePrice}` },
            { label: 'પાસ ID', render: c => <small>{c.passId}</small> },
          ]}
          fields={[
            { key: 'name', label: 'પાક', type: 'crop' },
            { key: 'grade', label: 'ગ્રેડ', type: 'select', options: ['A', 'B', 'C'] },
            { key: 'man', label: 'મણ', type: 'number' },
            { key: 'basePrice', label: 'લઘુત્તમ ભાવ/મણ', type: 'number' },
            { key: 'shed', label: 'શેડ નં' },
          ]}
          canEdit={c => !locked(c)}
          canDelete={c => !locked(c)}
          onSave={(c, d) => run(() => api(`/admin/crops/${c._id}`, 'PUT', d), load)}
          onDelete={c => run(() => api(`/admin/crops/${c._id}`, 'DELETE'), load)}
          extra={c => (
            <>
              {c.status === 'pending' && <Verify c={c} run={run} reload={load} />}
              {c.status === 'entered' && <button onClick={() => act(c, 'start')}>🔨 હરાજી શરૂ</button>}
              {c.status === 'auction' && <>
                <button className="alt" onClick={() => act(c, 'close')}>✅ સોદો પાકો</button>
                <button onClick={() => act(c, 'cancel')}>હરાજી રદ</button>
              </>}
            </>
          )}
        />
      </div>
      {crops?.filter(c => c.status === 'auction').map(c => (
        <div key={c._id} className="card live">
          <h3><span className="dot" />{displayCropName(c.name)} {c.man} મણ • ₹{c.highestBid}/મણ</h3>
          <BidPanel cropId={c._id} role="admin" />
        </div>
      ))}
    </>
  );
}