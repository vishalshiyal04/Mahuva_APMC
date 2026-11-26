// // import { useEffect, useState } from 'react';
// // import { Link, NavLink, useNavigate } from 'react-router-dom';
// // import { getAuth } from '../api.js';
// // import LangSwitch from './LangSwitch.jsx';
// // import NotificationBell from './NotificationBell.jsx';

// // const linkClass = ({ isActive }) => 'btn ghost' + (isActive ? ' on' : '');

// // export default function Navbar() {
// //   const nav = useNavigate();
// //   const [, rerender] = useState(0);
// //   const [open, setOpen] = useState(false);
// //   const me = getAuth()?.user;

// //   // પ્રોફાઇલમાં નામ બદલાય તો મેનુ તરત અપડેટ થાય
// //   useEffect(() => {
// //     const refresh = () => rerender(n => n + 1);
// //     window.addEventListener('auth-change', refresh);
// //     return () => window.removeEventListener('auth-change', refresh);
// //   }, []);

// //   const logout = e => {
// //     e.preventDefault();
// //     sessionStorage.removeItem('auth');
// //     rerender(n => n + 1);
// //     nav('/');
// //   };

// //   return (
// //     <header className="topbar">
// //       <Link to="/" className="brand">
// //         <span className="logo">🌾</span>
// //         <span className="titles">
// //           <strong>મહુવા APMC ડિજિટલ બજાર</strong>
// //           <small>કૃષિ ઉત્પન્ન બજાર સમિતિ • મહુવા</small>
// //         </span>
// //       </Link>

// //       {me && <NotificationBell key={me.id} />}

// //       <button className="burger" aria-label="મેનુ" aria-expanded={open} onClick={() => setOpen(o => !o)}>
// //         <span /><span /><span />
// //       </button>

// //       <div className={'actions' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
// //         <LangSwitch />
// //         <NavLink end to="/" className={linkClass}>📈 ભાવ</NavLink>
// //         {me && <NavLink to={'/' + me.role} className={linkClass}>🗂 ડેશબોર્ડ</NavLink>}
// //         {me && me.role !== 'admin' && <NavLink to="/alerts" className={linkClass}>💹 ભાવ એલર્ટ</NavLink>}
// //         {me ? (
// //           <>
// //             <NavLink to="/profile" className={linkClass}>👤 {me.name}</NavLink>
// //             <a className="btn danger" href="/" onClick={logout}>લોગઆઉટ</a>
// //           </>
// //         ) : (
// //           <>
// //             <Link className="btn green" to="/register">સાઇન અપ</Link>
// //             <NavLink to="/login" className={({ isActive }) => 'btn' + (isActive ? ' on' : '')}>લોગિન</NavLink>
// //           </>
// //         )}
// //       </div>
// //     </header>
// //   );
// // }

// import { useEffect, useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { getAuth } from '../api.js';
// import LangSwitch from './LangSwitch.jsx';
// import NotificationBell from './NotificationBell.jsx';
// import ConfirmDialog from './ConfirmDialog.jsx';

// const linkClass = ({ isActive }) => 'btn ghost' + (isActive ? ' on' : '');

// export default function Navbar() {
//   const nav = useNavigate();
//   const [, rerender] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [askLogout, setAskLogout] = useState(false);
//   const me = getAuth()?.user;

//   // પ્રોફાઇલમાં નામ બદલાય તો મેનુ તરત અપડેટ થાય
//   useEffect(() => {
//     const refresh = () => rerender(n => n + 1);
//     window.addEventListener('auth-change', refresh);
//     return () => window.removeEventListener('auth-change', refresh);
//   }, []);

//   // લોગઆઉટ બટન દબાય તો પહેલાં ખાતરી પૂછો
//   const askToLogout = e => {
//     e.preventDefault();
//     setAskLogout(true);
//   };

//   const logout = () => {
//     setAskLogout(false);
//     sessionStorage.removeItem('auth');
//     rerender(n => n + 1);
//     nav('/');
//   };

//   return (
//     <>
//     <header className="topbar">
//       <Link to="/" className="brand">
//         <span className="logo">🌾</span>
//         <span className="titles">
//           <strong>મહુવા APMC ડિજિટલ બજાર</strong>
//           <small>કૃષિ ઉત્પન્ન બજાર સમિતિ • મહુવા</small>
//         </span>
//       </Link>

//       {me && <NotificationBell key={me.id} />}

//       <button className="burger" aria-label="મેનુ" aria-expanded={open} onClick={() => setOpen(o => !o)}>
//         <span /><span /><span />
//       </button>

