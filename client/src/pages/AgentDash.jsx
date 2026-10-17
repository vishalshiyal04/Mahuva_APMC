// // import { useState } from 'react';
// // import { api } from '../api.js';
// // import useLoad from '../hooks/useLoad.js';
// // import Msg from '../components/Msg.jsx';
// // // કમિશન એજન્ટ ડેશબોર્ડ (SaaS બિલિંગ)
// // export default function AgentDash() {
// //   const [d, load] = useLoad(() => api('/agent/bills')); const [f, setF] = useState({ commissionPct: 2 }); const [m, setM] = useState('');
// //   const set = k => e => setF({ ...f, [k]: e.target.value });
// //   const add = async () => { try { setM((await api('/agent/bills', 'POST', f)).msg); load(); } catch (x) { setM(x.message); } };
// //   return <>
// //     <div className="card"><h3>{d?.shopName}</h3>{d && (d.active ? <p className="ok">લાયસન્સ {new Date(d.licenseUntil).toLocaleDateString()} સુધી સક્રિય</p>
// //       : <p className="err">લાયસન્સ સક્રિય નથી. વાર્ષિક ફી ભરવા એડમિનનો સંપર્ક કરો.</p>)}</div>
// //     {d?.active && <div className="card"><h3>નવી પટ્ટી</h3><input placeholder="પાર્ટી/ખેડૂતનું નામ" onChange={set('party')} />
// //       <input placeholder="પાક" onChange={set('cropName')} /><input type="number" placeholder="મણ" onChange={set('man')} />
// //       <input type="number" placeholder="ભાવ/મણ" onChange={set('rate')} /><input type="number" placeholder="કમિશન %" value={f.commissionPct} onChange={set('commissionPct')} />
// //       <button onClick={add}>પટ્ટી બનાવો</button><Msg e={m} ok /></div>}
// //     <div className="card"><h3>મારી પટ્ટીઓ</h3><table><thead><tr><th>તારીખ</th><th>પાર્ટી</th><th>પાક</th><th>કુલ</th><th>કમિશન</th><th>ચોખ્ખું</th></tr></thead>
// //       <tbody>{d?.bills.map(b => <tr key={b._id}><td>{new Date(b.createdAt).toLocaleDateString()}</td><td>{b.party}</td><td>{b.cropName} {b.man}મણ×₹{b.rate}</td>
// //         <td>₹{b.gross}</td><td>₹{b.commission}</td><td>₹{b.net}</td></tr>)}</tbody></table>
// //       {d && !d.bills.length && <p>હજી કોઈ પટ્ટી નથી.</p>}</div></>;
// // }

// import { useState } from 'react';
// import { api } from '../api.js';
// import useLoad from '../hooks/useLoad.js';
// import usePagination from '../hooks/usePagination.js';
// import Pagination from '../components/Pagination.jsx';
// import Msg from '../components/Msg.jsx';

// // કમિશન એજન્ટ ડેશબોર્ડ (SaaS બિલિંગ)
// export default function AgentDash() {
//   const [d, load] = useLoad(() => api('/agent/bills'));
//   const [f, setF] = useState({ commissionPct: 2 });
//   const [m, setM] = useState('');
  
//   // પેજિનેશન હૂક (પ્રતિ પેજ 10 બિલ/પટ્ટી)
//   const pg = usePagination(d?.bills, 10);

//   const set = k => e => setF({ ...f, [k]: e.target.value });
  
//   const add = async () => {
//     try {
//       setM((await api('/agent/bills', 'POST', f)).msg);
//       load();
//     } catch (x) {
//       setM(x.message);
//     }
//   };

//   return (
//     <>
//       <div className="card">
//         <h3>{d?.shopName}</h3>
//         {d && (
//           d.active ? (
//             <p className="ok">લાયસન્સ {new Date(d.licenseUntil).toLocaleDateString()} સુધી સક્રિય</p>
//           ) : (
//             <p className="err">લાયસન્સ સક્રિય નથી. વાર્ષિક ફી ભરવા એડમિનનો સંપર્ક કરો.</p>
//           )
//         )}
//       </div>

//       {d?.active && (
//         <div className="card">
//           <h3>નવી પટ્ટી</h3>
//           <input placeholder="પાર્ટી/ખેડૂતનું નામ" onChange={set('party')} />
//           <input placeholder="પાક" onChange={set('cropName')} />
//           <input type="number" placeholder="મણ" onChange={set('man')} />
//           <input type="number" placeholder="ભાવ/મણ" onChange={set('rate')} />
//           <input
//             type="number"
//             placeholder="કમિશન %"
//             value={f.commissionPct}
//             onChange={set('commissionPct')}
//           />
//           <button onClick={add}>પટ્ટી બનાવો</button>
//           <Msg e={m} ok />
//         </div>
//       )}

