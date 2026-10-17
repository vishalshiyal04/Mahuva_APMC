// // // export default function Pattis({ list, trader }) {
// // //   const total = (list || []).reduce((a, p) => a + (trader ? p.gross : p.farmerNet), 0);
// // //   return (
// // //     <div className="card">
// // //       <h3>ડિજિટલ પટ્ટી</h3>
// // //       {list?.length > 0 && (
// // //         <p>
// // //           <b>કુલ પટ્ટી: {list.length}</b> | <b>{trader ? 'કુલ ખરીદી' : 'કુલ આવક'}: ₹{total}</b>{' '}
// // //           <button className="alt" onClick={() => window.print()}>🖨 પ્રિન્ટ</button>
// // //         </p>
// // //       )}
// // //       {list?.map(p => (
// // //         <div key={p._id} className="card">
// // //           <b>{p.cropName}</b> {p.man} મણ × ₹{p.rate} = ₹{p.gross}<br />
// // //           કમિશન: ₹{p.commission} | {trader ? 'ચૂકવવાપાત્ર' : 'ખેડૂતને મળશે'}: ₹{trader ? p.gross : p.farmerNet}<br />
// // //           <small>{new Date(p.createdAt).toLocaleString()}</small>
// // //         </div>
// // //       ))}
// // //       {list && !list.length && <p>હજી કોઈ પટ્ટી નથી.</p>}
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from 'react';
// // import { createPortal } from 'react-dom';

// // const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN');
// // const pid = p => 'PT-' + String(p._id).slice(-6).toUpperCase();
// // const dt = d => new Date(d).toLocaleDateString('en-GB');
// // const tm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// // // પ્રિન્ટ માટેનું બિલ (A4 પર એક પટ્ટી = એક પાનું)
// // function Bill({ p, trader }) {
// //   const perMan = p.man ? p.commission / p.man : 0;
// //   return (
// //     <section className="bill">
// //       <div className="bill-frame">
// //         <header className="bill-head">
// //           <h1>મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</h1>
// //           <h2>ડિજિટલ વેચાણ પટ્ટી</h2>
// //         </header>

// //         <div className="bill-meta">
// //           <span><b>પટ્ટી નં:</b> {pid(p)}</span>
// //           <span><b>તારીખ:</b> {dt(p.createdAt)} {tm(p.createdAt)}</span>
// //         </div>

// //         <div className="bill-parties">
// //           <div><b>ખેડૂત</b><br />{p.farmer?.name || '-'}<br />{p.farmer?.phone}</div>
// //           <div><b>વેપારી</b><br />{p.trader?.name || '-'}<br />{p.trader?.phone}</div>
// //         </div>

// //         <table className="bill-table">
// //           <thead><tr><th>ક્રમ</th><th>પાકની વિગત</th><th>મણ</th><th>ભાવ (₹/મણ)</th><th>રકમ</th></tr></thead>
// //           <tbody><tr><td>1</td><td>{p.cropName}</td><td>{p.man}</td><td>{p.rate}</td><td>{rs(p.gross)}</td></tr></tbody>
// //         </table>

// //         <table className="bill-sum">
// //           <tbody>
// //             <tr><td>કુલ રકમ</td><td>{rs(p.gross)}</td></tr>
// //             {!trader && <>
// //               <tr><td>બજાર કમિશન ({rs(perMan)} × {p.man} મણ)</td><td>- {rs(p.commission)}</td></tr>
// //               <tr className="grand"><td>ખેડૂતને ચૂકવવાપાત્ર રકમ</td><td>{rs(p.farmerNet)}</td></tr>
// //             </>}
// //             {trader && <tr className="grand"><td>વેપારીએ ચૂકવવાપાત્ર રકમ</td><td>{rs(p.gross)}</td></tr>}
// //           </tbody>
// //         </table>

// //         <div className="bill-sign"><span>ખેડૂતની સહી</span><span>વેપારીની સહી</span><span>APMC ની સહી</span></div>
// //         <p className="bill-note">આ કમ્પ્યુટર દ્વારા બનાવેલી પટ્ટી છે.</p>
// //       </div>
// //     </section>
// //   );
// // }

// // export default function Pattis({ list, trader }) {
// //   const [sheet, setSheet] = useState(null);   // પ્રિન્ટ કરવાની પટ્ટીઓ
// //   const total = (list || []).reduce((a, p) => a + (trader ? p.gross : p.farmerNet), 0);

// //   // ફક્ત પટ્ટી પ્રિન્ટ થાય: બિલ દેખાડી, બાકીનું પેજ પ્રિન્ટ વખતે છુપાવી
// //   useEffect(() => {
// //     if (!sheet) return;
// //     const done = () => { document.body.classList.remove('print-bill'); setSheet(null); };
// //     document.body.classList.add('print-bill');
// //     window.addEventListener('afterprint', done, { once: true });
// //     const t = setTimeout(() => window.print(), 150);
// //     return () => { clearTimeout(t); window.removeEventListener('afterprint', done); document.body.classList.remove('print-bill'); };
// //   }, [sheet]);

