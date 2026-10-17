// import useLoad from '../hooks/useLoad.js';
// import { api } from '../api.js';

// const embed = u => {
//   const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
//   return m ? 'https://www.youtube.com/embed/' + m[1] : null;
// };

// export default function Videos() {
//   const [list] = useLoad(() => api('/media?type=video'));
//   return (
//     <>
//       <h2>વીડિયો ગેલેરી</h2>
//       <div className="gallery videos">
//         {list?.map(m => (
//           <div key={m._id} className="card">
//             {embed(m.url)
//               ? <div className="video"><iframe src={embed(m.url)} title={m.title} allowFullScreen /></div>
//               : <a href={m.url} target="_blank" rel="noreferrer">વીડિયો ખોલો</a>}
//             <p>{m.title}</p>
//           </div>
//         ))}
//       </div>
//       {list && !list.length && <div className="card">હજી કોઈ વીડિયો નથી.</div>}
//     </>
//   );
// }

import useLoad from '../hooks/useLoad.js';
import usePagination from '../hooks/usePagination.js';
import Pagination from '../components/Pagination.jsx';
import { api } from '../api.js';

const embed = u => {
  const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? 'https://www.youtube.com/embed/' + m[1] : null;
};

export default function Videos() {
  const [list] = useLoad(() => api('/media?type=video'));
  const pg = usePagination(list, 6);
  return (
    <>
      <h2>વીડિયો ગેલેરી</h2>
      <div className="gallery videos">
        {pg.slice?.map(m => (
          <div key={m._id} className="card">
            {embed(m.url)
              ? <div className="video"><iframe src={embed(m.url)} title={m.title} allowFullScreen /></div>
              : <a href={m.url} target="_blank" rel="noreferrer">વીડિયો ખોલો</a>}
            <p>{m.title}</p>
          </div>
        ))}
      </div>
      {list && !list.length && <div className="card">હજી કોઈ વીડિયો નથી.</div>}
      <Pagination pg={pg} />
    </>
  );
}