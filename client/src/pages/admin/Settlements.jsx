// import { useEffect, useState } from 'react';
// import { api } from '../../api.js';
// import './Settlements.css';

// const money = value =>
//   value == null
//     ? '—'
//     : `₹${(value / 100).toLocaleString('en-IN', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       })}`;

// const STATUS = {
//   unknown: 'નોંધ નથી',
//   pending: 'બાકી',
//   partial: 'અંશતઃ ચૂકવેલ',
//   paid: 'પૂર્ણ ચૂકવેલ',
// };

// const METHODS = {
//   cash: 'રોકડ',
//   upi: 'UPI',
//   bank: 'બેંક',
// };

// const newKey = () =>
//   globalThis.crypto?.randomUUID?.() ||
//   `${Date.now()}-${Math.random().toString(36).slice(2)}`;

// const localDate = () => {
//   const date = new Date();

//   return [
//     date.getFullYear(),
//     String(date.getMonth() + 1).padStart(2, '0'),
//     String(date.getDate()).padStart(2, '0'),
//   ].join('-');
// };

// const emptyFilters = {
//   farmer: '',
//   trader: '',
//   crop: '',
//   from: '',
//   to: '',
// };

// function Badge({ status }) {
//   return (
//     <span className={`settle-badge ${status}`}>
//       {STATUS[status]}
//     </span>
//   );
// }

// export default function Settlements() {
//   const [draft, setDraft] = useState(emptyFilters);
//   const [filters, setFilters] = useState(emptyFilters);

//   const [report, setReport] = useState(null);
//   const [options, setOptions] = useState({
//     farmers: [],
//     traders: [],
//     crops: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const [tab, setTab] = useState('deals');
//   const [page, setPage] = useState(0);
//   const [version, setVersion] = useState(0);

//   const [selected, setSelected] = useState(null);
//   const [payment, setPayment] = useState(null);

//   useEffect(() => {
//     let cancelled = false;

//     setLoading(true);
//     setError('');

//     const query = new URLSearchParams(
//       Object.entries(filters).filter(([, value]) => value)
//     );

//     Promise.all([
//       api('/admin/settlements?' + query),
//       api('/admin/settlements/options'),
//     ])
//       .then(([data, choices]) => {
//         if (cancelled) return;

//         setReport(data);
//         setOptions(choices);
//         setPage(0);
//       })
//       .catch(err => {
//         if (cancelled) return;

//         setError(err.message);
//         setReport(null);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [filters, version]);

//   const field = (name, value) =>
//     setDraft(current => ({ ...current, [name]: value }));

//   const openPayment = deal => {
//     setSelected(deal);
//     setError('');
//     setMessage('');

//     setPayment({
//       side: 'trader',
//       amount: '',
//       date: localDate(),
//       method: 'cash',
//       reference: '',
//       note: '',
//       historyComplete: false,
//       key: newKey(),
//     });
//   };

//   // એક જ ફોર્મ માટે key સ્થિર રહે છે; retryમાં duplicate રોકે છે.
//   const editPayment = (name, value) =>
//     setPayment(current => ({
//       ...current,
//       [name]: value,
//     }));

//   const save = async event => {
//     event.preventDefault();

//     if (saving) return;

//     setSaving(true);
//     setError('');
//     setMessage('');

//     try {
//       const result = await api(
//         `/admin/settlements/${selected._id}/payments`,
//         'POST',
//         payment
//       );

//       setMessage(result.msg);
//       setSelected(null);
//       setPayment(null);
//       setVersion(current => current + 1);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const rows = report ? report[tab] : [];
//   const visible = rows.slice(page * 20, (page + 1) * 20);

//   return (
//     <div className="settlements">
//       <h2>💰 સોદા અને ચુકવણી</h2>

//       <p>
//         વેપારી → APMC/એજન્ટની વસૂલાત અને
//         APMC/એજન્ટ → ખેડૂતની ચુકવણી અલગ નોંધાય છે.
//       </p>

