import { useState } from 'react';
import { api, tok } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import CrudTable from '../../components/admin/CrudTable.jsx';

export default function Gallery() {
  const [list, load] = useLoad(() => api('/media'));
  const [msg, run] = useAction();
  const [m, setM] = useState({ type: 'photo', title: '', url: '' });
  const [file, setFile] = useState(null);

  const add = () => run(async () => {
    const fd = new FormData();
    Object.entries(m).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('photo', file);
    const r = await fetch('/api/admin/media', { method: 'POST', headers: { Authorization: 'Bearer ' + tok() }, body: fd });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'ભૂલ');
    return d;
  }, load);

  return (
    <>
      <h2>🖼 ફોટો / વીડિયો ગેલેરી</h2>
      <div className="card">
        <h3>નવું ઉમેરો</h3>
        <select value={m.type} onChange={e => setM({ ...m, type: e.target.value })}>
          <option value="photo">ફોટો</option><option value="video">વીડિયો (YouTube)</option>
        </select>
        <input placeholder="શીર્ષક" value={m.title} onChange={e => setM({ ...m, title: e.target.value })} />
        {m.type === 'photo'
          ? <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files[0])} />
          : <input placeholder="YouTube લિંક" value={m.url} onChange={e => setM({ ...m, url: e.target.value })} />}
        <button onClick={add}>ઉમેરો</button>
        <Msg e={msg} ok />
      </div>
      <div className="card">
        <CrudTable
          items={list}
          columns={[
            { label: 'પ્રિવ્યૂ', render: x => (x.type === 'photo' ? <img src={x.url} width="64" alt="" /> : <a href={x.url} target="_blank" rel="noreferrer">🎬 વીડિયો</a>) },
            { label: 'શીર્ષક', render: x => x.title },
            { label: 'પ્રકાર', render: x => (x.type === 'photo' ? 'ફોટો' : 'વીડિયો') },
          ]}
          fields={x => (x.type === 'video'
            ? [{ key: 'title', label: 'શીર્ષક' }, { key: 'url', label: 'YouTube લિંક' }]
            : [{ key: 'title', label: 'શીર્ષક' }])}
          onSave={(x, d) => run(() => api(`/admin/media/${x._id}`, 'PUT', d), load)}
          onDelete={x => run(() => api(`/admin/media/${x._id}`, 'DELETE'), load)}
        />
      </div>
    </>
  );
}