
import { useState } from 'react';
import CropPicker from '../CropPicker.jsx';
import usePagination from '../../hooks/usePagination.js';
import Pagination from '../Pagination.jsx';

// કોઈ પણ યાદી માટે: બતાવો + ✏️ એડિટ + 🗑 ડિલીટ + પેજિનેશન
// columns: [{ label, render(item) }]   fields: [{ key, label, type, options }] અથવા fields(item)
// onSave(item, draft) / onDelete(item): સફળ થાય તો true જેવું પરિણામ આપવું   extra(item): વધારાના બટન
export default function CrudTable({ items, columns, fields = [], onSave, onDelete, extra, canEdit = () => true, canDelete = () => true, empty = 'હજી કોઈ ડેટા નથી.', pageSize = 10, resetKey }) {
  const pg = usePagination(items, pageSize, resetKey);
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState({});
  const fieldsOf = it => (typeof fields === 'function' ? fields(it) : fields);

  const start = it => { setEditId(it._id); setDraft(Object.fromEntries(fieldsOf(it).map(f => [f.key, it[f.key] ?? '']))); };
  const save = async it => { if (await onSave(it, draft)) setEditId(null); };
  const del = it => { if (confirm('આ કાયમ માટે કાઢી નાખવું છે?')) onDelete(it); };
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  if (!items) return <p>લોડ થઈ રહ્યું છે...</p>;
  if (!items.length) return <p>{empty}</p>;

  return (
    <>
    <table>
      <thead><tr>{columns.map(c => <th key={c.label}>{c.label}</th>)}<th /></tr></thead>
      <tbody>
        {pg.slice.map(it => editId === it._id ? (
          <tr key={it._id} className="editing">
            <td colSpan={columns.length + 1}>
              <div className="edit-grid">
                {fieldsOf(it).map(f => f.type === 'crop' ? (
                    <div key={f.key} className="field">
                      <CropPicker value={draft[f.key]} onChange={v => set(f.key, v)} label={f.label}
                        allowLegacy={draft[f.key] === it[f.key]} legacyValues={[it[f.key]]} />
                    </div>
                  ) : (
                  <label key={f.key} className="field"><span>{f.label}</span>
                    {f.type === 'textarea' ? <textarea rows="3" value={draft[f.key]} onChange={e => set(f.key, e.target.value)} />
                      : f.type === 'select' ? <select value={draft[f.key]} onChange={e => set(f.key, e.target.value)}>{f.options.map(o => <option key={o}>{o}</option>)}</select>
                      : f.type === 'check' ? <input type="checkbox" checked={!!draft[f.key]} onChange={e => set(f.key, e.target.checked)} />
                      : <input type={f.type || 'text'} value={draft[f.key]} onChange={e => set(f.key, e.target.value)} />}
                  </label>
                ))}
              </div>
              <button onClick={() => save(it)}>💾 સેવ</button>
              <button className="ghost-btn" onClick={() => setEditId(null)}>✖ રદ</button>
            </td>
          </tr>
        ) : (
          <tr key={it._id}>
            {columns.map(c => <td key={c.label}>{c.render(it)}</td>)}
            <td className="row-actions">
              {extra?.(it)}
              {canEdit(it) && fieldsOf(it).length > 0 && <button onClick={() => start(it)}>✏️ એડિટ</button>}
              {canDelete(it) && <button className="alt" onClick={() => del(it)}>🗑 ડિલીટ</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Pagination pg={pg} />
    </>
  );
}