//       <form
//         className="card settle-filters"
//         onSubmit={event => {
//           event.preventDefault();
//           setSelected(null);
//           setFilters({ ...draft });
//         }}
//       >
//         <label>
//           ખેડૂત
//           <select
//             value={draft.farmer}
//             onChange={event => field('farmer', event.target.value)}
//           >
//             <option value="">બધા ખેડૂતો</option>
//             {options.farmers.map(person => (
//               <option key={person._id} value={person._id}>
//                 {person.name} — {person.phone}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label>
//           વેપારી
//           <select
//             value={draft.trader}
//             onChange={event => field('trader', event.target.value)}
//           >
//             <option value="">બધા વેપારીઓ</option>
//             {options.traders.map(person => (
//               <option key={person._id} value={person._id}>
//                 {person.name} — {person.phone}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label>
//           પાક
//           <select
//             value={draft.crop}
//             onChange={event => field('crop', event.target.value)}
//           >
//             <option value="">બધા પાક</option>
//             {options.crops.map(crop => (
//               <option key={crop}>{crop}</option>
//             ))}
//           </select>
//         </label>

//         <label>
//           સોદાની તારીખથી
//           <input
//             type="date"
//             value={draft.from}
//             onChange={event => field('from', event.target.value)}
//           />
//         </label>

//         <label>
//           તારીખ સુધી
//           <input
//             type="date"
//             value={draft.to}
//             onChange={event => field('to', event.target.value)}
//           />
//         </label>

//         <button disabled={loading || saving}>રિપોર્ટ જુઓ</button>
//       </form>

//       {error && <p className="err" role="alert">{error}</p>}
//       {message && <p className="ok" role="status">{message}</p>}

//       {selected && (
//         <form className="card settle-payment" onSubmit={save}>
//           <h3>
//             ચુકવણી નોંધો: {selected.cropName} •
//             {' '}{selected.farmer?.name} → {selected.trader?.name}
//           </h3>

//           <p>
//             ખરેખર મળેલી અથવા ખેડૂતને અપાયેલી રકમ,
//             તેની તારીખ અને રેફરન્સ નોંધો.
//           </p>

//           <fieldset disabled={saving}>
//             <label>
//               ચુકવણીનો પ્રકાર
//               <select
//                 value={payment.side}
//                 onChange={event => {
//                   editPayment('side', event.target.value);
//                   editPayment('amount', '');
//                   editPayment('historyComplete', false);
//                 }}
//               >
//                 <option value="trader">
//                   વેપારી પાસેથી APMC/એજન્ટને મળેલ
//                 </option>
//                 <option value="farmer">
//                   APMC/એજન્ટ દ્વારા ખેડૂતને અપાયેલ
//                 </option>
//               </select>
//             </label>

//             <label>
//               રકમ ₹
//               <input
//                 required
//                 type="number"
//                 min={
//                   selected[`${payment.side}PaymentTracked`] === true
//                     ? '0.01'
//                     : '0'
//                 }
//                 step="0.01"
//                 value={payment.amount}
//                 onChange={event =>
//                   editPayment('amount', event.target.value)
//                 }
//               />
//             </label>

//             <label>
//               ચુકવણીની તારીખ
//               <input
//                 required
//                 type="date"
//                 max={localDate()}
//                 value={payment.date}
//                 onChange={event =>
//                   editPayment('date', event.target.value)
//                 }
//               />
//             </label>

//             <label>
//               રીત
//               <select
//                 value={payment.method}
//                 onChange={event =>
//                   editPayment('method', event.target.value)
//                 }
//               >
//                 {Object.entries(METHODS).map(([value, label]) => (
//                   <option key={value} value={value}>{label}</option>
//                 ))}
//               </select>
//             </label>

//             <label>
//               રસીદ / ટ્રાન્ઝેક્શન નંબર
//               <input
//                 maxLength={100}
//                 value={payment.reference}
//                 onChange={event =>
//                   editPayment('reference', event.target.value)
//                 }
//               />
//             </label>

//             <label>
//               નોંધ
//               <input
//                 maxLength={300}
//                 value={payment.note}
//                 onChange={event =>
//                   editPayment('note', event.target.value)
//                 }
//               />
//             </label>

//             {selected[`${payment.side}PaymentTracked`] !== true && (
//               <label className="settle-check">
//                 <input
//                   type="checkbox"
//                   checked={payment.historyComplete}
//                   onChange={event =>
//                     editPayment('historyComplete', event.target.checked)
//                   }
//                 />
//                 આ સોદાની આ પ્રકારની બધી જૂની ચુકવણીઓ નોંધાઈ ગઈ છે.
//                 કોઈ ચુકવણી ન થઈ હોય તો રકમ ₹0 રાખીને ખાતરી કરો.
//               </label>
//             )}

