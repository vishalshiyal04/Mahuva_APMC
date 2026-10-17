import { NavLink } from 'react-router-dom';
import { PAGES } from '../constants.js';

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
  return (
    <div className="subnav">
      {ITEMS.map(i => (
        <NavLink key={i.to} end={i.to === '/'} to={i.to} className={({ isActive }) => (isActive ? 'on' : '')}>{i.label}</NavLink>
      ))}
    </div>
  );
}