import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from '../api.js';
import useNotifications from '../hooks/useNotifications.js';
import '../notify.css';

const ICON = { auction: '🔨', outbid: '⚠️', patti: '🧾', payment: '💰', subscription: '✅', alert: '🔔', gate: '🚪', info: '📢' };

const ago = d => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'હમણાં';
  if (m < 60) return `${m} મિનિટ પહેલાં`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} કલાક પહેલાં`;
  const days = Math.floor(h / 24);
  return days < 7 ? `${days} દિવસ પહેલાં` : new Date(d).toLocaleDateString('en-GB');
};

export default function NotificationBell() {
  const nav = useNavigate();
  const role = getAuth()?.user?.role;
  const { items, unread, toast, setToast, markRead, markAll, clear } = useNotifications();
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const canPush = typeof Notification !== 'undefined' && Notification.permission === 'default';
  const [perm, setPerm] = useState(canPush);

  useEffect(() => {
    if (!open) return;
    const away = e => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    const esc = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  const go = n => {
    markRead(n);
    setOpen(false);
    setToast(null);
    if (n.link) nav(n.link);
  };

  const enablePush = async () => {
    try { await Notification.requestPermission(); } catch { /* ignore */ }
    setPerm(false);
  };

  return (
    <div className="bell-wrap" ref={box}>
      <button className="bell" aria-label="સૂચનાઓ" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <span aria-hidden="true">🔔</span>
        {unread > 0 && <span className="bell-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="bell-panel" role="dialog" aria-label="સૂચનાઓ">
          <div className="bell-head">
            <b>🔔 સૂચનાઓ</b>
            {unread > 0 && <button className="linkish" onClick={markAll}>બધું વાંચેલું</button>}
          </div>

          <div className="bell-list">
            {items.length === 0 && <p className="bell-empty">હજી કોઈ સૂચના નથી</p>}
            {items.map(n => (
              <button key={n._id} className={'bell-item' + (n.read ? '' : ' new')} onClick={() => go(n)}>
                <span className="bell-ico">{ICON[n.type] || ICON.info}</span>
                <span className="bell-txt">
                  <b>{n.title}</b>
                  {n.body && <small>{n.body}</small>}
                  <em>{ago(n.createdAt)}</em>
                </span>
              </button>
            ))}
          </div>

          <div className="bell-foot">
            {role && role !== 'admin' && <Link to="/alerts" onClick={() => setOpen(false)}>💹 ભાવ એલર્ટ</Link>}
            {perm && <button className="linkish" onClick={enablePush}>બ્રાઉઝર સૂચના ચાલુ કરો</button>}
            {items.length > 0 && <button className="linkish" onClick={clear}>સાફ કરો</button>}
          </div>
        </div>
      )}

      {toast && !open && (
        <button className="bell-toast" onClick={() => go(toast)}>
          <b>{toast.title}</b>
          {toast.body && <small>{toast.body}</small>}
        </button>
      )}
    </div>
  );
}