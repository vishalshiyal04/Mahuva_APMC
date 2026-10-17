// // // import { Link } from 'react-router-dom';
// // // import { api, getAuth } from '../api.js';
// // // import useLoad from '../hooks/useLoad.js';
// // // import TrendChart from '../components/TrendChart.jsx';


// // // export default function Home() {
// // //  const [rates] = useLoad(() => api('/rates')); const pg = usePagination(rates, 10); 
// // //   const speak = () => { if (!rates) return; const t = rates.slice(0, 8).map(r => `${r.crop} ${r.min} થી ${r.max} રૂપિયા પ્રતિ મણ`).join('. ');
// // //     const u = new SpeechSynthesisUtterance('આજના ભાવ. ' + t); u.lang = 'gu-IN'; speechSynthesis.cancel(); speechSynthesis.speak(u); };
// // //   return <>
// // //     <section className="hero"><span className="tag">મહુવા APMC • લાઈવ બજાર ભાવ</span>
// // //       <h1>ખેડૂત અને વેપારી માટે<br />ડિજિટલ હરાજી</h1><p>લાઈવ ભાવ, QR ગેટ પાસ અને પારદર્શક બોલી — બધું એક જ જગ્યાએ.</p>
// // //       <div className="cta">{!getAuth() && <Link className="btn-yellow" to="/register">મફત શરૂ કરો</Link>}
// // //         <button className="btn-ghost" onClick={speak}>▶ ગુજરાતી અવાજમાં ભાવ સાંભળો</button></div></section>
// // //     <h2>આજના ભાવ</h2>
// // //     <div className="card"><table><thead><tr><th>પાક</th><th>ન્યૂનતમ</th><th>મહત્તમ</th><th>તારીખ</th></tr></thead>
// // //       <tbody>{rates?.map(r => <tr key={r._id}><td>{r.crop}</td><td>₹{r.min}</td><td>₹{r.max}</td><td>{r.date}</td></tr>)}</tbody></table>
// // //       {rates && !rates.length && <p>હજી ભાવ ઉમેરાયા નથી.</p>}</div>
// // //     <div className="card"><TrendChart /></div>
// // //     {ads?.map(a => <div key={a._id} className="card ad"><b>{a.title}</b> — {a.company}<br />{a.text}</div>)}
// // //   </>;
// // // }

// // import { api } from '../api.js';
// // import useLoad from '../hooks/useLoad.js';
// // import usePagination from '../hooks/usePagination.js'; // 1. Pagination hook import કરો
// // import Pagination from '../components/Pagination.jsx'; // 2. Pagination component import કરો

// // export default function Rates() {
// //   // 3. rates લોડ કરો અને પેજિનેશન સેટ કરો
// //   const [rates] = useLoad(() => api('/rates'));
// //   const pg = usePagination(rates, 10);

// //   return (
// //     <div className="card">
// //       <h3>આજના બજાર ભાવ</h3>
      
// //       <table>
// //         <thead>
// //           <tr>
// //             <th>પાક</th>
// //             <th>નીચો ભાવ</th>
// //             <th>ઊંચો ભાવ</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {/* 4. rates?.map ની જગ્યાએ pg.slice?.map વાપરો */}
// //           {pg.slice?.map(r => (
// //             <tr key={r._id}>
// //               <td>{r.cropName || r.name}</td>
// //               <td>₹{r.minPrice || r.low}</td>
// //               <td>₹{r.maxPrice || r.high}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       {/* 5. જો ડેટા ન હોય તો સંદેશ અને નીચે પેજિનેશન કંટ્રોલ */}
// //       {rates && !rates.length && <p>હજી ભાવ ઉમેરાયા નથી.</p>}
// //       <Pagination pg={pg} />
// //     </div>
// //   );
// // }

// // import NewsPreview from '../components/NewsPreview.jsx';
// // import usePagination from '../hooks/usePagination.js';
// // import Pagination from '../components/Pagination.jsx';
// // import { Link } from 'react-router-dom';
// // import { api, getAuth } from '../api.js';
// // import useLoad from '../hooks/useLoad.js';
// // import TrendChart from '../components/TrendChart.jsx';
// // import TrendCharts from '../components/TrendCharts.jsx';

