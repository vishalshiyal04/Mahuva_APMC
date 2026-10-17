import { Link } from 'react-router-dom';
import useLoad from '../hooks/useLoad.js';
import { api } from '../api.js';

export default function NewsPreview() {
  const [list] = useLoad(() => api('/news'));
  if (!list?.length) return null;
  return (
    <div className="card ad">
      <h3>📢 અગત્યના સમાચાર</h3>
      {list.slice(0, 3).map(n => (
        <p key={n._id}><b>{n.title}</b> <small>{new Date(n.createdAt).toLocaleDateString()}</small></p>
      ))}
      <Link to="/news">બધા સમાચાર જુઓ →</Link>
    </div>
  );
}