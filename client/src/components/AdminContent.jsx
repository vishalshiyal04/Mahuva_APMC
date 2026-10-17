import { useEffect, useState } from 'react';
import { api, tok } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import Msg from './Msg.jsx';
import { PAGES } from '../constants.js';

export default function AdminContent() {
  const [news, loadN] = useLoad(() => api('/news'));
  const [media, loadM] = useLoad(() => api('/media'));
  const [n, setN] = useState({});
  const [slug, setSlug] = useState(PAGES[0].slug);
  const [pg, setPg] = useState({ title: '', body: '' });
  const [m, setM] = useState({ type: 'photo' });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api('/pages/' + slug).then(setPg).catch(() => setPg({ title: PAGES.find(p => p.slug === slug).label, body: '' }));
  }, [slug]);

  const run = async (fn, ...after) => {
    try { setMsg((await fn()).msg); } catch (x) { setMsg('⚠ ' + x.message); }
    after.forEach(f => f());
  };

  const addMedia = () => run(async () => {
    const fd = new FormData();
    Object.entries(m).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('photo', file);
    const r = await fetch('/api/admin/media', { method: 'POST', headers: { Authorization: 'Bearer ' + tok() }, body: fd });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'ભૂલ');
    return d;
  }, loadM);

  return (
    <>
      <Msg e={msg} ok />
      <div className="card">
        <h3>📢 સમાચાર</h3>
        <input placeholder="શીર્ષક" onChange={e => setN({ ...n, title: e.target.value })} />
        <input placeholder="વિગત" onChange={e => setN({ ...n, body: e.target.value })} />
        <button onClick={() => run(() => api('/admin/news', 'POST', n), loadN)}>ઉમેરો</button>
        {news?.map(x => (
          <p key={x._id}>{x.title} <button className="alt" onClick={() => run(() => api('/admin/news/' + x._id, 'DELETE'), loadN)}>કાઢો</button></p>
        ))}
      </div>

      <div className="card">
        <h3>📝 માહિતી પેજ એડિટ કરો</h3>
        <select value={slug} onChange={e => setSlug(e.target.value)}>
          {PAGES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}
        </select>
        <textarea rows="6" style={{ width: '100%' }} value={pg.body || ''} onChange={e => setPg({ ...pg, body: e.target.value })} />
        <button onClick={() => run(() => api('/admin/pages/' + slug, 'PUT', pg))}>સેવ કરો</button>
      </div>

      <div className="card">
        <h3>🖼 ફોટો / વીડિયો ગેલેરી</h3>
        <select onChange={e => setM({ ...m, type: e.target.value })}>
          <option value="photo">ફોટો</option>
          <option value="video">વીડિયો (YouTube)</option>
        </select>
        <input placeholder="શીર્ષક" onChange={e => setM({ ...m, title: e.target.value })} />
        {m.type === 'photo'
          ? <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files[0])} />
          : <input placeholder="YouTube લિંક" onChange={e => setM({ ...m, url: e.target.value })} />}
        <button onClick={addMedia}>ઉમેરો</button>
        {media?.map(x => (
          <p key={x._id}>{x.type === 'photo' ? '🖼' : '🎬'} {x.title} <button className="alt" onClick={() => run(() => api('/admin/media/' + x._id, 'DELETE'), loadM)}>કાઢો</button></p>
        ))}
      </div>
    </>
  );
}