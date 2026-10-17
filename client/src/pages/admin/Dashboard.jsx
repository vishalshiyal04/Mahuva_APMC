import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';

export default function Dashboard() {
  const [st] = useLoad(() => api('/admin/stats'));
  const [crops] = useLoad(() => api('/admin/crops'));
  const [subs] = useLoad(() => api('/admin/subs'));
  const count = s => crops?.filter(c => c.status === s).length ?? 0;
  const tasks = [
    ['⏳', 'વેરીફાય કરવાનો બાકી માલ', count('pending'), '/admin/crops'],
    ['🔨', 'હરાજી શરૂ કરવા તૈયાર માલ', count('entered'), '/admin/crops'],
    ['🔴', 'ચાલુ હરાજી', count('auction'), '/admin/crops'],
    ['💼', 'સબ્સ્ક્રિપ્શન વિનંતી', subs?.filter(u => u.subRequest === 'requested').length ?? 0, '/admin/traders'],
  ];
  return (
    <>
      <h2>📊 ડેશબોર્ડ</h2>
      <div className="grid admin-stats">
        {st && [['ખેડૂતો', st.farmers], ['વેપારીઓ', st.traders], ['સોદા', st.deals], ['ટર્નઓવર ₹', st.turnover], ['કમિશન કમાણી ₹', st.commission]]
          .map(([k, v]) => <div key={k} className="card"><div className="big">{v}</div>{k}</div>)}
      </div>
      <h3>⚡ હમણાં કરવાનું</h3>
      <div className="admin-tasks">
        {tasks.map(([icon, label, n, to]) => (
          <Link key={label} to={to} className={'card task' + (n > 0 ? ' hot' : '')}>
            <span className="task-ico">{icon}</span><div><b>{n}</b><small>{label}</small></div>
          </Link>
        ))}
      </div>
    </>
  );
}