// //   return (
// //     <>
// //       <div className="card">
// //         <h3>ડિજિટલ પટ્ટી</h3>
// //         {list?.length > 0 && (
// //           <p>
// //             <b>કુલ પટ્ટી: {list.length}</b> | <b>{trader ? 'કુલ ખરીદી' : 'કુલ આવક'}: {rs(total)}</b>{' '}
// //             <button className="alt" onClick={() => setSheet(list)}>🖨 બધી પટ્ટી પ્રિન્ટ</button>
// //           </p>
// //         )}
// //         {list?.map(p => (
// //           <div key={p._id} className="card">
// //             <b>{p.cropName}</b> {p.man} મણ × {rs(p.rate)} = {rs(p.gross)}<br />
// //             કમિશન: {rs(p.commission)} | {trader ? 'ચૂકવવાપાત્ર' : 'ખેડૂતને મળશે'}: {rs(trader ? p.gross : p.farmerNet)}<br />
// //             <small>{pid(p)} • {new Date(p.createdAt).toLocaleString()}</small>{' '}
// //             <button onClick={() => setSheet([p])}>🖨 પ્રિન્ટ</button>
// //           </div>
// //         ))}
// //         {list && !list.length && <p>હજી કોઈ પટ્ટી નથી.</p>}
// //       </div>

// //       {sheet && createPortal(
// //         <div className="print-sheet">{sheet.map(p => <Bill key={p._id} p={p} trader={trader} />)}</div>,
// //         document.body
// //       )}
// //     </>
// //   );
// // }

// // import { useEffect, useState } from 'react';
// // import { createPortal } from 'react-dom';
// // import { api } from '../api.js';
// // import { loadRzp } from '../utils/razorpay.js';
// // import Msg from './Msg.jsx';

// // const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN');
// // const pid = p => 'PT-' + String(p._id).slice(-6).toUpperCase();
// // const dt = d => new Date(d).toLocaleDateString('en-GB');
// // const tm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// // // પ્રિન્ટ માટેનું બિલ (A4 પર એક પટ્ટી = એક પાનું)
// // function Bill({ p, trader }) {
// //   const perMan = p.man ? p.commission / p.man : 0;
// //   return (
// //     <section className="bill">
// //       <div className="bill-frame">
// //         <header className="bill-head">
// //           <h1>મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</h1>
// //           <h2>ડિજિટલ વેચાણ પટ્ટી</h2>
// //         </header>

// //         <div className="bill-meta">
// //           <span><b>પટ્ટી નં:</b> {pid(p)}</span>
// //           <span><b>તારીખ:</b> {dt(p.createdAt)} {tm(p.createdAt)}</span>
// //         </div>
// //         <div className="bill-meta">
// //           <span><b>વેપારીની ચૂકવણી:</b> {p.paid ? `ચૂકવાઈ ગયું (${dt(p.paidAt)})` : 'બાકી'}</span>
// //           {p.paid && p.paymentId && <span><b>Payment ID:</b> {p.paymentId}</span>}
// //         </div>

// //         <div className="bill-parties">
// //           <div><b>ખેડૂત</b><br />{p.farmer?.name || '-'}<br />{p.farmer?.phone}</div>
// //           <div><b>વેપારી</b><br />{p.trader?.name || '-'}<br />{p.trader?.phone}</div>
// //         </div>

// //         <table className="bill-table">
// //           <thead><tr><th>ક્રમ</th><th>પાકની વિગત</th><th>મણ</th><th>ભાવ (₹/મણ)</th><th>રકમ</th></tr></thead>
// //           <tbody><tr><td>1</td><td>{p.cropName}</td><td>{p.man}</td><td>{p.rate}</td><td>{rs(p.gross)}</td></tr></tbody>
// //         </table>

// //         <table className="bill-sum">
// //           <tbody>
// //             <tr><td>કુલ રકમ</td><td>{rs(p.gross)}</td></tr>
// //             {!trader && <>
// //               <tr><td>બજાર કમિશન ({rs(perMan)} × {p.man} મણ)</td><td>- {rs(p.commission)}</td></tr>
// //               <tr className="grand"><td>ખેડૂતને ચૂકવવાપાત્ર રકમ</td><td>{rs(p.farmerNet)}</td></tr>
// //             </>}
// //             {trader && <tr className="grand"><td>વેપારીએ ચૂકવવાપાત્ર રકમ</td><td>{rs(p.gross)}</td></tr>}
// //           </tbody>
// //         </table>

// //         <div className="bill-sign"><span>ખેડૂતની સહી</span><span>વેપારીની સહી</span><span>APMC ની સહી</span></div>
// //         <p className="bill-note">આ કમ્પ્યુટર દ્વારા બનાવેલી પટ્ટી છે.</p>
// //       </div>
// //     </section>
// //   );
// // }

// // // list = પટ્ટીઓ, trader = વેપારીનું પેજ (ચૂકવવાનું બટન), onChange = પેમેન્ટ પછી યાદી ફરી લોડ
// // export default function Pattis({ list, trader, onChange }) {
// //   const [sheet, setSheet] = useState(null);   // પ્રિન્ટ કરવાની પટ્ટીઓ
// //   const [paying, setPaying] = useState(null);
// //   const [msg, setMsg] = useState('');
// //   const total = (list || []).reduce((a, p) => a + (trader ? p.gross : p.farmerNet), 0);

// //   // ફક્ત પટ્ટી પ્રિન્ટ થાય: બિલ દેખાડી, બાકીનું પેજ પ્રિન્ટ વખતે છુપાવી
// //   useEffect(() => {
// //     if (!sheet) return;
// //     const done = () => { document.body.classList.remove('print-bill'); setSheet(null); };
// //     document.body.classList.add('print-bill');
// //     window.addEventListener('afterprint', done, { once: true });
// //     const t = setTimeout(() => window.print(), 150);
// //     return () => { clearTimeout(t); window.removeEventListener('afterprint', done); document.body.classList.remove('print-bill'); };
// //   }, [sheet]);

