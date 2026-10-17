// import useLoad from '../hooks/useLoad.js';
// import { api } from '../api.js';

// export default function Licensees() {
//   const [d] = useLoad(() => api('/licensees'));
//   return (
//     <>
//       <h2>લાઈસન્સદારની યાદી</h2>
//       <div className="card">
//         <h3>કમિશન એજન્ટ</h3>
//         <table>
//           <thead><tr><th>દુકાન</th><th>માલિક</th><th>મોબાઈલ</th><th>લાયસન્સ સુધી</th></tr></thead>
//           <tbody>
//             {d?.agents.map(a => (
//               <tr key={a._id}><td>{a.shopName}</td><td>{a.name}</td><td>{a.phone}</td><td>{new Date(a.licenseUntil).toLocaleDateString()}</td></tr>
//             ))}
//           </tbody>
//         </table>
//         {d && !d.agents.length && <p>હજી કોઈ એજન્ટ નોંધાયેલા નથી.</p>}
//       </div>
//       <div className="card">
//         <h3>નોંધાયેલા વેપારી</h3>
//         <table>
//           <thead><tr><th>નામ</th><th>લાયસન્સ નંબર</th></tr></thead>
//           <tbody>{d?.traders.map(t => <tr key={t._id}><td>{t.name}</td><td>{t.license}</td></tr>)}</tbody>
//         </table>
//         {d && !d.traders.length && <p>હજી કોઈ વેપારી નથી.</p>}
//       </div>
//     </>
//   );
// }

import useLoad from '../hooks/useLoad.js';
import usePagination from '../hooks/usePagination.js';
import Pagination from '../components/Pagination.jsx';
import { api } from '../api.js';

export default function Licensees() {
  const [d] = useLoad(() => api('/licensees'));
  const ag = usePagination(d?.agents, 10);
  const tr = usePagination(d?.traders, 10);
  return (
    <>
      <h2>લાઈસન્સદારની યાદી</h2>
      <div className="card">
        <h3>કમિશન એજન્ટ</h3>
        <table>
          <thead><tr><th>દુકાન</th><th>માલિક</th><th>મોબાઈલ</th><th>લાયસન્સ સુધી</th></tr></thead>
          <tbody>
            {ag.slice?.map(a => (
              <tr key={a._id}><td>{a.shopName}</td><td>{a.name}</td><td>{a.phone}</td><td>{new Date(a.licenseUntil).toLocaleDateString()}</td></tr>
            ))}
          </tbody>
        </table>
        {d && !d.agents.length && <p>હજી કોઈ એજન્ટ નોંધાયેલા નથી.</p>}
        <Pagination pg={ag} />
      </div>
      <div className="card">
        <h3>નોંધાયેલા વેપારી</h3>
        <table>
          <thead><tr><th>નામ</th><th>લાયસન્સ નંબર</th></tr></thead>
          <tbody>{tr.slice?.map(t => <tr key={t._id}><td>{t.name}</td><td>{t.license}</td></tr>)}</tbody>
        </table>
        {d && !d.traders.length && <p>હજી કોઈ વેપારી નથી.</p>}
        <Pagination pg={tr} />
      </div>
    </>
  );
}