//       <div className="card">
//         <h3>મારી પટ્ટીઓ</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>તારીખ</th>
//               <th>પાર્ટી</th>
//               <th>પાક</th>
//               <th>કુલ</th>
//               <th>કમિશન</th>
//               <th>ચોખ્ખું</th>
//             </tr>
//           </thead>
//           <tbody>
//             {/* d?.bills.map ની જગ્યાએ pg.slice?.map વાપર્યું છે */}
//             {pg.slice?.map(b => (
//               <tr key={b._id}>
//                 <td>{new Date(b.createdAt).toLocaleDateString()}</td>
//                 <td>{b.party}</td>
//                 <td>{b.cropName} {b.man}મણ×₹{b.rate}</td>
//                 <td>₹{b.gross}</td>
//                 <td>₹{b.commission}</td>
//                 <td>₹{b.net}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {d && !d.bills.length && <p>હજી કોઈ પટ્ટી નથી.</p>}

//         {/* પેજિનેશન કંટ્રોલ */}
//         <Pagination pg={pg} />
//       </div>
//     </>
//   );
// }

import CropPicker from '../components/CropPicker.jsx';
import { displayCropName } from '../constants.js';
import { useState } from 'react';
import { api } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import usePagination from '../hooks/usePagination.js';
import Pagination from '../components/Pagination.jsx';
import Msg from '../components/Msg.jsx';

// કમિશન એજન્ટ ડેશબોર્ડ (SaaS બિલિંગ)
export default function AgentDash() {
  const [d, load] = useLoad(() => api('/agent/bills'));
  const [f, setF] = useState({ commissionPct: 2 });
  const [m, setM] = useState('');
  
  // પેજિનેશન હૂક (પ્રતિ પેજ 10 બિલ/પટ્ટી)
  const pg = usePagination(d?.bills, 10);

  const set = k => e => setF({ ...f, [k]: e.target.value });
  
  const add = async () => {
    try {
      setM((await api('/agent/bills', 'POST', f)).msg);
      load();
    } catch (x) {
      setM(x.message);
    }
  };

  return (
    <>
      <div className="card">
        <h3>{d?.shopName}</h3>
        {d && (
          d.active ? (
            <p className="ok">લાયસન્સ {new Date(d.licenseUntil).toLocaleDateString()} સુધી સક્રિય</p>
          ) : (
            <p className="err">લાયસન્સ સક્રિય નથી. વાર્ષિક ફી ભરવા એડમિનનો સંપર્ક કરો.</p>
          )
        )}
      </div>

      {d?.active && (
        <div className="card">
          <h3>નવી પટ્ટી</h3>
          <input placeholder="પાર્ટી/ખેડૂતનું નામ" onChange={set('party')} />
          <CropPicker value={f.cropName || ''} onChange={cropName => setF({ ...f, cropName })} />
          <input type="number" placeholder="મણ" onChange={set('man')} />
          <input type="number" placeholder="ભાવ/મણ" onChange={set('rate')} />
          <input
            type="number"
            placeholder="કમિશન %"
            value={f.commissionPct}
            onChange={set('commissionPct')}
          />
          <button onClick={add}>પટ્ટી બનાવો</button>
          <Msg e={m} ok />
        </div>
      )}

      <div className="card">
        <h3>મારી પટ્ટીઓ</h3>
        <table>
          <thead>
            <tr>
              <th>તારીખ</th>
              <th>પાર્ટી</th>
              <th>પાક</th>
              <th>કુલ</th>
              <th>કમિશન</th>
              <th>ચોખ્ખું</th>
            </tr>
          </thead>
          <tbody>
            {/* d?.bills.map ની જગ્યાએ pg.slice?.map વાપર્યું છે */}
            {pg.slice?.map(b => (
              <tr key={b._id}>
                <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                <td>{b.party}</td>
                <td>{displayCropName(b.cropName)} {b.man}મણ×₹{b.rate}</td>
                <td>₹{b.gross}</td>
                <td>₹{b.commission}</td>
                <td>₹{b.net}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {d && !d.bills.length && <p>હજી કોઈ પટ્ટી નથી.</p>}

        {/* પેજિનેશન કંટ્રોલ */}
        <Pagination pg={pg} />
      </div>
    </>
  );
}