// //   // વેપારી: પટ્ટીના પૈસા Razorpay થી ચૂકવે
// //   const pay = async p => {
// //     setMsg(''); setPaying(p._id);
// //     try {
// //       const cfg = await api('/pay/config');
// //       if (!cfg.enabled) throw new Error('ઓનલાઈન પેમેન્ટ હમણાં ચાલુ નથી, એડમિનનો સંપર્ક કરો');
// //       await loadRzp();
// //       const o = await api(`/pay/patti/${p._id}/order`, 'POST');
// //       new window.Razorpay({
// //         key: cfg.key, amount: o.amount, currency: 'INR', order_id: o.id,
// //         name: 'મહુવા APMC', description: `પટ્ટી ${pid(p)} • ${p.cropName} ${p.man} મણ`,
// //         theme: { color: '#17151f' },
// //         handler: async r => {
// //           try { setMsg((await api(`/pay/patti/${p._id}/verify`, 'POST', r)).msg); onChange?.(); }
// //           catch (x) { setMsg('⚠ ' + x.message); }
// //           setPaying(null);
// //         },
// //         modal: { ondismiss: () => setPaying(null) },
// //       }).open();
// //     } catch (x) { setMsg('⚠ ' + x.message); setPaying(null); }
// //   };

// //   return (
// //     <>
// //       <div className="card">
// //         <h3>ડિજિટલ પટ્ટી</h3>
// //         <Msg e={msg} ok />
// //         {list?.length > 0 && (
// //           <p>
// //             <b>કુલ પટ્ટી: {list.length}</b> | <b>{trader ? 'કુલ ખરીદી' : 'કુલ આવક'}: {rs(total)}</b>{' '}
// //             <button className="alt" onClick={() => setSheet(list)}>🖨 બધી પટ્ટી પ્રિન્ટ</button>
// //           </p>
// //         )}
// //         {list?.map(p => (
// //           <div key={p._id} className="card">
// //             <b>{p.cropName}</b> {p.man} મણ × {rs(p.rate)} = {rs(p.gross)}<br />
// //             કમિશન: {rs(p.commission)} | {trader ? 'ચૂકવવાપાત્ર' : 'ખેડૂતને મળશે'}: {rs(trader ? p.gross : p.farmerNet)}<br />
// //             વેપારીની ચૂકવણી: <span className={'pay-badge ' + (p.paid ? 'ok' : 'wait')}>{p.paid ? '✅ ચૂકવાઈ ગયું' : '⏳ બાકી'}</span><br />
// //             <small>{pid(p)} • {new Date(p.createdAt).toLocaleString()}</small>{' '}
// //             <button onClick={() => setSheet([p])}>🖨 પ્રિન્ટ</button>
// //             {trader && !p.paid && (
// //               <button className="alt" disabled={paying === p._id} onClick={() => pay(p)}>
// //                 {paying === p._id ? 'થોભો...' : `💳 હમણાં ચૂકવો ${rs(p.gross)}`}
// //               </button>
// //             )}
// //           </div>
// //         ))}
// //         {list && !list.length && <p>હજી કોઈ પટ્ટી નથી.</p>}
// //       </div>

// //       {sheet && createPortal(
// //         <div className="print-sheet">{sheet.map(p => <Bill key={p._id} p={p} trader={trader} />)}</div>,
// //         document.body
// //       )}
// //     </>
// //   );
// // }

// import { useEffect, useState } from 'react';
// import { createPortal } from 'react-dom';
// import { api } from '../api.js';
// import { loadRzp } from '../utils/razorpay.js';
// import usePagination from '../hooks/usePagination.js';
// import Pagination from './Pagination.jsx';
// import Msg from './Msg.jsx';

// const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN');
// const pid = p => 'PT-' + String(p._id).slice(-6).toUpperCase();
// const dt = d => new Date(d).toLocaleDateString('en-GB');
// const tm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// // પ્રિન્ટ માટેનું બિલ (A4 પર એક પટ્ટી = એક પાનું)
// function Bill({ p, trader }) {
//   const perMan = p.man ? p.commission / p.man : 0;
//   return (
//     <section className="bill">
//       <div className="bill-frame">
//         <header className="bill-head">
//           <h1>મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</h1>
//           <h2>ડિજિટલ વેચાણ પટ્ટી</h2>
//         </header>

//         <div className="bill-meta">
//           <span><b>પટ્ટી નં:</b> {pid(p)}</span>
//           <span><b>તારીખ:</b> {dt(p.createdAt)} {tm(p.createdAt)}</span>
//         </div>
//         <div className="bill-meta">
//           <span><b>વેપારીની ચૂકવણી:</b> {p.paid ? `ચૂકવાઈ ગયું (${dt(p.paidAt)})` : 'બાકી'}</span>
//           {p.paid && p.paymentId && <span><b>Payment ID:</b> {p.paymentId}</span>}
//         </div>

//         <div className="bill-parties">
//           <div><b>ખેડૂત</b><br />{p.farmer?.name || '-'}<br />{p.farmer?.phone}</div>
//           <div><b>વેપારી</b><br />{p.trader?.name || '-'}<br />{p.trader?.phone}</div>
//         </div>

//         <table className="bill-table">
//           <thead><tr><th>ક્રમ</th><th>પાકની વિગત</th><th>મણ</th><th>ભાવ (₹/મણ)</th><th>રકમ</th></tr></thead>
//           <tbody><tr><td>1</td><td>{p.cropName}</td><td>{p.man}</td><td>{p.rate}</td><td>{rs(p.gross)}</td></tr></tbody>
//         </table>