//             <button>
//               {saving ? 'નોંધાઈ રહ્યું છે...' : 'ચુકવણી સાચવો'}
//             </button>

//             <button
//               type="button"
//               className="alt"
//               onClick={() => setSelected(null)}
//             >
//               બંધ કરો
//             </button>
//           </fieldset>
//         </form>
//       )}

//       {loading ? (
//         <p role="status">રિપોર્ટ લોડ થઈ રહ્યો છે...</p>
//       ) : report && (
//         <>
//           <div className="settle-summary">
//             {[
//               ['વેપારી પાસેથી નોંધાયેલી વસૂલાત',
//                 report.totals.traderPaidPaise],
//               ['વેપારી પાસેથી ખાતરી કરેલી બાકી રકમ',
//                 report.totals.traderPendingPaise],
//               ['ખેડૂતોને નોંધાયેલી ચૂકવેલી રકમ',
//                 report.totals.farmerPaidPaise],
//               ['ખેડૂતોને ખાતરી કરેલી બાકી ચુકવણી',
//                 report.totals.farmerPendingPaise],
//             ].map(([label, amount]) => (
//               <div className="card" key={label}>
//                 <strong>{money(amount)}</strong>
//                 <span>{label}</span>
//               </div>
//             ))}
//           </div>

//           <p>
//             કુલ વેચાણ: <b>{money(report.totals.grossPaise)}</b>
//             {' • '}
//             કમિશન બાદ ખેડૂતોની કુલ હકની રકમ:
//             {' '}<b>{money(report.totals.farmerNetPaise)}</b>
//           </p>

//           {(report.totals.traderUnknown > 0 ||
//             report.totals.farmerUnknown > 0) && (
//             <p className="settle-note">
//               જૂના સોદામાં વેપારીની ચુકવણીની નોંધ નથી:
//               {' '}{report.totals.traderUnknown}
//               {' • '}
//               ખેડૂતને ચુકવણીની નોંધ નથી:
//               {' '}{report.totals.farmerUnknown}.
//               આ રકમો ઉપરની ખાતરી કરેલી બાકી રકમમાં સમાવેલી નથી.
//             </p>
//           )}

//           <div className="settle-tabs">
//             {[
//               ['deals', 'સોદાવાર વિગત'],
//               ['farmers', 'ખેડૂતની પાકવાર આવક'],
//               ['traders', 'વેપારીની પાકવાર ખરીદી'],
//             ].map(([value, label]) => (
//               <button
//                 key={value}
//                 type="button"
//                 aria-pressed={tab === value}
//                 onClick={() => {
//                   setTab(value);
//                   setPage(0);
//                 }}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>

//           <div className="card settle-table">
//             {tab === 'deals' ? (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>સોદાની તારીખ</th>
//                     <th>ખેડૂત</th>
//                     <th>વેપારી</th>
//                     <th>પાક / મણ / ભાવ</th>
//                     <th>કુલ / ખેડૂતની હકની રકમ</th>
//                     <th>વેપારીની ચુકવણી</th>
//                     <th>ખેડૂતને ચુકવણી</th>
//                     <th>નોંધ</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {visible.map(deal => (
//                     <tr key={deal._id}>
//                       <td>
//                         {new Date(deal.createdAt).toLocaleDateString(
//                           'en-IN',
//                           { timeZone: 'Asia/Kolkata' }
//                         )}
//                       </td>

//                       <td>
//                         {deal.farmer?.name}<br />
//                         <small>{deal.farmer?.phone}</small>
//                       </td>

//                       <td>
//                         {deal.trader?.name}<br />
//                         <small>{deal.trader?.phone}</small>
//                       </td>

//                       <td>
//                         {deal.cropName}<br />
//                         {deal.man} મણ × ₹{deal.rate}
//                       </td>

//                       <td>
//                         {money(deal.grossPaise)}<br />
//                         <small>
//                           ખેડૂત: {money(deal.farmerNetPaise)}
//                         </small>
//                       </td>

//                       <td>
//                         <Badge status={deal.traderStatus} /><br />
//                         નોંધાયેલ: {money(deal.traderPaidPaise)}<br />
//                         <small>
//                           બાકી: {money(deal.traderPendingPaise)}
//                         </small>
//                       </td>

//                       <td>
//                         <Badge status={deal.farmerStatus} /><br />
//                         નોંધાયેલ: {money(deal.farmerPaidPaise)}<br />
//                         <small>
//                           બાકી: {money(deal.farmerPendingPaise)}
//                         </small>
//                       </td>

