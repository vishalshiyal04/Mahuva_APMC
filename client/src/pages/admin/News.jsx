import { useState } from 'react';
import { api } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import CrudTable from '../../components/admin/CrudTable.jsx';

export default function News() {
  const [list, load] = useLoad(() => api('/news'));
  const [msg, run] = useAction();
  const [n, setN] = useState({ title: '', body: '' });
  const add = () => run(() => api('/admin/news', 'POST', n), load).then(ok => ok && setN({ title: '', body: '' }));
  return (
    <>
      <h2>📢 સમાચાર</h2>
      <div className="card">
        <h3>નવા સમાચાર</h3>
        <input placeholder="શીર્ષક" value={n.title} onChange={e => setN({ ...n, title: e.target.value })} />
        <input placeholder="વિગત" value={n.body} onChange={e => setN({ ...n, body: e.target.value })} />
        <button onClick={add}>ઉમેરો</button>
        <Msg e={msg} ok />
      </div>
      <div className="card">
        <CrudTable
          items={list}
          columns={[
            { label: 'શીર્ષક', render: x => <b>{x.title}</b> },
            { label: 'વિગત', render: x => (x.body || '').slice(0, 80) },
            { label: 'તારીખ', render: x => new Date(x.createdAt).toLocaleDateString() },
          ]}
          fields={[{ key: 'title', label: 'શીર્ષક' }, { key: 'body', label: 'વિગત', type: 'textarea' }]}
          onSave={(x, d) => run(() => api(`/admin/news/${x._id}`, 'PUT', d), load)}
          onDelete={x => run(() => api(`/admin/news/${x._id}`, 'DELETE'), load)}
        />
      </div>
    </>
  );
}