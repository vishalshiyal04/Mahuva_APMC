import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getAuth } from '../api.js';

const linkClass = ({ isActive }) => 'btn ghost' + (isActive ? ' on' : '');

export default function Navbar() {
  const nav = useNavigate();
  const [, rerender] = useState(0);
  const [open, setOpen] = useState(false);
  const me = getAuth()?.user;

  // પ્રોફાઇલમાં નામ બદલાય તો મેનુ તરત અપડેટ થાય
  useEffect(() => {
    const refresh = () => rerender(n => n + 1);
    window.addEventListener('auth-change', refresh);
    return () => window.removeEventListener('auth-change', refresh);
  }, []);

  const logout = e => {
    e.preventDefault();
    sessionStorage.removeItem('auth');
    rerender(n => n + 1);
    nav('/');
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="logo">🌾</span>
        <span className="titles">
          <strong>મહુવા APMC ડિજિટલ બજાર</strong>
          <small>કૃષિ ઉત્પન્ન બજાર સમિતિ • મહુવા</small>
        </span>
      </Link>

      <button className="burger" aria-label="મેનુ" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span /><span /><span />
      </button>

      <div className={'actions' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
        <NavLink end to="/" className={linkClass}>📈 ભાવ</NavLink>
        {me && <NavLink to={'/' + me.role} className={linkClass}>🗂 ડેશબોર્ડ</NavLink>}
        {me ? (
          <>
            <NavLink to="/profile" className={linkClass}>👤 {me.name}</NavLink>
            <a className="btn danger" href="/" onClick={logout}>લોગઆઉટ</a>
          </>
        ) : (
          <>
            <Link className="btn green" to="/register">સાઇન અપ</Link>
            <NavLink to="/login" className={({ isActive }) => 'btn' + (isActive ? ' on' : '')}>લોગિન</NavLink>
          </>
        )}
      </div>
    </header>
  );
}