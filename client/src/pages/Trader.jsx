// import { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import { api } from '../api.js';
// import useLoad from '../hooks/useLoad.js';
// import Msg from '../components/Msg.jsx';
// import Pattis from '../components/Pattis.jsx';
// import PayButton from '../components/PayButton.jsx';
// export default function Trader() {
//   const [me, loadMe] = useLoad(() => api('/me')); const [auc, load, err] = useLoad(() => api('/trader/auctions'));
//   const [pattis] = useLoad(() => api('/patti/mine')); const [bids, setBids] = useState({}); const [m, setM] = useState('');
//   useEffect(() => { const s = io(); s.on('auction:update', load); return () => s.close(); }, []);
//   const sub = async () => { try { setM((await api('/trader/subscribe', 'POST')).msg); loadMe(); } catch (x) { setM(x.message); } };
//   const bid = async id => { try { setM((await api('/trader/bid/' + id, 'POST', { amount: bids[id] })).msg); } catch (x) { setM(x.message); } };
//   const pass = async id => { try { setM((await api('/trader/pass/' + id, 'POST')).msg); load(); } catch (x) { setM(x.message); } };
//   return <>
//     <div className="card"><h3>સબ્સ્ક્રિપ્શન</h3>{me?.subActive ? <p className="ok">સક્રિય: {new Date(me.subscriptionUntil).toLocaleDateString()} સુધી</p>
//       : <><p>લાઈવ હરાજી માટે માસિક પ્લાન જરૂરી છે. સ્થિતિ: {me?.subRequest}</p><PayButton onDone={() => { loadMe(); load(); }} setMsg={setM} /></>}<Msg e={m} ok /></div>
//     {me?.subActive && <div className="card"><h3>લાઈવ હરાજી</h3>
//       {auc?.map(c => <div key={c._id} className="card"><b>{c.name} ({c.grade})</b> {c.man} મણ<div className="big">₹{c.highestBid}/મણ</div>{c.leading && <p className="ok">✅ તમારી બોલી સૌથી ઊંચી છે</p>}{c.passed && <p className="err">તમે પાસ કર્યું છે</p>}
//         <input type="number" placeholder="તમારી બોલી" onChange={e => setBids({ ...bids, [c._id]: e.target.value })} />
//         <button onClick={() => bid(c._id)}>બોલી લગાવો</button><button className="alt" onClick={() => pass(c._id)}>પાસ (બોલી નથી લગાવવી)</button></div>)}
//       {auc && !auc.length && <p>અત્યારે કોઈ હરાજી ચાલુ નથી.</p>}<Msg e={err} /></div>}
//     <Pattis list={pattis} trader /></>;
// }

// import { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import { api } from '../api.js';
// import useLoad from '../hooks/useLoad.js';
// import Msg from '../components/Msg.jsx';
// import Pattis from '../components/Pattis.jsx';
// import PayButton from '../components/PayButton.jsx';

// export default function Trader() {
//   const [me, loadMe] = useLoad(() => api('/me'));
//   const [auc, load, err] = useLoad(() => api('/trader/auctions'));
//   const [pattis, loadP] = useLoad(() => api('/patti/mine'));
//   const [bids, setBids] = useState({});
//   const [m, setM] = useState('');

//   useEffect(() => {
//     const s = io();
//     s.on('auction:update', load);
//     return () => s.close();
//   }, []);

//   const sub = async () => {
//     try {
//       setM((await api('/trader/subscribe', 'POST')).msg);
//       loadMe();
//     } catch (x) {
//       setM(x.message);
//     }
//   };

//   const bid = async id => {
//     try {
//       setM((await api('/trader/bid/' + id, 'POST', { amount: bids[id] })).msg);
//     } catch (x) {
//       setM(x.message);
//     }
//   };

//   const pass = async id => {
//     try {
//       setM((await api('/trader/pass/' + id, 'POST')).msg);
//       load();
//     } catch (x) {
//       setM(x.message);
//     }
//   };

//   return (
//     <>
//       <div className="card">
//         <h3>સબ્સ્ક્રિપ્શન</h3>
//         {me?.subActive ? (
//           <p className="ok">સક્રિય: {new Date(me.subscriptionUntil).toLocaleDateString()} સુધી</p>
//         ) : (
//           <>
//             <p>લાઈવ હરાજી માટે માસિક પ્લાન જરૂરી છે. સ્થિતિ: {me?.subRequest}</p>
//             <PayButton onDone={() => { loadMe(); load(); }} setMsg={setM} />
//           </>
//         )}
//         <Msg e={m} ok />
//       </div>

//       {me?.subActive && (
//         <div className="card">
//           <h3>લાઈવ હરાજી</h3>
//           {auc?.map(c => (
//             <div key={c._id} className="card">
//               <b>{c.name} ({c.grade})</b> {c.man} મણ
//               <div className="big">₹{c.highestBid}/મણ</div>
//               {c.leading && <p className="ok">✅ તમારી બોલી સૌથી ઊંચી છે</p>}
//               {c.passed && <p className="err">તમે પાસ કર્યું છે</p>}
//               <input
//                 type="number"
//                 placeholder="તમારી બોલી"
//                 onChange={e => setBids({ ...bids, [c._id]: e.target.value })}
//               />
//               <button onClick={() => bid(c._id)}>બોલી લગાવો</button>
//               <button className="alt" onClick={() => pass(c._id)}>પાસ (બોલી નથી લગાવવી)</button>
//             </div>
//           ))}
//           {auc && !auc.length && <p>અત્યારે કોઈ હરાજી ચાલુ નથી.</p>}
//           <Msg e={err} />
//         </div>
//       )}