//         <table className="bill-sum">
//           <tbody>
//             <tr><td>કુલ રકમ</td><td>{rs(p.gross)}</td></tr>
//             {!trader && (
//               <>
//                 <tr><td>બજાર કમિશન ({rs(perMan)} × {p.man} મણ)</td><td>{rs(p.commission)}</td></tr>
//                 <tr className="grand"><td>ખેડૂતને ચૂકવવાપાત્ર રકમ</td><td>{rs(p.farmerNet)}</td></tr>
//               </>
//             )}
//             {trader && <tr className="grand"><td>વેપારીએ ચૂકવવાપાત્ર રકમ</td><td>{rs(p.gross)}</td></tr>}
//           </tbody>
//         </table>

//         <div className="bill-sign"><span>ખેડૂતની સહી</span><span>વેપારીની સહી</span><span>APMC ની સહી</span></div>
//         <p className="bill-note">આ કમ્પ્યુટર દ્વારા બનાવેલી પટ્ટી છે.</p>
//       </div>
//     </section>
//   );
// }

// // list = પટ્ટીઓ, trader = વેપારીનું પેજ (ચૂકવવાનું બટન), onChange = પેમેન્ટ પછી યાદી ફરી લોડ
// export default function Pattis({ list, trader, onChange }) {
//   const [sheet, setSheet] = useState(null);   // પ્રિન્ટ કરવાની પટ્ટીઓ
//   const [paying, setPaying] = useState(null);
//   const [msg, setMsg] = useState('');
  
//   // પેજિનેશન હૂક (પ્રતિ પેજ 5 પટ્ટી)
//   const pg = usePagination(list, 5);

//   const total = (list || []).reduce((a, p) => a + (trader ? p.gross : p.farmerNet), 0);

//   // ફક્ત પટ્ટી પ્રિન્ટ થાય: બિલ દેખાડી, બાકીનું પેજ પ્રિન્ટ વખતે છુપાવી
//   useEffect(() => {
//     if (!sheet) return;
//     const done = () => { document.body.classList.remove('print-bill'); setSheet(null); };
//     document.body.classList.add('print-bill');
//     window.addEventListener('afterprint', done, { once: true });
//     const t = setTimeout(() => window.print(), 150);
//     return () => { clearTimeout(t); window.removeEventListener('afterprint', done); document.body.classList.remove('print-bill'); };
//   }, [sheet]);

//   // વેપારી: પટ્ટીના પૈસા Razorpay થી ચૂકવે
//   const pay = async p => {
//     setMsg(''); setPaying(p._id);
//     try {
//       const cfg = await api('/pay/config');
//       if (!cfg.enabled) throw new Error('ઓનલાઈન પેમેન્ટ હમણાં ચાલુ નથી, એડમિનનો સંપર્ક કરો');
//       await loadRzp();
//       const o = await api(`/pay/patti/${p._id}/order`, 'POST');
//       new window.Razorpay({
//         key: cfg.key,
//         amount: o.amount,
//         currency: 'INR',
//         order_id: o.id,
//         name: 'મહુવા APMC',
//         description: `પટ્ટી ${pid(p)} - ${p.cropName} ${p.man} મણ`,
//         theme: { color: '#17151f' },
//         handler: async r => {
//           try {
//             setMsg((await api(`/pay/patti/${p._id}/verify`, 'POST', r)).msg);
//             onChange?.();
//           } catch (x) {
//             setMsg('⚠ ' + x.message);
//           }
//           setPaying(null);
//         },
//         modal: { ondismiss: () => setPaying(null) },
//       }).open();
//     } catch (x) {
//       setMsg('⚠ ' + x.message);
//       setPaying(null);
//     }
//   };

//   return (
//     <>
//       <div className="card">
//         <h3>ડિજિટલ પટ્ટી</h3>
//         <Msg e={msg} ok />
//         {list?.length > 0 && (
//           <p>
//             <b>કુલ પટ્ટી: {list.length}</b> | <b>{trader ? 'કુલ ખરીદી' : 'કુલ આવક'}: {rs(total)}</b>{' '}
//             <button className="alt" onClick={() => setSheet(list)}>🖨 બધી પટ્ટી પ્રિન્ટ</button>
//           </p>
//         )}

//         {/* list?.map ની જગ્યાએ pg.slice?.map વાપર્યું છે */}
//         {pg.slice?.map(p => (
//           <div key={p._id} className="card">
//             <b>{p.cropName}</b> {p.man} મણ × {rs(p.rate)} = {rs(p.gross)}<br />
//             કમિશન: {rs(p.commission)} | {trader ? 'ચૂકવવાપાત્ર' : 'ખેડૂતને મળશે'}: {rs(trader ? p.gross : p.farmerNet)}<br />
//             વેપારીની ચૂકવણી: <span className={'pay-badge ' + (p.paid ? 'ok' : 'wait')}>{p.paid ? '✅ ચૂકવાઈ ગયું' : '⏳ બાકી'}</span><br />
//             <small>{pid(p)} • {new Date(p.createdAt).toLocaleString()}</small>{' '}
//             <button onClick={() => setSheet([p])}>🖨 પ્રિન્ટ</button>
//             {trader && !p.paid && (
//               <button className="alt" disabled={paying === p._id} onClick={() => pay(p)}>
//                 {paying === p._id ? 'થોભો...' : `💳 હમણાં ચૂકવો ${rs(p.gross)}`}
//               </button>
//             )}
//           </div>
//         ))}

//         {list && !list.length && <p>હજી કોઈ પટ્ટી નથી.</p>}

