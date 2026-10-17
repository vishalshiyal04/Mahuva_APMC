
import useLoad from '../hooks/useLoad.js';
import usePagination from '../hooks/usePagination.js';
import Pagination from '../components/Pagination.jsx';
import { api } from '../api.js';

export default function News() {
  const [list] = useLoad(() => api('/news'));
  const pg = usePagination(list, 6);
  return (
    <>
      <h2>અગત્યના સમાચાર</h2>
      {pg.slice?.map(n => (
        <div key={n._id} className="card">
          <h3>{n.title}</h3>
          <p className="prose">{n.body}</p>
          <small>{new Date(n.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
      {list && !list.length && <div className="card">હજી કોઈ સમાચાર નથી.</div>}
      <Pagination pg={pg} />
    </>
  );
}