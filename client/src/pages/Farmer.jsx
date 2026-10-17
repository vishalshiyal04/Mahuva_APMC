import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { api, tok } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import usePagination from '../hooks/usePagination.js';
import Msg from '../components/Msg.jsx';
import Pagination from '../components/Pagination.jsx';
import CropPicker from '../components/CropPicker.jsx';
import { displayCropName } from '../constants.js';
import Pattis from '../components/Pattis.jsx';
import BidPanel from '../components/BidPanel.jsx';
import GatePass from '../components/GatePass.jsx';

export default function Farmer() {
  const [crops, load] = useLoad(() => api('/crops/mine'));
  const pg = usePagination(crops, 8); // પેજિનેશન હૂક (પ્રતિ પેજ 8 આઇટમ્સ)
  const [pattis, loadP] = useLoad(() => api('/patti/mine'));
  const [f, setF] = useState({ name: '', grade: 'A' });
  const [photo, setPhoto] = useState(null);
  const [qr, setQr] = useState(null);
  const [e, setE] = useState('');
  const set = k => ev => setF({ ...f, [k]: ev.target.value });

  useEffect(() => {
    const s = io();
    s.on('auction:update', () => { load(); loadP(); });
    return () => s.close();
  }, []);

  const add = async () => {
    try {
      if (!f.name) throw new Error('પાકની જાત / નંબર પસંદ કરો.');
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      const r = await fetch('/api/crops', { method: 'POST', headers: { Authorization: 'Bearer ' + tok() }, body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'ભૂલ');
      setE('');
      load();
    } catch (x) { setE(x.message); }
  };

  // વેરીફાય થયા પહેલાં માલ રદ કરો
  const cancelCrop = async id => {
    if (!confirm('આ માલ રદ કરવો છે?')) return;
    try { await api('/crops/' + id, 'DELETE'); setE(''); load(); } catch (x) { setE(x.message); }
  };

  return (
    <>
      {crops?.filter(c => c.status === 'auction').map(c => (
        <div key={c._id} className="card live">
          <h3><span className="dot" />લાઈવ હરાજી ચાલુ: {displayCropName(c.name)} ({c.grade}) {c.man} મણ</h3>
          <div key={c.highestBid} className="big flash">₹{c.highestBid}/મણ</div>
          <small>શરૂઆતનો ભાવ ₹{c.basePrice}{c.highestBid > c.basePrice && ` | ₹${c.highestBid - c.basePrice} વધુ`} | કુલ અંદાજ ₹{c.highestBid * c.man}</small>
          <BidPanel cropId={c._id} role="farmer" />
        </div>
      ))}
      {crops && !crops.some(c => c.status === 'auction') && (
        <div className="card"><small>અત્યારે તમારા કોઈ માલની હરાજી ચાલુ નથી.</small></div>
      )}

      <div className="card">
        <h3>માલની એન્ટ્રી</h3>
        <CropPicker value={f.name} onChange={name => setF({ ...f, name })} />
        <select onChange={set('grade')}><option>A</option><option>B</option><option>C</option></select>
        <input type="number" placeholder="મણ" onChange={set('man')} />
        <input type="number" placeholder="લઘુત્તમ ભાવ/મણ" onChange={set('basePrice')} />
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setPhoto(e.target.files[0])} />
        <button onClick={add}>ગેટ પાસ બનાવો</button>
        <Msg e={e} />
      </div>

      {qr && <GatePass pass={qr} />}

      <div className="card">
        <h3>મારો માલ</h3>
        <table>
          <tbody>
            {/* crops?.map ની જગ્યાએ pg.slice?.map વાપર્યું છે */}
            {pg.slice?.map(c => (
              <tr key={c._id}>
                <td>{displayCropName(c.name)} ({c.grade})</td>
                <td>{c.man} મણ</td>
                <td>{c.status}</td>
                <td>શેડ: {c.shed || '-'}</td>
                <td>{c.photo && <img src={c.photo} width="48" alt="" />}</td>
                <td>
                  <button onClick={async () => setQr({ ...(await api(`/crops/${c._id}/qr`)), crop: c })}>QR</button>
                  {c.status === 'pending' && <button className="alt" onClick={() => cancelCrop(c._id)}>રદ કરો</button>}
                  {c.status === 'sold' && <BidPanel cropId={c._id} role="farmer" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* પેજિનેશન કંટ્રોલ */}
        <Pagination pg={pg} />
      </div>

      <Pattis list={pattis} />
    </>
  );
}