// // export default function Home() {
// //   const [rates] = useLoad(() => api('/rates')); const pg = usePagination(rates, 10); const [ads] = useLoad(() => api('/ads'));
// //   const speak = () => { if (!rates) return; const t = rates.slice(0, 8).map(r => `${r.crop} ${r.min} થી ${r.max} રૂપિયા પ્રતિ મણ`).join('. ');
// //     const u = new SpeechSynthesisUtterance('આજના ભાવ. ' + t); u.lang = 'gu-IN'; speechSynthesis.cancel(); speechSynthesis.speak(u); };
// //   return <>
// //     <section className="hero"><span className="tag">મહુવા APMC • લાઈવ બજાર ભાવ</span>
// //       <h1>ખેડૂત અને વેપારી માટે<br />ડિજિટલ હરાજી</h1><p>લાઈવ ભાવ, QR ગેટ પાસ અને પારદર્શક બોલી — બધું એક જ જગ્યાએ.</p>
// //       <div className="cta">{!getAuth() && <Link className="btn-yellow" to="/register">મફત શરૂ કરો</Link>}
// //         <button className="btn-ghost" onClick={speak}>▶ ગુજરાતી અવાજમાં ભાવ સાંભળો</button></div></section>
// //     <NewsPreview />
// //     <h2>આજના ભાવ</h2>
// //     <div className="card"><table><thead><tr><th>પાક</th><th>ન્યૂનતમ</th><th>મહત્તમ</th><th>તારીખ</th></tr></thead>
// //       <tbody>{pg.slice?.map(r => <tr key={r._id}><td>{r.crop}</td><td>₹{r.min}</td><td>₹{r.max}</td><td>{r.date}</td></tr>)}</tbody></table>
// //       {rates && !rates.length && <p>હજી ભાવ ઉમેરાયા નથી.</p>}
// //       <Pagination pg={pg} /></div>
// //     <div className="card"><TrendChart /></div>
// //     {ads?.map(a => <div key={a._id} className="card ad"><b>{a.title}</b> — {a.company}<br />{a.text}</div>)}
// //   </>;
// // }

// import NewsPreview from '../components/NewsPreview.jsx';
// import usePagination from '../hooks/usePagination.js';
// import Pagination from '../components/Pagination.jsx';
// import { Link } from 'react-router-dom';
// import { api, getAuth } from '../api.js';
// import useLoad from '../hooks/useLoad.js';
// import TrendCharts from '../components/TrendCharts.jsx';

// export default function Home() {
//   const [rates] = useLoad(() => api('/rates'));
//   const pg = usePagination(rates, 10);
//   const [ads] = useLoad(() => api('/ads'));

//   const speak = () => {
//     if (!rates) return;
//     const t = rates
//       .slice(0, 8)
//       .map(r => `${r.crop} ${r.min} થી ${r.max} રૂપિયા પ્રતિ મણ`)
//       .join('. ');
//     const u = new SpeechSynthesisUtterance('આજના ભાવ. ' + t);
//     u.lang = 'gu-IN';
//     speechSynthesis.cancel();
//     speechSynthesis.speak(u);
//   };

//   return (
//     <>
//       <section className="hero">
//         <span className="tag">મહુવા APMC • લાઈવ બજાર ભાવ</span>
//         <h1>
//           ખેડૂત અને વેપારી માટે
//           <br />
//           ડિજિટલ હરાજી
//         </h1>
//         <p>લાઈવ ભાવ, QR ગેટ પાસ અને પારદર્શક બોલી — બધું એક જ જગ્યાએ.</p>
//         <div className="cta">
//           {!getAuth() && (
//             <Link className="btn-yellow" to="/register">
//               મફત શરૂ કરો
//             </Link>
//           )}
//           <button className="btn-ghost" onClick={speak}>
//             ▶ ગુજરાતી અવાજમાં ભાવ સાંભળો
//           </button>
//         </div>
//       </section>

//       <NewsPreview />

//       <h2>આજના ભાવ</h2>
//       <div className="card">
//         <table>
//           <thead>
//             <tr>
//               <th>પાક</th>
//               <th>ન્યૂનતમ</th>
//               <th>મહત્તમ</th>
//               <th>તારીખ</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pg.slice?.map(r => (
//               <tr key={r._id}>
//                 <td>{r.crop}</td>
//                 <td>₹{r.min}</td>
//                 <td>₹{r.max}</td>
//                 <td>{r.date}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {rates && !rates.length && <p>હજી ભાવ ઉમેરાયા નથી.</p>}
//         <Pagination pg={pg} />
//       </div>

//       <TrendCharts />

//       {ads?.map(a => (
//         <div key={a._id} className="card ad">
//           <b>{a.title}</b> — {a.company}
//           <br />
//           {a.text}
//         </div>
//       ))}
//     </>
//   );
// }
// import { Link } from 'react-router-dom';
// import { api, getAuth } from '../api.js';
// import useLoad from '../hooks/useLoad.js';
// import NewsPreview from '../components/NewsPreview.jsx';
// import TrendChart from '../components/TrendChart.jsx';