//                       <td>
//                         <button
//                           type="button"
//                           disabled={saving}
//                           onClick={() => openPayment(deal)}
//                         >
//                           ચુકવણી નોંધો
//                         </button>

//                         <details>
//                           <summary>
//                             ઇતિહાસ ({deal.payments?.length || 0})
//                           </summary>

//                           {deal.payments?.map(entry => (
//                             <div
//                               className="settle-history"
//                               key={entry._id}
//                             >
//                               {entry.kind === 'verification' &&
//                                 'ઇતિહાસની ખાતરી • '}
//                               {entry.date}
//                               {' • '}
//                               {entry.side === 'trader'
//                                 ? 'વેપારી પાસેથી વસૂલાત'
//                                 : 'ખેડૂતને ચુકવણી'}
//                               <br />

//                               <b>{money(entry.amountPaise)}</b>
//                               {' • '}{METHODS[entry.method]}
//                               <br />

//                               {entry.reference || 'રેફરન્સ નથી'}
//                               <br />
//                               {entry.note}<br />

//                               <small>
//                                 નોંધનાર: {entry.recordedBy?.name || '—'}
//                               </small>
//                             </div>
//                           ))}
//                         </details>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>{tab === 'farmers' ? 'ખેડૂત' : 'વેપારી'}</th>
//                     <th>પાક</th>
//                     <th>મણ</th>
//                     <th>
//                       {tab === 'farmers'
//                         ? 'કમિશન બાદ હકની રકમ'
//                         : 'કુલ ખરીદી'}
//                     </th>
//                     <th>
//                       {tab === 'farmers'
//                         ? 'મળેલી નોંધાયેલી રકમ'
//                         : 'ચૂકવેલી નોંધાયેલી રકમ'}
//                     </th>
//                     <th>ખાતરી કરેલી બાકી</th>
//                     <th>નોંધ વગરના સોદા</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {visible.map(item => (
//                     <tr key={`${item.person?._id}-${item.crop}`}>
//                       <td>
//                         {item.person?.name}<br />
//                         <small>{item.person?.phone}</small>
//                       </td>
//                       <td>{item.crop}</td>
//                       <td>{item.man}</td>
//                       <td>
//                         {money(
//                           tab === 'farmers'
//                             ? item.netPaise
//                             : item.grossPaise
//                         )}
//                       </td>
//                       <td>
//                         {money(
//                           tab === 'farmers'
//                             ? item.receivedPaise
//                             : item.paidPaise
//                         )}
//                       </td>
//                       <td>{money(item.pendingPaise)}</td>
//                       <td>{item.unknownDeals}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}

//             {!rows.length && (
//               <p>આ પસંદગી માટે કોઈ સોદા નથી.</p>
//             )}
//           </div>

//           <div className="settle-pagination">
//             <button
//               disabled={page === 0}
//               onClick={() => setPage(current => current - 1)}
//             >
//               પાછળ
//             </button>

//             <span>
//               પેજ {page + 1} / {Math.max(1, Math.ceil(rows.length / 20))}
//             </span>

//             <button
//               disabled={(page + 1) * 20 >= rows.length}
//               onClick={() => setPage(current => current + 1)}
//             >
//               આગળ
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { displayCropName } from '../../constants.js';
import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import './Settlements.css';

