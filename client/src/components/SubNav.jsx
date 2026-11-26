// import { NavLink } from 'react-router-dom';
// import { PAGES } from '../constants.js';

// const ITEMS = [
//   { to: '/', label: 'હોમ • દૈનિક ભાવ' },
//   { to: '/news', label: 'અગત્યના સમાચાર' },
//   { to: '/arrivals', label: 'દૈનિક આવક' },
//   { to: '/licensees', label: 'લાઈસન્સદારની યાદી' },
//   ...PAGES.slice(0, 3).map(p => ({ to: '/' + p.slug, label: p.label })),
//   { to: '/gallery', label: 'ફોટો ગેલેરી' },
//   { to: '/videos', label: 'વીડિયો ગેલેરી' },
//   ...PAGES.slice(3).map(p => ({ to: '/' + p.slug, label: p.label })),
// ];

// export default function SubNav() {
//   return (
//     <div className="subnav">
//       {ITEMS.map(i => (
//         <NavLink key={i.to} end={i.to === '/'} to={i.to} className={({ isActive }) => (isActive ? 'on' : '')}>{i.label}</NavLink>
//       ))}
//     </div>
//   );
// }

import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PAGES } from '../constants.js';
import '../header.css';

const ICON = {
  '/': '📈', '/news': '📰', '/arrivals': '🚛', '/licensees': '🪪', '/gallery': '📷', '/videos': '🎬',
  '/facilities': '🏬', '/chairman': '🧑‍💼', '/development': '🏗️', '/technology': '💻', '/committee': '👥', '/guidance': '🌱',
};

const ITEMS = [
  { to: '/', label: 'હોમ • દૈનિક ભાવ' },
  { to: '/news', label: 'અગત્યના સમાચાર' },
  { to: '/arrivals', label: 'દૈનિક આવક' },
  { to: '/licensees', label: 'લાઈસન્સદારની યાદી' },
  ...PAGES.slice(0, 3).map(p => ({ to: '/' + p.slug, label: p.label })),
  { to: '/gallery', label: 'ફોટો ગેલેરી' },
  { to: '/videos', label: 'વીડિયો ગેલેરી' },
  ...PAGES.slice(3).map(p => ({ to: '/' + p.slug, label: p.label })),
];

export default function SubNav() {
  const box = useRef(null);
  const { pathname } = useLocation();

  // મોબાઇલમાં પસંદ કરેલું પેજ હંમેશાં દેખાય એટલે પટ્ટી તે તરફ સરકે
  useEffect(() => {
    const b = box.current;
    const on = b?.querySelector('a.on');
    if (on) {
      const r = on.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const left = b.scrollLeft + (r.left - br.left) - (b.clientWidth - r.width) / 2;
      b.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }
  }, [pathname]);

  return (
    <nav className="subnav sh-sub" ref={box} aria-label="પેજ મેનુ">
      {ITEMS.map(i => (
        <NavLink key={i.to} end={i.to === '/'} to={i.to} className={({ isActive }) => (isActive ? 'on' : '')}>
          <span className="ic" aria-hidden="true">{ICON[i.to]}</span>{i.label}
        </NavLink>
      ))}
    </nav>
  );
}