//         {/* પેજિનેશન કંટ્રોલ */}
//         <Pagination pg={pg} />
//       </div>

//       {sheet && createPortal(
//         <div className="print-sheet">{sheet.map(p => <Bill key={p._id} p={p} trader={trader} />)}</div>,
//         document.body
//       )}
//     </>
//   );
// }

import { displayCropName } from '../constants.js';
// // export default function Pattis({ list, trader }) {
// //   const total = (list || []).reduce((a, p) => a + (trader ? p.gross : p.farmerNet), 0);
// //   return (
// //     <div className="card">
// //       <h3>ડિજિટલ પટ્ટી</h3>
// //       {list?.length > 0 && (
// //         <p>
// //           <b>કુલ પટ્ટી: {list.length}</b> | <b>{trader ? 'કુલ ખરીદી' : 'કુલ આવક'}: ₹{total}</b>{' '}
// //           <button className="alt" onClick={() => window.print()}>🖨 પ્રિન્ટ</button>
// //         </p>
// //       )}
// //       {list?.map(p => (
// //         <div key={p._id} className="card">
// //           <b>{displayCropName(p.cropName)}</b> {p.man} મણ × ₹{p.rate} = ₹{p.gross}<br />
// //           કમિશન: ₹{p.commission} | {trader ? 'ચૂકવવાપાત્ર' : 'ખેડૂતને મળશે'}: ₹{trader ? p.gross : p.farmerNet}<br />
// //           <small>{new Date(p.createdAt).toLocaleString()}</small>
// //         </div>
// //       ))}
// //       {list && !list.length && <p>હજી કોઈ પટ્ટી નથી.</p>}
// //     </div>
// //   );
// // }

// import { useEffect, useState } from 'react';
// import { createPortal } from 'react-dom';

// const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN');
// const pid = p => 'PT-' + String(p._id).slice(-6).toUpperCase();
// const dt = d => new Date(d).toLocaleDateString('en-GB');
// const tm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// // પ્રિન્ટ માટેનું બિલ (A4 પર એક પટ્ટી = એક પાનું)
// function Bill({ p, trader }) {
//   const perMan = p.man ? p.commission / p.man : 0;
//   return (
//     <section className="bill">
//       <div className="bill-frame">
//         <header className="bill-head">
//           <h1>મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</h1>
//           <h2>ડિજિટલ વેચાણ પટ્ટી</h2>
//         </header>

//         <div className="bill-meta">
//           <span><b>પટ્ટી નં:</b> {pid(p)}</span>
//           <span><b>તારીખ:</b> {dt(p.createdAt)} {tm(p.createdAt)}</span>
//         </div>

//         <div className="bill-parties">
//           <div><b>ખેડૂત</b><br />{p.farmer?.name || '-'}<br />{p.farmer?.phone}</div>
//           <div><b>વેપારી</b><br />{p.trader?.name || '-'}<br />{p.trader?.phone}</div>
//         </div>

//         <table className="bill-table">
//           <thead><tr><th>ક્રમ</th><th>પાકની વિગત</th><th>મણ</th><th>ભાવ (₹/મણ)</th><th>રકમ</th></tr></thead>
//           <tbody><tr><td>1</td><td>{displayCropName(p.cropName)}</td><td>{p.man}</td><td>{p.rate}</td><td>{rs(p.gross)}</td></tr></tbody>
//         </table>

//         <table className="bill-sum">
//           <tbody>
//             <tr><td>કુલ રકમ</td><td>{rs(p.gross)}</td></tr>
//             {!trader && <>
//               <tr><td>બજાર કમિશન ({rs(perMan)} × {p.man} મણ)</td><td>- {rs(p.commission)}</td></tr>
//               <tr className="grand"><td>ખેડૂતને ચૂકવવાપાત્ર રકમ</td><td>{rs(p.farmerNet)}</td></tr>
//             </>}
//             {trader && <tr className="grand"><td>વેપારીએ ચૂકવવાપાત્ર રકમ</td><td>{rs(p.gross)}</td></tr>}
//           </tbody>
//         </table>

//         <div className="bill-sign"><span>ખેડૂતની સહી</span><span>વેપારીની સહી</span><span>APMC ની સહી</span></div>
//         <p className="bill-note">આ કમ્પ્યુટર દ્વારા બનાવેલી પટ્ટી છે.</p>
//       </div>
//     </section>
//   );
// }

// export default function Pattis({ list, trader }) {
//   const [sheet, setSheet] = useState(null);   // પ્રિન્ટ કરવાની પટ્ટીઓ
//   const total = (list || []).reduce((a, p) => a + (trader ? p.gross : p.farmerNet), 0);

//   // ફક્ત પટ્ટી પ્રિન્ટ થાય: બિલ દેખાડી, બાકીનું પેજ પ્રિન્ટ વખતે છુપાવી
//   useEffect(() => {
//     if (!sheet) return;
//     const done = () => { document.body.classList.remove('print-bill'); setSheet(null); };
//     document.body.classList.add('print-bill');
//     window.addEventListener('afterprint', done, { once: true });
//     const t = setTimeout(() => window.print(), 150);
//     return () => { clearTimeout(t); window.removeEventListener('afterprint', done); document.body.classList.remove('print-bill'); };
//   }, [sheet]);

