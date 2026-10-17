import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import { PAGES } from '../../constants.js';

// માહિતી પેજ (સુવિધાઓ, ચેરમેન, વિકાસ કામો વગેરે): લખાણ બદલી શકાય. પેજ પોતે ડિલીટ થતાં નથી.
export default function Pages() {
  const [slug, setSlug] = useState(PAGES[0].slug);
  const [pg, setPg] = useState({ title: '', body: '' });
  const [msg, run] = useAction();
  useEffect(() => {
    api('/pages/' + slug).then(setPg).catch(() => setPg({ title: PAGES.find(p => p.slug === slug).label, body: '' }));
  }, [slug]);
  return (
    <>
      <h2>📝 માહિતી પેજ</h2>
      <div className="card">
        <select value={slug} onChange={e => setSlug(e.target.value)}>{PAGES.map(p => <option key={p.slug} value={p.slug}>{p.label}</option>)}</select>
        <label className="field"><span>શીર્ષક</span>
          <input value={pg.title || ''} onChange={e => setPg({ ...pg, title: e.target.value })} />
        </label>
        <label className="field"><span>લખાણ</span>
          <textarea rows="10" value={pg.body || ''} onChange={e => setPg({ ...pg, body: e.target.value })} />
        </label>
        <button onClick={() => run(() => api('/admin/pages/' + slug, 'PUT', pg))}>💾 સેવ કરો</button>
        <Msg e={msg} ok />
      </div>
    </>
  );
}