//       <div className={'actions' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
//         <LangSwitch />
//         <NavLink end to="/" className={linkClass}>📈 ભાવ</NavLink>
//         {me && <NavLink to={'/' + me.role} className={linkClass}>🗂 ડેશબોર્ડ</NavLink>}
//         {me && me.role !== 'admin' && <NavLink to="/alerts" className={linkClass}>💹 ભાવ એલર્ટ</NavLink>}
//         {me ? (
//           <>
//             <NavLink to="/profile" className={linkClass}>👤 {me.name}</NavLink>
//             <a className="btn danger" href="/" onClick={askToLogout}>લોગઆઉટ</a>
//           </>
//         ) : (
//           <>
//             <Link className="btn green" to="/register">સાઇન અપ</Link>
//             <NavLink to="/login" className={({ isActive }) => 'btn' + (isActive ? ' on' : '')}>લોગિન</NavLink>
//           </>
//         )}
//       </div>
//     </header>

//     <ConfirmDialog
//       open={askLogout}
//       icon="🚪"
//       title="લોગઆઉટ કરવું છે?"
//       message="લોગઆઉટ કર્યા પછી ફરી લોગિન કરવું પડશે."
//       confirmText="હા, લોગઆઉટ"
//       cancelText="રદ કરો"
//       danger
//       onConfirm={logout}
//       onCancel={() => setAskLogout(false)}
//     />
//     </>
//   );
// }

import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getAuth } from '../api.js';
import LangSwitch from './LangSwitch.jsx';
import NotificationBell from './NotificationBell.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import YardStrip from './YardStrip.jsx';
import '../header.css';

const link = ({ isActive }) => 'sh-link' + (isActive ? ' on' : '');
const ROLE = { farmer: 'ખેડૂત', trader: 'વેપારી', admin: 'એડમિન', agent: 'એજન્ટ' };

// નામનો પહેલો અક્ષર (ગુજરાતી જોડાક્ષર/માત્રા તૂટે નહીં એટલે grapheme મુજબ)
const initial = name => {
  const s = (name || '?').trim();
  try { return [...new Intl.Segmenter().segment(s)][0].segment.toUpperCase(); }
  catch { return Array.from(s)[0].toUpperCase(); }
};

export default function Navbar() {
  const nav = useNavigate();
  const [, rerender] = useState(0);
  const [open, setOpen] = useState(false);
  const [askLogout, setAskLogout] = useState(false);
  const me = getAuth()?.user;

  // પ્રોફાઇલમાં નામ બદલાય તો મેનુ તરત અપડેટ થાય
  useEffect(() => {
    const refresh = () => rerender(n => n + 1);
    window.addEventListener('auth-change', refresh);
    return () => window.removeEventListener('auth-change', refresh);
  }, []);

  // લોગઆઉટ બટન દબાય તો પહેલાં ખાતરી પૂછો
  const askToLogout = e => {
    e.preventDefault();
    setAskLogout(true);
  };

  const logout = () => {
    setAskLogout(false);
    sessionStorage.removeItem('auth');
    rerender(n => n + 1);
    nav('/');
  };

  return (
    <>
      <YardStrip />

      <header className="sh-main">
        <Link to="/" className="sh-brand" aria-label="મહુવા APMC ડિજિટલ બજાર">
          <img className="sh-logo" src="/logo.png" alt="" width="46" height="46" />
          <span className="sh-titles">
            <strong>મહુવા APMC ડિજિટલ બજાર</strong>
            <small>કૃષિ ઉત્પન્ન બજાર સમિતિ • મહુવા</small>
          </span>
        </Link>

        {me && <div className="sh-bell"><NotificationBell key={me.id} /></div>}

        <button
          className="sh-burger"
          aria-label="મેનુ"
          aria-expanded={open}
          aria-controls="sh-nav"
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>

        <nav id="sh-nav" className={'sh-nav' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
          <LangSwitch />
          <NavLink end to="/" className={link}>📈 ભાવ</NavLink>
          {me && <NavLink to={'/' + me.role} className={link}>🗂 ડેશબોર્ડ</NavLink>}
          {me && me.role !== 'admin' && <NavLink to="/alerts" className={link}>💹 ભાવ એલર્ટ</NavLink>}
          {me ? (
            <>
              <NavLink to="/profile" className={({ isActive }) => 'sh-user' + (isActive ? ' on' : '')} title={ROLE[me.role]}>
                <span className="av" aria-hidden="true">{initial(me.name)}</span>
                <span className="nm">{me.name}</span>
              </NavLink>
              <a className="sh-logout" href="/" onClick={askToLogout}>🚪 લોગઆઉટ</a>
            </>
          ) : (
            <>
              <NavLink to="/login" className="sh-ghost">લોગિન</NavLink>
              <Link className="sh-cta" to="/register">સાઇન અપ</Link>
            </>
          )}
        </nav>
      </header>

      <ConfirmDialog
        open={askLogout}
        icon="🚪"
        title="લોગઆઉટ કરવું છે?"
        message="લોગઆઉટ કર્યા પછી ફરી લોગિન કરવું પડશે."
        confirmText="હા, લોગઆઉટ"
        cancelText="રદ કરો"
        danger
        onConfirm={logout}
        onCancel={() => setAskLogout(false)}
      />
    </>
  );
}