//   return (
//     <>
//       <div className="card">
//         <h3>ડિજિટલ પટ્ટી</h3>
//         {list?.length > 0 && (
//           <p>
//             <b>કુલ પટ્ટી: {list.length}</b> | <b>{trader ? 'કુલ ખરીદી' : 'કુલ આવક'}: {rs(total)}</b>{' '}
//             <button className="alt" onClick={() => setSheet(list)}>🖨 બધી પટ્ટી પ્રિન્ટ</button>
//           </p>
//         )}
//         {list?.map(p => (
//           <div key={p._id} className="card">
//             <b>{displayCropName(p.cropName)}</b> {p.man} મણ × {rs(p.rate)} = {rs(p.gross)}<br />
//             કમિશન: {rs(p.commission)} | {trader ? 'ચૂકવવાપાત્ર' : 'ખેડૂતને મળશે'}: {rs(trader ? p.gross : p.farmerNet)}<br />
//             <small>{pid(p)} • {new Date(p.createdAt).toLocaleString()}</small>{' '}
//             <button onClick={() => setSheet([p])}>🖨 પ્રિન્ટ</button>
//           </div>
//         ))}
//         {list && !list.length && <p>હજી કોઈ પટ્ટી નથી.</p>}
//       </div>

//       {sheet && createPortal(
//         <div className="print-sheet">{sheet.map(p => <Bill key={p._id} p={p} trader={trader} />)}</div>,
//         document.body
//       )}
//     </>
//   );
// }

// import { useEffect, useState } from 'react';
// import { createPortal } from 'react-dom';
// import { api } from '../api.js';
// import { loadRzp } from '../utils/razorpay.js';
// import Msg from './Msg.jsx';

// const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN');
// const pid = p => 'PT-' + String(p._id).slice(-6).toUpperCase();
// const dt = d => new Date(d).toLocaleDateString('en-GB');
// const tm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// // પ્રિન્ટ માટેનું બિલ (A4 પર એક પટ્ટી = એક પાનું)
// function Bill({ p, trader }) {
//   const perMan = p.man ? p.commission / p.man : 0;
//   return (
//     <section className="bill">
//       <div className="bill-frame">
//         <header className="bill-head">
//           <h1>મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</h1>
//           <h2>ડિજિટલ વેચાણ પટ્ટી</h2>
//         </header>

//         <div className="bill-meta">
//           <span><b>પટ્ટી નં:</b> {pid(p)}</span>
//           <span><b>તારીખ:</b> {dt(p.createdAt)} {tm(p.createdAt)}</span>
//         </div>
//         <div className="bill-meta">
//           <span><b>વેપારીની ચૂકવણી:</b> {p.paid ? `ચૂકવાઈ ગયું (${dt(p.paidAt)})` : 'બાકી'}</span>
//           {p.paid && p.paymentId && <span><b>Payment ID:</b> {p.paymentId}</span>}
//         </div>

//         <div className="bill-parties">
//           <div><b>ખેડૂત</b><br />{p.farmer?.name || '-'}<br />{p.farmer?.phone}</div>
//           <div><b>વેપારી</b><br />{p.trader?.name || '-'}<br />{p.trader?.phone}</div>
//         </div>

//         <table className="bill-table">
//           <thead><tr><th>ક્રમ</th><th>પાકની વિગત</th><th>મણ</th><th>ભાવ (₹/મણ)</th><th>રકમ</th></tr></thead>
//           <tbody><tr><td>1</td><td>{displayCropName(p.cropName)}</td><td>{p.man}</td><td>{p.rate}</td><td>{rs(p.gross)}</td></tr></tbody>
//         </table>

//         <table className="bill-sum">
//           <tbody>
//             <tr><td>કુલ રકમ</td><td>{rs(p.gross)}</td></tr>
//             {!trader && <>
//               <tr><td>બજાર કમિશન ({rs(perMan)} × {p.man} મણ)</td><td>- {rs(p.commission)}</td></tr>
//               <tr className="grand"><td>ખેડૂતને ચૂકવવાપાત્ર રકમ</td><td>{rs(p.farmerNet)}</td></tr>
//             </>}
//             {trader && <tr className="grand"><td>વેપારીએ ચૂકવવાપાત્ર રકમ</td><td>{rs(p.gross)}</td></tr>}
//           </tbody>
//         </table>

//         <div className="bill-sign"><span>ખેડૂતની સહી</span><span>વેપારીની સહી</span><span>APMC ની સહી</span></div>
//         <p className="bill-note">આ કમ્પ્યુટર દ્વારા બનાવેલી પટ્ટી છે.</p>
//       </div>
//     </section>
//   );
// }

// // list = પટ્ટીઓ, trader = વેપારીનું પેજ (ચૂકવવાનું બટન), onChange = પેમેન્ટ પછી યાદી ફરી લોડ
// export default function Pattis({ list, trader, onChange }) {
//   const [sheet, setSheet] = useState(null);   // પ્રિન્ટ કરવાની પટ્ટીઓ
//   const [paying, setPaying] = useState(null);
//   const [msg, setMsg] = useState('');
//   const total = (list || []).reduce((a, p) => a + (trader ? p.gross : p.farmerNet), 0);

//   // ફક્ત પટ્ટી પ્રિન્ટ થાય: બિલ દેખાડી, બાકીનું પેજ પ્રિન્ટ વખતે છુપાવી
//   useEffect(() => {
//     if (!sheet) return;
//     const done = () => { document.body.classList.remove('print-bill'); setSheet(null); };
//     document.body.classList.add('print-bill');
//     window.addEventListener('afterprint', done, { once: true });
//     const t = setTimeout(() => window.print(), 150);
//     return () => { clearTimeout(t); window.removeEventListener('afterprint', done); document.body.classList.remove('print-bill'); };
//   }, [sheet]);

