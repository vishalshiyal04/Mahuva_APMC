// // import useLoad from '../hooks/useLoad.js';
// // import { api } from '../api.js';

// // export default function Arrivals() {
// //   const [d] = useLoad(() => api('/arrivals'));
// //   const today = d?.rows.filter(r => r.date === d.today) || [];
// //   const dates = d ? [...new Set(d.rows.map(r => r.date))] : [];
// //   return (
// //     <>
// //       <h2>દૈનિક આવક</h2>
// //       <div className="card">
// //         <h3>આજની આવક ({d?.today})</h3>
// //         <table>
// //           <thead><tr><th>પાક</th><th>કુલ મણ</th><th>એન્ટ્રી</th></tr></thead>
// //           <tbody>{today.map(r => <tr key={r.crop}><td>{r.crop}</td><td>{r.man} મણ</td><td>{r.count}</td></tr>)}</tbody>
// //         </table>
// //         {d && !today.length && <p>આજે હજી કોઈ આવક નોંધાઈ નથી.</p>}
// //       </div>
// //       <div className="card">
// //         <h3>છેલ્લા ૭ દિવસ</h3>
// //         <table>
// //           <thead><tr><th>તારીખ</th><th>પાક</th><th>કુલ મણ</th><th>એન્ટ્રી</th></tr></thead>
// //           <tbody>
// //             {dates.flatMap(dt => d.rows.filter(r => r.date === dt).map(r =>
// //               <tr key={dt + r.crop}><td>{dt}</td><td>{r.crop}</td><td>{r.man} મણ</td><td>{r.count}</td></tr>))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </>
// //   );
// // }

// import useLoad from '../hooks/useLoad.js';
// import usePagination from '../hooks/usePagination.js';
// import Pagination from '../components/Pagination.jsx';
// import { api } from '../api.js';

// export default function Arrivals() {
//   const [d] = useLoad(() => api('/arrivals'));
//   const today = d?.rows.filter(r => r.date === d.today) || [];
//   const pg = usePagination(d?.rows, 10);   // છેલ્લા ૭ દિવસ (સર્વર તારીખ પ્રમાણે ગોઠવીને આપે છે)
//   return (
//     <>
//       <h2>દૈનિક આવક</h2>
//       <div className="card">
//         <h3>આજની આવક ({d?.today})</h3>
//         <table>
//           <thead><tr><th>પાક</th><th>કુલ મણ</th><th>એન્ટ્રી</th></tr></thead>
//           <tbody>{today.map(r => <tr key={r.crop}><td>{r.crop}</td><td>{r.man} મણ</td><td>{r.count}</td></tr>)}</tbody>
//         </table>
//         {d && !today.length && <p>આજે હજી કોઈ આવક નોંધાઈ નથી.</p>}
//       </div>
//       <div className="card">
//         <h3>છેલ્લા ૭ દિવસ</h3>
//         <table>
//           <thead><tr><th>તારીખ</th><th>પાક</th><th>કુલ મણ</th><th>એન્ટ્રી</th></tr></thead>
//           <tbody>
//             {pg.slice?.map(r => <tr key={r.date + r.crop}><td>{r.date}</td><td>{r.crop}</td><td>{r.man} મણ</td><td>{r.count}</td></tr>)}
//           </tbody>
//         </table>
//         <Pagination pg={pg} />
//       </div>
//     </>
//   );
// }

import { displayCropName } from '../constants.js';
// import useLoad from '../hooks/useLoad.js';
// import { api } from '../api.js';

// export default function Arrivals() {
//   const [d] = useLoad(() => api('/arrivals'));
//   const today = d?.rows.filter(r => r.date === d.today) || [];
//   const dates = d ? [...new Set(d.rows.map(r => r.date))] : [];
//   return (
//     <>
//       <h2>દૈનિક આવક</h2>
//       <div className="card">
//         <h3>આજની આવક ({d?.today})</h3>
//         <table>
//           <thead><tr><th>પાક</th><th>કુલ મણ</th><th>એન્ટ્રી</th></tr></thead>
//           <tbody>{today.map(r => <tr key={displayCropName(r.crop)}><td>{displayCropName(r.crop)}</td><td>{r.man} મણ</td><td>{r.count}</td></tr>)}</tbody>
//         </table>
//         {d && !today.length && <p>આજે હજી કોઈ આવક નોંધાઈ નથી.</p>}
//       </div>
//       <div className="card">
//         <h3>છેલ્લા ૭ દિવસ</h3>
//         <table>
//           <thead><tr><th>તારીખ</th><th>પાક</th><th>કુલ મણ</th><th>એન્ટ્રી</th></tr></thead>
//           <tbody>
//             {dates.flatMap(dt => d.rows.filter(r => r.date === dt).map(r =>
//               <tr key={dt + r.crop}><td>{dt}</td><td>{displayCropName(r.crop)}</td><td>{r.man} મણ</td><td>{r.count}</td></tr>))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

import useLoad from '../hooks/useLoad.js';
import usePagination from '../hooks/usePagination.js';
import Pagination from '../components/Pagination.jsx';
import { api } from '../api.js';

export default function Arrivals() {
  const [d] = useLoad(() => api('/arrivals'));
  const today = d?.rows.filter(r => r.date === d.today) || [];
  const pg = usePagination(d?.rows, 10);   // છેલ્લા ૭ દિવસ (સર્વર તારીખ પ્રમાણે ગોઠવીને આપે છે)
  return (
    <>
      <h2>દૈનિક આવક</h2>
      <div className="card">
        <h3>આજની આવક ({d?.today})</h3>
        <table>
          <thead><tr><th>પાક</th><th>કુલ મણ</th><th>એન્ટ્રી</th></tr></thead>
          <tbody>{today.map(r => <tr key={displayCropName(r.crop)}><td>{displayCropName(r.crop)}</td><td>{r.man} મણ</td><td>{r.count}</td></tr>)}</tbody>
        </table>
        {d && !today.length && <p>આજે હજી કોઈ આવક નોંધાઈ નથી.</p>}
      </div>
      <div className="card">
        <h3>છેલ્લા ૭ દિવસ</h3>
        <table>
          <thead><tr><th>તારીખ</th><th>પાક</th><th>કુલ મણ</th><th>એન્ટ્રી</th></tr></thead>
          <tbody>
            {pg.slice?.map(r => <tr key={r.date + r.crop}><td>{r.date}</td><td>{displayCropName(r.crop)}</td><td>{r.man} મણ</td><td>{r.count}</td></tr>)}
          </tbody>
        </table>
        <Pagination pg={pg} />
      </div>
    </>
  );
}