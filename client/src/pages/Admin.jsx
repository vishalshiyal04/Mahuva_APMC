
// import { NavLink, Route, Routes } from 'react-router-dom';
// import Dashboard from './admin/Dashboard.jsx';
// import Gate from './admin/Gate.jsx';
// import Crops from './admin/Crops.jsx';
// import Rates from './admin/Rates.jsx';
// import Users from './admin/Users.jsx';
// import Traders from './admin/Traders.jsx';
// import Agents from './admin/Agents.jsx';
// import News from './admin/News.jsx';
// import Pages from './admin/Pages.jsx';
// import Gallery from './admin/Gallery.jsx';
// import Ads from './admin/Ads.jsx';
// import Reports from './admin/Reports.jsx';
// import Maintenance from './admin/Maintenance.jsx';

// // [લિંક, આઇકન, નામ, પેજ]
// const MENU = [
//   ['', '📊', 'ડેશબોર્ડ', <Dashboard />],
//   ['gate', '🚪', 'ગેટ એન્ટ્રી', <Gate />],
//   ['crops', '🌾', 'માલ અને હરાજી', <Crops />],
//   ['rates', '📈', 'બજાર ભાવ', <Rates />],
//   ['users', '👥', 'યુઝર્સ', <Users />],
//   ['traders', '💼', 'વેપારી સબ્સ્ક્રિપ્શન', <Traders />],
//   ['agents', '🏪', 'કમિશન એજન્ટ', <Agents />],
//   ['news', '📢', 'સમાચાર', <News />],
//   ['pages', '📝', 'માહિતી પેજ', <Pages />],
//   ['gallery', '🖼', 'ગેલેરી', <Gallery />],
//   ['ads', '📣', 'જાહેરાતો', <Ads />],
//   ['reports', '🧾', 'રિપોર્ટ', <Reports />],
//   ['maintenance', '🚧', 'મેન્ટેનન્સ', <Maintenance />],
// ];

// export default function Admin() {
//   return (
//     <div className="admin">
//       <aside className="admin-side">
//         {MENU.map(([to, icon, label]) => (
//           <NavLink key={to} end={to === ''} to={'/admin' + (to && '/' + to)} className={({ isActive }) => (isActive ? 'on' : '')}>
//             <span>{icon}</span>{label}
//           </NavLink>
//         ))}
//       </aside>
//       <section className="admin-main">
//         <Routes>
//           {MENU.map(([to, , , page]) => (to === '' ? <Route key="i" index element={page} /> : <Route key={to} path={to} element={page} />))}
//         </Routes>
//       </section>
//     </div>
//   );
// }

import { NavLink, Route, Routes } from 'react-router-dom';

import Dashboard from './admin/Dashboard.jsx';
import Gate from './admin/Gate.jsx';
import Crops from './admin/Crops.jsx';
import Rates from './admin/Rates.jsx';
import Users from './admin/Users.jsx';
import Traders from './admin/Traders.jsx';
import Agents from './admin/Agents.jsx';
import News from './admin/News.jsx';
import Pages from './admin/Pages.jsx';
import Gallery from './admin/Gallery.jsx';
import Ads from './admin/Ads.jsx';
import Reports from './admin/Reports.jsx';
import Maintenance from './admin/Maintenance.jsx';
import Settlements from './admin/Settlements.jsx';
import AssistantSettings from './admin/AssistantSettings.jsx';

// [લિંક, આઇકન, નામ, પેજ]
const MENU = [
  ['', '📊', 'ડેશબોર્ડ', <Dashboard />],
  ['gate', '🚪', 'ગેટ એન્ટ્રી', <Gate />],
  ['crops', '🌾', 'માલ અને હરાજી', <Crops />],
  ['rates', '📈', 'બજાર ભાવ', <Rates />],
  ['users', '👥', 'યુઝર્સ', <Users />],
  ['traders', '💼', 'વેપારી સબ્સ્ક્રિપ્શન', <Traders />],
  ['agents', '🏪', 'કમિશન એજન્ટ', <Agents />],
  ['news', '📢', 'સમાચાર', <News />],
  ['pages', '📝', 'માહિતી પેજ', <Pages />],
  ['gallery', '🖼️', 'ગેલેરી', <Gallery />],
  ['ads', '📣', 'જાહેરાતો', <Ads />],
  ['reports', '🧾', 'રિપોર્ટ', <Reports />],
  ['maintenance', '🚧', 'મેન્ટેનન્સ', <Maintenance />],
  ['settlements', '💰', 'સોદા અને ચુકવણી', <Settlements />],
  [
  'assistant',
  '🌾',
  'ડિજિટલ સહાયક',
  <AssistantSettings />,
],
];

export default function Admin() {
  return (
    <div className="admin admin-shell">
      <aside
        className="admin-side admin-sidebar"
        aria-label="એડમિન મેનુ"
      >
        {MENU.map(([to, icon, label]) => (
          <NavLink
            key={to}
            end={to === ''}
            to={to ? `/admin/${to}` : '/admin'}
            className={({ isActive }) => (isActive ? 'on' : '')}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </aside>

      <section className="admin-main admin-content">
        <Routes>
          {MENU.map(([to, , , page]) =>
            to === '' ? (
              <Route key="dashboard" index element={page} />
            ) : (
              <Route key={to} path={to} element={page} />
            )
          )}
        </Routes>
      </section>
    </div>
  );
}