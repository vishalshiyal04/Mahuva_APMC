import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getAuth } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import Msg from '../components/Msg.jsx';

const ROLE = { farmer: '🌾 ખેડૂત', trader: '💼 વેપારી', admin: '👑 એડમિન', agent: '🏪 કમિશન એજન્ટ' };
const sum = (list, key) => list.reduce((a, x) => a + (x[key] || 0), 0);

// દરેક રોલ માટે અલગ આંકડા
async function loadStats(role) {
  if (role === 'farmer') {
    const [c, t] = await Promise.all([api('/crops/mine'), api('/patti/mine')]);
    return [['કુલ માલ', c.length], ['વેચાયેલા', c.filter(x => x.status === 'sold').length], ['કુલ આવક ₹', sum(t, 'farmerNet')]];
  }
  if (role === 'trader') {
    const t = await api('/patti/mine');
    return [['ખરીદેલા સોદા', t.length], ['કુલ ખરીદી ₹', sum(t, 'gross')]];
  }
  if (role === 'agent') {
    const d = await api('/agent/bills');
    return [['કુલ પટ્ટી', d.bills.length], ['કુલ કમિશન ₹', sum(d.bills, 'commission')]];
  }
  if (role === 'admin') {
    const s = await api('/admin/stats');
    return [['ખેડૂતો', s.farmers], ['વેપારીઓ', s.traders], ['સોદા', s.deals], ['કમિશન ₹', s.commission]];
  }
  return [];
}

const until = d => (d && new Date(d) > new Date() ? `✅ સક્રિય • ${new Date(d).toLocaleDateString()} સુધી` : '❌ સક્રિય નથી');

export default function Profile() {
  const [p, loadP, err] = useLoad(() => api('/profile'));
  const [stats, setStats] = useState([]);
  const [f, setF] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!p) return;
    setF({ name: p.name, gst: p.gst || '', license: p.license || '' });
    loadStats(p.role).then(setStats).catch(() => {});
  }, [p?._id]);

  const save = async () => {
    try {
      const d = await api('/profile', 'PUT', f);
      const a = getAuth();
      a.user.name = d.name;                                  // મેનુમાં નામ તરત બદલાય
      sessionStorage.setItem('auth', JSON.stringify(a));
      window.dispatchEvent(new Event('auth-change'));
      setMsg(d.msg);
      loadP();
    } catch (x) { setMsg('⚠ ' + x.message); }
  };

  if (!p) return <div className="card">{err ? <p className="err">{err}</p> : 'લોડ થઈ રહ્યું છે...'}</div>;

  return (
    <>
      <div className="card profile-head">
        <div className="avatar">{p.name?.[0]}</div>
        <div>
          <h2 style={{ margin: 0 }}>{p.name}</h2>
          <span className="badge">{ROLE[p.role]}</span>
        </div>
        <Link className="btn-yellow" style={{ marginLeft: 'auto' }} to={'/' + p.role}>ડેશબોર્ડ ખોલો →</Link>
      </div>

      {stats.length > 0 && (
        <div className="grid">
          {stats.map(([k, v]) => <div key={k} className="card"><div className="big">{v}</div>{k}</div>)}
        </div>
      )}

      <div className="card">
        <h3>👤 મારી વિગત</h3>
        <div className="kv"><span>મોબાઈલ નંબર</span><b>{p.phone}</b></div>
        <div className="kv"><span>રોલ</span><b>{ROLE[p.role]}</b></div>
        <div className="kv"><span>ખાતું બન્યું</span><b>{new Date(p.createdAt).toLocaleDateString()}</b></div>
        {p.role === 'trader' && <>
          <div className="kv"><span>GST નંબર</span><b>{p.gst || '-'}</b></div>
          <div className="kv"><span>લાયસન્સ નંબર</span><b>{p.license || '-'}</b></div>
          <div className="kv"><span>સબ્સ્ક્રિપ્શન</span><b>{until(p.subscriptionUntil)}</b></div>
        </>}
        {p.role === 'agent' && <>
          <div className="kv"><span>દુકાનનું નામ</span><b>{p.shopName || '-'}</b></div>
          <div className="kv"><span>સોફ્ટવેર લાયસન્સ</span><b>{until(p.licenseUntil)}</b></div>
        </>}
      </div>

      <div className="card">
        <h3>✏️ પ્રોફાઇલ સુધારો</h3>
        <label className="field"><span>પૂરું નામ</span>
          <input value={f.name || ''} onChange={e => setF({ ...f, name: e.target.value })} />
        </label>
        {p.role === 'trader' && <>
          <label className="field"><span>GST નંબર</span><input value={f.gst || ''} onChange={e => setF({ ...f, gst: e.target.value })} /></label>
          <label className="field"><span>લાયસન્સ નંબર</span><input value={f.license || ''} onChange={e => setF({ ...f, license: e.target.value })} /></label>
        </>}
        <button onClick={save}>સેવ કરો</button>
        <Msg e={msg} ok />
      </div>
    </>
  );
}