// export default function Home() {
//   const [rates] = useLoad(() => api('/rates'));
//   const [ads] = useLoad(() => api('/ads'));

//   const speak = () => {
//     if (!rates) return;

//     const text = rates
//       .slice(0, 8)
//       .map(
//         row =>
//           `${row.crop} ${row.min} થી ${row.max} રૂપિયા પ્રતિ મણ`
//       )
//       .join('. ');

//     const utterance = new SpeechSynthesisUtterance(
//       'આજના ભાવ. ' + text
//     );

//     utterance.lang = 'gu-IN';
//     speechSynthesis.cancel();
//     speechSynthesis.speak(utterance);
//   };

//   return (
//     <>
//       <section className="hero">
//         <span className="tag">
//           મહુવા APMC • લાઈવ બજાર ભાવ
//         </span>

//         <h1>
//           ખેડૂત અને વેપારી માટે
//           <br />
//           ડિજિટલ હરાજી
//         </h1>

//         <p>
//           લાઈવ ભાવ, QR ગેટ પાસ અને પારદર્શક બોલી —
//           બધું એક જ જગ્યાએ.
//         </p>

//         <div className="cta">
//           {!getAuth() && (
//             <Link className="btn-yellow" to="/register">
//               મફત શરૂ કરો
//             </Link>
//           )}

//           <button className="btn-ghost" onClick={speak}>
//             ▶ ગુજરાતી અવાજમાં ભાવ સાંભળો
//           </button>
//         </div>
//       </section>

//       <NewsPreview />

//       <h2>આજના ભાવ</h2>

//       <div className="card">
//         <table>
//           <thead>
//             <tr>
//               <th>પાક</th>
//               <th>ન્યૂનતમ</th>
//               <th>મહત્તમ</th>
//               <th>તારીખ</th>
//             </tr>
//           </thead>

//           <tbody>
//             {rates?.map(row => (
//               <tr key={row._id}>
//                 <td>{row.crop}</td>
//                 <td>₹{row.min}</td>
//                 <td>₹{row.max}</td>
//                 <td>{row.date}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {rates && !rates.length && (
//           <p>હજી ભાવ ઉમેરાયા નથી.</p>
//         )}
//       </div>

//       <div className="card">
//         <TrendChart rates={rates || []} />
//       </div>

//       {ads?.map(ad => (
//         <div key={ad._id} className="card ad">
//           <b>{ad.title}</b> — {ad.company}
//           <br />
//           {ad.text}
//         </div>
//       ))}
//     </>
//   );
// }

// import { Link } from 'react-router-dom';
// import { api, getAuth } from '../api.js';
// import useLoad from '../hooks/useLoad.js';
// import NewsPreview from '../components/NewsPreview.jsx';
// import TrendChart from '../components/TrendChart.jsx';

// export default function Home() {
//   const [rates] = useLoad(() => api('/rates'));
//   const [ads] = useLoad(() => api('/ads'));

//   const speak = () => {
//     if (!rates?.length) return;

//     if (
//       !('speechSynthesis' in window) ||
//       !('SpeechSynthesisUtterance' in window)
//     ) {
//       alert('આ browserમાં અવાજની સુવિધા ઉપલબ્ધ નથી.');
//       return;
//     }

//     const text = rates
//       .slice(0, 8)
//       .map(row => {
//         const unit = row.unitLabel
//           ? `પ્રતિ ${row.unitLabel}`
//           : 'એકમની ખાતરી બાકી છે';

//         return (
//           `${row.crop}: ${row.min} થી ${row.max} રૂપિયા. ` +
//           `${unit}. તારીખ ${row.date}`
//         );
//       })
//       .join('. ');

//     const utterance = new SpeechSynthesisUtterance(
//       'નોંધાયેલા બજાર ભાવ. ' + text
//     );

//     utterance.lang = 'gu-IN';
//     utterance.rate = 0.9;

//     window.speechSynthesis.cancel();
//     window.speechSynthesis.speak(utterance);
//   };

//   return (
//     <>
//       <section className="hero">
//         <span className="tag">
//           મહુવા APMC • બજાર ભાવ
//         </span>

//         <h1>
//           ખેડૂત અને વેપારી માટે
//           <br />
//           ડિજિટલ હરાજી
//         </h1>

//         <p>
//           બજાર ભાવ, QR ગેટ પાસ અને પારદર્શક બોલી —
//           બધું એક જ જગ્યાએ.
//         </p>

