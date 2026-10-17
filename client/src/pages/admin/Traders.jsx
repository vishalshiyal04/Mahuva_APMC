import { api } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import CrudTable from '../../components/admin/CrudTable.jsx';

const REQ = { none: '-', requested: '🔔 વિનંતી', approved: '✔ મંજૂર' };
const active = u => u.subscriptionUntil && new Date(u.subscriptionUntil) > new Date();

export default function Traders() {
  const [list, load] = useLoad(() => api('/admin/subs'));
  const [msg, run] = useAction();
  return (
    <>
      <h2>💼 વેપારી સબ્સ્ક્રિપ્શન</h2>
      <Msg e={msg} ok />
      <div className="card">
        <CrudTable
          items={list}
          columns={[
            { label: 'વેપારી', render: u => u.name },
            { label: 'મોબાઈલ', render: u => u.phone },
            { label: 'વિનંતી', render: u => REQ[u.subRequest] || '-' },
            { label: 'સબ્સ્ક્રિપ્શન', render: u => (active(u) ? '✅ ' + new Date(u.subscriptionUntil).toLocaleDateString() + ' સુધી' : '❌ સક્રિય નથી') },
          ]}
          canEdit={() => false}
          canDelete={() => false}
          extra={u => (
            <>
              <button onClick={() => run(() => api(`/admin/subs/${u._id}/approve`, 'POST'), load)}>30 દિવસ મંજૂર</button>
              {active(u) && <button className="alt" onClick={() => confirm('સબ્સ્ક્રિપ્શન રદ કરવું છે?') && run(() => api(`/admin/subs/${u._id}/revoke`, 'POST'), load)}>રદ કરો</button>}
            </>
          )}
        />
      </div>
    </>
  );
}