//   // વેપારી: પટ્ટીના પૈસા Razorpay થી ચૂકવે
//   const pay = async p => {
//     setMsg(''); setPaying(p._id);
//     try {
//       const cfg = await api('/pay/config');
//       if (!cfg.enabled) throw new Error('ઓનલાઈન પેમેન્ટ હમણાં ચાલુ નથી, એડમિનનો સંપર્ક કરો');
//       await loadRzp();
//       const o = await api(`/pay/patti/${p._id}/order`, 'POST');
//       new window.Razorpay({
//         key: cfg.key, amount: o.amount, currency: 'INR', order_id: o.id,
//         name: 'મહુવા APMC', description: `પટ્ટી ${pid(p)} • ${displayCropName(p.cropName)} ${p.man} મણ`,
//         theme: { color: '#17151f' },
//         handler: async r => {
//           try { setMsg((await api(`/pay/patti/${p._id}/verify`, 'POST', r)).msg); onChange?.(); }
//           catch (x) { setMsg('⚠ ' + x.message); }
//           setPaying(null);
//         },
//         modal: { ondismiss: () => setPaying(null) },
//       }).open();
//     } catch (x) { setMsg('⚠ ' + x.message); setPaying(null); }
//   };

//   return (
//     <>
//       <div className="card">
//         <h3>ડિજિટલ પટ્ટી</h3>
//         <Msg e={msg} ok />
//         {list?.length > 0 && (
//           <p>
//             <b>કુલ પટ્ટી: {list.length}</b> | <b>{trader ? 'કુલ ખરીદી' : 'કુલ આવક'}: {rs(total)}</b>{' '}
//             <button className="alt" onClick={() => setSheet(list)}>🖨 બધી પટ્ટી પ્રિન્ટ</button>
//           </p>
//         )}
//         {list?.map(p => (
//           <div key={p._id} className="card">
//             <b>{displayCropName(p.cropName)}</b> {p.man} મણ × {rs(p.rate)} = {rs(p.gross)}<br />
//             કમિશન: {rs(p.commission)} | {trader ? 'ચૂકવવાપાત્ર' : 'ખેડૂતને મળશે'}: {rs(trader ? p.gross : p.farmerNet)}<br />
//             વેપારીની ચૂકવણી: <span className={'pay-badge ' + (p.paid ? 'ok' : 'wait')}>{p.paid ? '✅ ચૂકવાઈ ગયું' : '⏳ બાકી'}</span><br />
//             <small>{pid(p)} • {new Date(p.createdAt).toLocaleString()}</small>{' '}
//             <button onClick={() => setSheet([p])}>🖨 પ્રિન્ટ</button>
//             {trader && !p.paid && (
//               <button className="alt" disabled={paying === p._id} onClick={() => pay(p)}>
//                 {paying === p._id ? 'થોભો...' : `💳 હમણાં ચૂકવો ${rs(p.gross)}`}
//               </button>
//             )}
//           </div>
//         ))}
//         {list && !list.length && <p>હજી કોઈ પટ્ટી નથી.</p>}
//       </div>

//       {sheet && createPortal(
//         <div className="print-sheet">{sheet.map(p => <Bill key={p._id} p={p} trader={trader} />)}</div>,
//         document.body
//       )}
//     </>
//   );
// }

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { api } from '../api.js';
import { loadRzp } from '../utils/razorpay.js';
import usePagination from '../hooks/usePagination.js';
import Pagination from './Pagination.jsx';
import Msg from './Msg.jsx';

const rs = n => '₹' + Number(n || 0).toLocaleString('en-IN');
const pid = p => 'PT-' + String(p._id).slice(-6).toUpperCase();
const dt = d => new Date(d).toLocaleDateString('en-GB');
const tm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

// પ્રિન્ટ માટેનું બિલ (A4 પર એક પટ્ટી = એક પાનું)
function Bill({ p, trader }) {
  const perMan = p.man ? p.commission / p.man : 0;
  return (
    <section className="bill">
      <div className="bill-frame">
        <header className="bill-head">
          <h1>મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</h1>
          <h2>ડિજિટલ વેચાણ પટ્ટી</h2>
        </header>

        <div className="bill-meta">
          <span><b>પટ્ટી નં:</b> {pid(p)}</span>
          <span><b>તારીખ:</b> {dt(p.createdAt)} {tm(p.createdAt)}</span>
        </div>
        <div className="bill-meta">
          <span><b>વેપારીની ચૂકવણી:</b> {p.paid ? `ચૂકવાઈ ગયું (${dt(p.paidAt)})` : 'બાકી'}</span>
          {p.paid && p.paymentId && <span><b>Payment ID:</b> {p.paymentId}</span>}
        </div>

        <div className="bill-parties">
          <div><b>ખેડૂત</b><br />{p.farmer?.name || '-'}<br />{p.farmer?.phone}</div>
          <div><b>વેપારી</b><br />{p.trader?.name || '-'}<br />{p.trader?.phone}</div>
        </div>

        <table className="bill-table">
          <thead><tr><th>ક્રમ</th><th>પાકની વિગત</th><th>મણ</th><th>ભાવ (₹/મણ)</th><th>રકમ</th></tr></thead>
          <tbody><tr><td>1</td><td>{displayCropName(p.cropName)}</td><td>{p.man}</td><td>{p.rate}</td><td>{rs(p.gross)}</td></tr></tbody>
        </table>

        <table className="bill-sum">
          <tbody>
            <tr><td>કુલ રકમ</td><td>{rs(p.gross)}</td></tr>
            {!trader && (
              <>
                <tr><td>બજાર કમિશન ({rs(perMan)} × {p.man} મણ)</td><td>{rs(p.commission)}</td></tr>
                <tr className="grand"><td>ખેડૂતને ચૂકવવાપાત્ર રકમ</td><td>{rs(p.farmerNet)}</td></tr>
              </>
            )}
            {trader && <tr className="grand"><td>વેપારીએ ચૂકવવાપાત્ર રકમ</td><td>{rs(p.gross)}</td></tr>}
          </tbody>
        </table>

        <div className="bill-sign"><span>ખેડૂતની સહી</span><span>વેપારીની સહી</span><span>APMC ની સહી</span></div>
        <p className="bill-note">આ કમ્પ્યુટર દ્વારા બનાવેલી પટ્ટી છે.</p>
      </div>
    </section>
  );
}

