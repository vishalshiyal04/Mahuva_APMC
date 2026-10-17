import { useState } from 'react';
import { api } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import CrudTable from '../../components/admin/CrudTable.jsx';

export default function Ads() {
  const [list, load] = useLoad(() => api('/admin/ads'));
  const [msg, run] = useAction();
  const [ad, setAd] = useState({ title: '', company: '', text: '' });
  const add = () => run(() => api('/admin/ads', 'POST', ad), load).then(ok => ok && setAd({ title: '', company: '', text: '' }));
  return (
    <>
      <h2>📣 જાહેરાતો</h2>
      <div className="card">
        <h3>નવી જાહેરાત</h3>
        <input placeholder="શીર્ષક" value={ad.title} onChange={e => setAd({ ...ad, title: e.target.value })} />
        <input placeholder="કંપની" value={ad.company} onChange={e => setAd({ ...ad, company: e.target.value })} />
        <input placeholder="લખાણ" value={ad.text} onChange={e => setAd({ ...ad, text: e.target.value })} />
        <button onClick={add}>ઉમેરો</button>
        <Msg e={msg} ok />
      </div>
      <div className="card">
        <CrudTable
          items={list}
          columns={[
            { label: 'શીર્ષક', render: a => <b>{a.title}</b> },
            { label: 'કંપની', render: a => a.company },
            { label: 'લખાણ', render: a => a.text },
            { label: 'સ્થિતિ', render: a => (a.active ? '🟢 ચાલુ' : '⚪ બંધ') },
          ]}
          fields={[
            { key: 'title', label: 'શીર્ષક' }, { key: 'company', label: 'કંપની' },
            { key: 'text', label: 'લખાણ', type: 'textarea' }, { key: 'active', label: 'સાઇટ પર બતાવો', type: 'check' },
          ]}
          onSave={(a, d) => run(() => api(`/admin/ads/${a._id}`, 'PUT', d), load)}
          onDelete={a => run(() => api(`/admin/ads/${a._id}`, 'DELETE'), load)}
        />
      </div>
    </>
  );
}