//       <Pattis list={pattis} trader onChange={loadP} />
//     </>
//   );
// }

import { displayCropName } from '../constants.js';
// import { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';
// import { api } from '../api.js';
// import useLoad from '../hooks/useLoad.js';
// import Msg from '../components/Msg.jsx';
// import Pattis from '../components/Pattis.jsx';
// import PayButton from '../components/PayButton.jsx';
// export default function Trader() {
//   const [me, loadMe] = useLoad(() => api('/me')); const [auc, load, err] = useLoad(() => api('/trader/auctions'));
//   const [pattis] = useLoad(() => api('/patti/mine')); const [bids, setBids] = useState({}); const [m, setM] = useState('');
//   useEffect(() => { const s = io(); s.on('auction:update', load); return () => s.close(); }, []);
//   const sub = async () => { try { setM((await api('/trader/subscribe', 'POST')).msg); loadMe(); } catch (x) { setM(x.message); } };
//   const bid = async id => { try { setM((await api('/trader/bid/' + id, 'POST', { amount: bids[id] })).msg); } catch (x) { setM(x.message); } };
//   const pass = async id => { try { setM((await api('/trader/pass/' + id, 'POST')).msg); load(); } catch (x) { setM(x.message); } };
//   return <>
//     <div className="card"><h3>સબ્સ્ક્રિપ્શન</h3>{me?.subActive ? <p className="ok">સક્રિય: {new Date(me.subscriptionUntil).toLocaleDateString()} સુધી</p>
//       : <><p>લાઈવ હરાજી માટે માસિક પ્લાન જરૂરી છે. સ્થિતિ: {me?.subRequest}</p><PayButton onDone={() => { loadMe(); load(); }} setMsg={setM} /></>}<Msg e={m} ok /></div>
//     {me?.subActive && <div className="card"><h3>લાઈવ હરાજી</h3>
//       {auc?.map(c => <div key={c._id} className="card"><b>{displayCropName(c.name)} ({c.grade})</b> {c.man} મણ<div className="big">₹{c.highestBid}/મણ</div>{c.leading && <p className="ok">✅ તમારી બોલી સૌથી ઊંચી છે</p>}{c.passed && <p className="err">તમે પાસ કર્યું છે</p>}
//         <input type="number" placeholder="તમારી બોલી" onChange={e => setBids({ ...bids, [c._id]: e.target.value })} />
//         <button onClick={() => bid(c._id)}>બોલી લગાવો</button><button className="alt" onClick={() => pass(c._id)}>પાસ (બોલી નથી લગાવવી)</button></div>)}
//       {auc && !auc.length && <p>અત્યારે કોઈ હરાજી ચાલુ નથી.</p>}<Msg e={err} /></div>}
//     <Pattis list={pattis} trader /></>;
// }

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { api } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import Msg from '../components/Msg.jsx';
import Pattis from '../components/Pattis.jsx';
import PayButton from '../components/PayButton.jsx';

export default function Trader() {
  const [me, loadMe] = useLoad(() => api('/me'));
  const [auc, load, err] = useLoad(() => api('/trader/auctions'));
  const [pattis, loadP] = useLoad(() => api('/patti/mine'));
  const [bids, setBids] = useState({});
  const [m, setM] = useState('');

  useEffect(() => {
    const s = io();
    s.on('auction:update', load);
    return () => s.close();
  }, []);

  const sub = async () => {
    try {
      setM((await api('/trader/subscribe', 'POST')).msg);
      loadMe();
    } catch (x) {
      setM(x.message);
    }
  };

  const bid = async id => {
    try {
      setM((await api('/trader/bid/' + id, 'POST', { amount: bids[id] })).msg);
    } catch (x) {
      setM(x.message);
    }
  };

  const pass = async id => {
    try {
      setM((await api('/trader/pass/' + id, 'POST')).msg);
      load();
    } catch (x) {
      setM(x.message);
    }
  };

  return (
    <>
      <div className="card">
        <h3>સબ્સ્ક્રિપ્શન</h3>
        {me?.subActive ? (
          <p className="ok">સક્રિય: {new Date(me.subscriptionUntil).toLocaleDateString()} સુધી</p>
        ) : (
          <>
            <p>લાઈવ હરાજી માટે માસિક પ્લાન જરૂરી છે. સ્થિતિ: {me?.subRequest}</p>
            <PayButton onDone={() => { loadMe(); load(); }} setMsg={setM} />
          </>
        )}
        <Msg e={m} ok />
      </div>

      {me?.subActive && (
        <div className="card">
          <h3>લાઈવ હરાજી</h3>
          {auc?.map(c => (
            <div key={c._id} className="card">
              <b>{displayCropName(c.name)} ({c.grade})</b> {c.man} મણ
              <div className="big">₹{c.highestBid}/મણ</div>
              {c.leading && <p className="ok">✅ તમારી બોલી સૌથી ઊંચી છે</p>}
              {c.passed && <p className="err">તમે પાસ કર્યું છે</p>}
              <input
                type="number"
                placeholder="તમારી બોલી"
                onChange={e => setBids({ ...bids, [c._id]: e.target.value })}
              />
              <button onClick={() => bid(c._id)}>બોલી લગાવો</button>
              <button className="alt" onClick={() => pass(c._id)}>પાસ (બોલી નથી લગાવવી)</button>
            </div>
          ))}
          {auc && !auc.length && <p>અત્યારે કોઈ હરાજી ચાલુ નથી.</p>}
          <Msg e={err} />
        </div>
      )}

      <Pattis list={pattis} trader onChange={loadP} />
    </>
  );
}