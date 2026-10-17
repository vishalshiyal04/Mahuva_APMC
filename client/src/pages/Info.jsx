import useLoad from '../hooks/useLoad.js';
import { api } from '../api.js';

export default function Info({ slug }) {
  const [p, , err] = useLoad(() => api('/pages/' + slug));
  return (
    <>
      <h2>{p?.title}</h2>
      <div className="card">
        <p className="prose">{p?.body}</p>
        {err && <p className="err">{err}</p>}
      </div>
    </>
  );
}