//         <div className="cta">
//           {!getAuth() && (
//             <Link className="btn-yellow" to="/register">
//               મફત શરૂ કરો
//             </Link>
//           )}

//           <button
//             type="button"
//             className="btn-ghost"
//             onClick={speak}
//             disabled={!rates?.length}
//           >
//             ▶ ગુજરાતી અવાજમાં ભાવ સાંભળો
//           </button>
//         </div>
//       </section>

//       <NewsPreview />

//       <h2>બજાર ભાવ</h2>

//       <div className="card" style={{ overflowX: 'auto' }}>
//         <table>
//           <thead>
//             <tr>
//               <th>પાક</th>
//               <th>ન્યૂનતમ</th>
//               <th>મહત્તમ</th>
//               <th>એકમ</th>
//               <th>તારીખ</th>
//             </tr>
//           </thead>

//           <tbody>
//             {rates?.map(row => (
//               <tr key={row._id}>
//                 <td>{row.crop}</td>
//                 <td>₹{row.min}</td>
//                 <td>₹{row.max}</td>
//                 <td>
//                   {row.unitLabel || 'એકમની ખાતરી બાકી'}
//                 </td>
//                 <td>{row.date}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {rates && !rates.length && (
//           <p>હજી ભાવ ઉમેરાયા નથી.</p>
//         )}
//       </div>

//       <div className="card">
//         <TrendChart rates={rates || []} />
//       </div>

//       {ads?.map(ad => (
//         <div key={ad._id} className="card ad">
//           <b>{ad.title}</b> — {ad.company}
//           <br />
//           {ad.text}
//         </div>
//       ))}
//     </>
//   );
// }

import { displayCropName } from '../constants.js';
import { Link } from 'react-router-dom';
import { api, getAuth } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import NewsPreview from '../components/NewsPreview.jsx';
import TrendChart from '../components/TrendChart.jsx';

export default function Home() {
  const [rates] = useLoad(() => api('/rates'));
  const [ads] = useLoad(() => api('/ads'));

  const speak = () => {
    if (!rates?.length) return;

    if (
      !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)
    ) {
      alert('આ browserમાં અવાજની સુવિધા ઉપલબ્ધ નથી.');
      return;
    }

    const text = rates
      .slice(0, 8)
      .map(row => {
        const unit = row.unitLabel
          ? `પ્રતિ ${row.unitLabel}`
          : 'એકમની ખાતરી બાકી છે';

        return (
          `${displayCropName(row.crop)}: ${row.min} થી ${row.max} રૂપિયા. ` +
          `${unit}. તારીખ ${row.date}`
        );
      })
      .join('. ');

    const utterance = new SpeechSynthesisUtterance(
      'નોંધાયેલા બજાર ભાવ. ' + text
    );

    utterance.lang = 'gu-IN';
    utterance.rate = 0.9;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <section className="hero">
        <span className="tag">
          મહુવા APMC • બજાર ભાવ
        </span>

        <h1>
          ખેડૂત અને વેપારી માટે
          <br />
          ડિજિટલ હરાજી
        </h1>

        <p>
          બજાર ભાવ, QR ગેટ પાસ અને પારદર્શક બોલી —
          બધું એક જ જગ્યાએ.
        </p>

        <div className="cta">
          {!getAuth() && (
            <Link className="btn-yellow" to="/register">
              મફત શરૂ કરો
            </Link>
          )}

          <button
            type="button"
            className="btn-ghost"
            onClick={speak}
            disabled={!rates?.length}
          >
            ▶ ગુજરાતી અવાજમાં ભાવ સાંભળો
          </button>
        </div>
      </section>

      <NewsPreview />

      <h2>બજાર ભાવ</h2>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>પાક</th>
              <th>ન્યૂનતમ</th>
              <th>મહત્તમ</th>
              <th>એકમ</th>
              <th>તારીખ</th>
            </tr>
          </thead>

          <tbody>
            {rates?.map(row => (
              <tr key={row._id}>
                <td>{displayCropName(row.crop)}</td>
                <td>₹{row.min}</td>
                <td>₹{row.max}</td>
                <td>
                  {row.unitLabel || 'એકમની ખાતરી બાકી'}
                </td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {rates && !rates.length && (
          <p>હજી ભાવ ઉમેરાયા નથી.</p>
        )}
      </div>

      <div className="card">
        <TrendChart rates={rates || []} />
      </div>

      {ads?.map(ad => (
        <div key={ad._id} className="card ad">
          <b>{ad.title}</b> — {ad.company}
          <br />
          {ad.text}
        </div>
      ))}
    </>
  );
}