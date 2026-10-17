// import useLoad from '../hooks/useLoad.js';
// import { api } from '../api.js';

// export default function Gallery() {
//   const [list] = useLoad(() => api('/media?type=photo'));
//   return (
//     <>
//       <h2>ફોટો ગેલેરી</h2>
//       <div className="gallery">
//         {list?.map(m => (
//           <figure key={m._id} className="card">
//             <a href={m.url} target="_blank" rel="noreferrer"><img src={m.url} alt={m.title} /></a>
//             <figcaption>{m.title}</figcaption>
//           </figure>
//         ))}
//       </div>
//       {list && !list.length && <div className="card">હજી કોઈ ફોટો નથી.</div>}
//     </>
//   );
// }
import useLoad from '../hooks/useLoad.js';
import usePagination from '../hooks/usePagination.js';
import Pagination from '../components/Pagination.jsx';
import { api } from '../api.js';

export default function Gallery() {
  const [list] = useLoad(() => api('/media?type=photo'));
  const pg = usePagination(list, 12);
  return (
    <>
      <h2>ફોટો ગેલેરી</h2>
      <div className="gallery">
        {pg.slice?.map(m => (
          <figure key={m._id} className="card">
            <a href={m.url} target="_blank" rel="noreferrer"><img src={m.url} alt={m.title} /></a>
            <figcaption>{m.title}</figcaption>
          </figure>
        ))}
      </div>
      {list && !list.length && <div className="card">હજી કોઈ ફોટો નથી.</div>}
      <Pagination pg={pg} />
    </>
  );
}