// list = પટ્ટીઓ, trader = વેપારીનું પેજ (ચૂકવવાનું બટન), onChange = પેમેન્ટ પછી યાદી ફરી લોડ
export default function Pattis({ list, trader, onChange }) {
  const [sheet, setSheet] = useState(null);   // પ્રિન્ટ કરવાની પટ્ટીઓ
  const [paying, setPaying] = useState(null);
  const [msg, setMsg] = useState('');
  
  // પેજિનેશન હૂક (પ્રતિ પેજ 5 પટ્ટી)
  const pg = usePagination(list, 5);

  const total = (list || []).reduce((a, p) => a + (trader ? p.gross : p.farmerNet), 0);

  // ફક્ત પટ્ટી પ્રિન્ટ થાય: બિલ દેખાડી, બાકીનું પેજ પ્રિન્ટ વખતે છુપાવી
  useEffect(() => {
    if (!sheet) return;
    const done = () => { document.body.classList.remove('print-bill'); setSheet(null); };
    document.body.classList.add('print-bill');
    window.addEventListener('afterprint', done, { once: true });
    const t = setTimeout(() => window.print(), 150);
    return () => { clearTimeout(t); window.removeEventListener('afterprint', done); document.body.classList.remove('print-bill'); };
  }, [sheet]);

  // વેપારી: પટ્ટીના પૈસા Razorpay થી ચૂકવે
  const pay = async p => {
    setMsg(''); setPaying(p._id);
    try {
      const cfg = await api('/pay/config');
      if (!cfg.enabled) throw new Error('ઓનલાઈન પેમેન્ટ હમણાં ચાલુ નથી, એડમિનનો સંપર્ક કરો');
      await loadRzp();
      const o = await api(`/pay/patti/${p._id}/order`, 'POST');
      new window.Razorpay({
        key: cfg.key,
        amount: o.amount,
        currency: 'INR',
        order_id: o.id,
        name: 'મહુવા APMC',
        description: `પટ્ટી ${pid(p)} - ${displayCropName(p.cropName)} ${p.man} મણ`,
        theme: { color: '#17151f' },
        handler: async r => {
          try {
            setMsg((await api(`/pay/patti/${p._id}/verify`, 'POST', r)).msg);
            onChange?.();
          } catch (x) {
            setMsg('⚠ ' + x.message);
          }
          setPaying(null);
        },
        modal: { ondismiss: () => setPaying(null) },
      }).open();
    } catch (x) {
      setMsg('⚠ ' + x.message);
      setPaying(null);
    }
  };

  return (
    <>
      <div className="card">
        <h3>ડિજિટલ પટ્ટી</h3>
        <Msg e={msg} ok />
        {list?.length > 0 && (
          <p>
            <b>કુલ પટ્ટી: {list.length}</b> | <b>{trader ? 'કુલ ખરીદી' : 'કુલ આવક'}: {rs(total)}</b>{' '}
            <button className="alt" onClick={() => setSheet(list)}>🖨 બધી પટ્ટી પ્રિન્ટ</button>
          </p>
        )}

        {/* list?.map ની જગ્યાએ pg.slice?.map વાપર્યું છે */}
        {pg.slice?.map(p => (
          <div key={p._id} className="card">
            <b>{displayCropName(p.cropName)}</b> {p.man} મણ × {rs(p.rate)} = {rs(p.gross)}<br />
            કમિશન: {rs(p.commission)} | {trader ? 'ચૂકવવાપાત્ર' : 'ખેડૂતને મળશે'}: {rs(trader ? p.gross : p.farmerNet)}<br />
            વેપારીની ચૂકવણી: <span className={'pay-badge ' + (p.paid ? 'ok' : 'wait')}>{p.paid ? '✅ ચૂકવાઈ ગયું' : '⏳ બાકી'}</span><br />
            <small>{pid(p)} • {new Date(p.createdAt).toLocaleString()}</small>{' '}
            <button onClick={() => setSheet([p])}>🖨 પ્રિન્ટ</button>
            {trader && !p.paid && (
              <button className="alt" disabled={paying === p._id} onClick={() => pay(p)}>
                {paying === p._id ? 'થોભો...' : `💳 હમણાં ચૂકવો ${rs(p.gross)}`}
              </button>
            )}
          </div>
        ))}

        {list && !list.length && <p>હજી કોઈ પટ્ટી નથી.</p>}

        {/* પેજિનેશન કંટ્રોલ */}
        <Pagination pg={pg} />
      </div>

      {sheet && createPortal(
        <div className="print-sheet">{sheet.map(p => <Bill key={p._id} p={p} trader={trader} />)}</div>,
        document.body
      )}
    </>
  );
}