const money = value =>
  value == null
    ? '—'
    : `₹${(value / 100).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

const STATUS = {
  unknown: 'નોંધ નથી',
  pending: 'બાકી',
  partial: 'અંશતઃ ચૂકવેલ',
  paid: 'પૂર્ણ ચૂકવેલ',
};

const METHODS = {
  cash: 'રોકડ',
  upi: 'UPI',
  bank: 'બેંક',
};

const newKey = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const localDate = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
};

const emptyFilters = {
  farmer: '',
  trader: '',
  crop: '',
  from: '',
  to: '',
};

function Badge({ status }) {
  return (
    <span className={`settle-badge ${status}`}>
      {STATUS[status]}
    </span>
  );
}

export default function Settlements() {
  const [draft, setDraft] = useState(emptyFilters);
  const [filters, setFilters] = useState(emptyFilters);

  const [report, setReport] = useState(null);
  const [options, setOptions] = useState({
    farmers: [],
    traders: [],
    crops: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [tab, setTab] = useState('deals');
  const [page, setPage] = useState(0);
  const [version, setVersion] = useState(0);

  const [selected, setSelected] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError('');

    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value)
    );

    Promise.all([
      api('/admin/settlements?' + query),
      api('/admin/settlements/options'),
    ])
      .then(([data, choices]) => {
        if (cancelled) return;

        setReport(data);
        setOptions(choices);
        setPage(0);
      })
      .catch(err => {
        if (cancelled) return;

        setError(err.message);
        setReport(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, version]);

  const field = (name, value) =>
    setDraft(current => ({ ...current, [name]: value }));

  const openPayment = deal => {
    setSelected(deal);
    setError('');
    setMessage('');

    setPayment({
      side: 'trader',
      amount: '',
      date: localDate(),
      method: 'cash',
      reference: '',
      note: '',
      historyComplete: false,
      key: newKey(),
    });
  };

  // એક જ ફોર્મ માટે key સ્થિર રહે છે; retryમાં duplicate રોકે છે.
  const editPayment = (name, value) =>
    setPayment(current => ({
      ...current,
      [name]: value,
    }));

  const save = async event => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const result = await api(
        `/admin/settlements/${selected._id}/payments`,
        'POST',
        payment
      );

      setMessage(result.msg);
      setSelected(null);
      setPayment(null);
      setVersion(current => current + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const rows = report ? report[tab] : [];
  const visible = rows.slice(page * 20, (page + 1) * 20);

  return (
    <div className="settlements">
      <h2>💰 સોદા અને ચુકવણી</h2>

      <p>
        વેપારી → APMC/એજન્ટની વસૂલાત અને
        APMC/એજન્ટ → ખેડૂતની ચુકવણી અલગ નોંધાય છે.
      </p>

      <form
        className="card settle-filters"
        onSubmit={event => {
          event.preventDefault();
          setSelected(null);
          setFilters({ ...draft });
        }}
      >
        <label>
          ખેડૂત
          <select
            value={draft.farmer}
            onChange={event => field('farmer', event.target.value)}
          >
            <option value="">બધા ખેડૂતો</option>
            {options.farmers.map(person => (
              <option key={person._id} value={person._id}>
                {person.name} — {person.phone}
              </option>
            ))}
          </select>
        </label>

        <label>
          વેપારી
          <select
            value={draft.trader}
            onChange={event => field('trader', event.target.value)}
          >
            <option value="">બધા વેપારીઓ</option>
            {options.traders.map(person => (
              <option key={person._id} value={person._id}>
                {person.name} — {person.phone}
              </option>
            ))}
          </select>
        </label>

        <label>
          પાક
          <select
            value={draft.crop}
            onChange={event => field('crop', event.target.value)}
          >
            <option value="">બધા પાક</option>
            {options.crops.map(crop => (
              <option key={crop} value={crop}>{displayCropName(crop)}</option>
            ))}
          </select>
        </label>

        <label>
          સોદાની તારીખથી
          <input
            type="date"
            value={draft.from}
            onChange={event => field('from', event.target.value)}
          />
        </label>

        <label>
          તારીખ સુધી
          <input
            type="date"
            value={draft.to}
            onChange={event => field('to', event.target.value)}
          />
        </label>

        <button disabled={loading || saving}>રિપોર્ટ જુઓ</button>
      </form>

      {error && <p className="err" role="alert">{error}</p>}
      {message && <p className="ok" role="status">{message}</p>}

      {selected && (
        <form className="card settle-payment" onSubmit={save}>
          <h3>
            ચુકવણી નોંધો: {displayCropName(selected.cropName)} •
            {' '}{selected.farmer?.name} → {selected.trader?.name}
          </h3>

          <p>
            ખરેખર મળેલી અથવા ખેડૂતને અપાયેલી રકમ,
            તેની તારીખ અને રેફરન્સ નોંધો.
          </p>

          <fieldset disabled={saving}>
            <label>
              ચુકવણીનો પ્રકાર
              <select
                value={payment.side}
                onChange={event => {
                  editPayment('side', event.target.value);
                  editPayment('amount', '');
                  editPayment('historyComplete', false);
                }}
              >
                <option value="trader">
                  વેપારી પાસેથી APMC/એજન્ટને મળેલ
                </option>
                <option value="farmer">
                  APMC/એજન્ટ દ્વારા ખેડૂતને અપાયેલ
                </option>
              </select>
            </label>

            <label>
              રકમ ₹
              <input
                required
                type="number"
                min={
                  selected[`${payment.side}PaymentTracked`] === true
                    ? '0.01'
                    : '0'
                }
                step="0.01"
                value={payment.amount}
                onChange={event =>
                  editPayment('amount', event.target.value)
                }
              />
            </label>

            <label>
              ચુકવણીની તારીખ
              <input
                required
                type="date"
                max={localDate()}
                value={payment.date}
                onChange={event =>
                  editPayment('date', event.target.value)
                }
              />
            </label>

            <label>
              રીત
              <select
                value={payment.method}
                onChange={event =>
                  editPayment('method', event.target.value)
                }
              >
                {Object.entries(METHODS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label>
              રસીદ / ટ્રાન્ઝેક્શન નંબર
              <input
                maxLength={100}
                value={payment.reference}
                onChange={event =>
                  editPayment('reference', event.target.value)
                }
              />
            </label>

            <label>
              નોંધ
              <input
                maxLength={300}
                value={payment.note}
                onChange={event =>
                  editPayment('note', event.target.value)
                }
              />
            </label>

            {selected[`${payment.side}PaymentTracked`] !== true && (
              <label className="settle-check">
                <input
                  type="checkbox"
                  checked={payment.historyComplete}
                  onChange={event =>
                    editPayment('historyComplete', event.target.checked)
                  }
                />
                આ સોદાની આ પ્રકારની બધી જૂની ચુકવણીઓ નોંધાઈ ગઈ છે.
                કોઈ ચુકવણી ન થઈ હોય તો રકમ ₹0 રાખીને ખાતરી કરો.
              </label>
            )}

            <button>
              {saving ? 'નોંધાઈ રહ્યું છે...' : 'ચુકવણી સાચવો'}
            </button>

            <button
              type="button"
              className="alt"
              onClick={() => setSelected(null)}
            >
              બંધ કરો
            </button>
          </fieldset>
        </form>
      )}

      {loading ? (
        <p role="status">રિપોર્ટ લોડ થઈ રહ્યો છે...</p>
      ) : report && (
        <>
          <div className="settle-summary">
            {[
              ['વેપારી પાસેથી નોંધાયેલી વસૂલાત',
                report.totals.traderPaidPaise],
              ['વેપારી પાસેથી ખાતરી કરેલી બાકી રકમ',
                report.totals.traderPendingPaise],
              ['ખેડૂતોને નોંધાયેલી ચૂકવેલી રકમ',
                report.totals.farmerPaidPaise],
              ['ખેડૂતોને ખાતરી કરેલી બાકી ચુકવણી',
                report.totals.farmerPendingPaise],
            ].map(([label, amount]) => (
              <div className="card" key={label}>
                <strong>{money(amount)}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <p>
            કુલ વેચાણ: <b>{money(report.totals.grossPaise)}</b>
            {' • '}
            કમિશન બાદ ખેડૂતોની કુલ હકની રકમ:
            {' '}<b>{money(report.totals.farmerNetPaise)}</b>
          </p>

          {(report.totals.traderUnknown > 0 ||
            report.totals.farmerUnknown > 0) && (
            <p className="settle-note">
              જૂના સોદામાં વેપારીની ચુકવણીની નોંધ નથી:
              {' '}{report.totals.traderUnknown}
              {' • '}
              ખેડૂતને ચુકવણીની નોંધ નથી:
              {' '}{report.totals.farmerUnknown}.
              આ રકમો ઉપરની ખાતરી કરેલી બાકી રકમમાં સમાવેલી નથી.
            </p>
          )}

          <div className="settle-tabs">
            {[
              ['deals', 'સોદાવાર વિગત'],
              ['farmers', 'ખેડૂતની પાકવાર આવક'],
              ['traders', 'વેપારીની પાકવાર ખરીદી'],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={tab === value}
                onClick={() => {
                  setTab(value);
                  setPage(0);
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="card settle-table">
            {tab === 'deals' ? (
              <table>
                <thead>
                  <tr>
                    <th>સોદાની તારીખ</th>
                    <th>ખેડૂત</th>
                    <th>વેપારી</th>
                    <th>પાક / મણ / ભાવ</th>
                    <th>કુલ / ખેડૂતની હકની રકમ</th>
                    <th>વેપારીની ચુકવણી</th>
                    <th>ખેડૂતને ચુકવણી</th>
                    <th>નોંધ</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map(deal => (
                    <tr key={deal._id}>
                      <td>
                        {new Date(deal.createdAt).toLocaleDateString(
                          'en-IN',
                          { timeZone: 'Asia/Kolkata' }
                        )}
                      </td>

                      <td>
                        {deal.farmer?.name}<br />
                        <small>{deal.farmer?.phone}</small>
                      </td>

                      <td>
                        {deal.trader?.name}<br />
                        <small>{deal.trader?.phone}</small>
                      </td>

                      <td>
                        {displayCropName(deal.cropName)}<br />
                        {deal.man} મણ × ₹{deal.rate}
                      </td>

                      <td>
                        {money(deal.grossPaise)}<br />
                        <small>
                          ખેડૂત: {money(deal.farmerNetPaise)}
                        </small>
                      </td>

                      <td>
                        <Badge status={deal.traderStatus} /><br />
                        નોંધાયેલ: {money(deal.traderPaidPaise)}<br />
                        <small>
                          બાકી: {money(deal.traderPendingPaise)}
                        </small>
                      </td>

                      <td>
                        <Badge status={deal.farmerStatus} /><br />
                        નોંધાયેલ: {money(deal.farmerPaidPaise)}<br />
                        <small>
                          બાકી: {money(deal.farmerPendingPaise)}
                        </small>
                      </td>

                      <td>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => openPayment(deal)}
                        >
                          ચુકવણી નોંધો
                        </button>

                        <details>
                          <summary>
                            ઇતિહાસ ({deal.payments?.length || 0})
                          </summary>

                          {deal.payments?.map(entry => (
                            <div
                              className="settle-history"
                              key={entry._id}
                            >
                              {entry.kind === 'verification' &&
                                'ઇતિહાસની ખાતરી • '}
                              {entry.date}
                              {' • '}
                              {entry.side === 'trader'
                                ? 'વેપારી પાસેથી વસૂલાત'
                                : 'ખેડૂતને ચુકવણી'}
                              <br />

                              <b>{money(entry.amountPaise)}</b>
                              {' • '}{METHODS[entry.method]}
                              <br />

                              {entry.reference || 'રેફરન્સ નથી'}
                              <br />
                              {entry.note}<br />

                              <small>
                                નોંધનાર: {entry.recordedBy?.name || '—'}
                              </small>
                            </div>
                          ))}
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>{tab === 'farmers' ? 'ખેડૂત' : 'વેપારી'}</th>
                    <th>પાક</th>
                    <th>મણ</th>
                    <th>
                      {tab === 'farmers'
                        ? 'કમિશન બાદ હકની રકમ'
                        : 'કુલ ખરીદી'}
                    </th>
                    <th>
                      {tab === 'farmers'
                        ? 'મળેલી નોંધાયેલી રકમ'
                        : 'ચૂકવેલી નોંધાયેલી રકમ'}
                    </th>
                    <th>ખાતરી કરેલી બાકી</th>
                    <th>નોંધ વગરના સોદા</th>
                  </tr>
                </thead>

                <tbody>
                  {visible.map(item => (
                    <tr key={`${item.person?._id}-${displayCropName(item.crop)}`}>
                      <td>
                        {item.person?.name}<br />
                        <small>{item.person?.phone}</small>
                      </td>
                      <td>{displayCropName(item.crop)}</td>
                      <td>{item.man}</td>
                      <td>
                        {money(
                          tab === 'farmers'
                            ? item.netPaise
                            : item.grossPaise
                        )}
                      </td>
                      <td>
                        {money(
                          tab === 'farmers'
                            ? item.receivedPaise
                            : item.paidPaise
                        )}
                      </td>
                      <td>{money(item.pendingPaise)}</td>
                      <td>{item.unknownDeals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {!rows.length && (
              <p>આ પસંદગી માટે કોઈ સોદા નથી.</p>
            )}
          </div>

          <div className="settle-pagination">
            <button
              disabled={page === 0}
              onClick={() => setPage(current => current - 1)}
            >
              પાછળ
            </button>

            <span>
              પેજ {page + 1} / {Math.max(1, Math.ceil(rows.length / 20))}
            </span>

            <button
              disabled={(page + 1) * 20 >= rows.length}
              onClick={() => setPage(current => current + 1)}
            >
              આગળ
            </button>
          </div>
        </>
      )}
    </div>
  );
}