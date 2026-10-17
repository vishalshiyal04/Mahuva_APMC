import { useRef } from 'react';
import { pageList } from '../utils/pagination.js';

// ચાલુ પાનું, પાના નંબર, આગળ/પાછળ અને "પ્રતિ પાનું" પસંદગી. pg = usePagination() નું પરિણામ.
export default function Pagination({ pg }) {
  const ref = useRef();
  const { page, pages, total, size, sizes } = pg;
  if (total <= sizes[0]) return null;   // એક જ પાનું હોય તો કંઈ ન બતાવવું

  const go = n => {
    pg.setPage(Math.min(pages, Math.max(1, n)));
    requestAnimationFrame(() => {
      const card = ref.current?.closest('.card');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };
  const from = (page - 1) * size + 1;
  const to = Math.min(total, page * size);

  return (
    <div className="pager" ref={ref}>
      <span className="pager-info">{from}–{to} / કુલ {total}</span>
      <div className="pager-btns">
        <button disabled={page === 1} onClick={() => go(page - 1)}>‹ પાછળ</button>
        {pageList(page, pages).map((n, i) => (n === '…'
          ? <span key={'g' + i} className="gap">…</span>
          : <button key={n} className={n === page ? 'on' : ''} onClick={() => go(n)}>{n}</button>))}
        <button disabled={page === pages} onClick={() => go(page + 1)}>આગળ ›</button>
      </div>
      <select value={size} onChange={e => pg.setSize(Number(e.target.value))}>
        {sizes.map(s => <option key={s} value={s}>{s} / પાનું</option>)}
      </select>
    </div>
  );
}