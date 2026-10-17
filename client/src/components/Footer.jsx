import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, getAuth } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import { PAGES, CONTACT } from '../constants.js';

const QUICK = [
  { to: '/', label: 'હોમ • દૈનિક ભાવ' },
  { to: '/news', label: 'અગત્યના સમાચાર' },
  { to: '/arrivals', label: 'દૈનિક આવક' },
  { to: '/licensees', label: 'લાઈસન્સદારની યાદી' },
  { to: '/gallery', label: 'ફોટો ગેલેરી' },
  { to: '/videos', label: 'વીડિયો ગેલેરી' },
];

const SOCIAL = [
  { key: 'whatsapp', icon: '💬', label: 'WhatsApp' },
  { key: 'facebook', icon: '📘', label: 'Facebook' },
  { key: 'youtube', icon: '▶️', label: 'YouTube' },
];

export default function Footer() {
  useLocation();                                   // લોગિન/પેજ બદલાય ત્યારે ફૂટર અપડેટ થાય
  const me = getAuth()?.user;
  const [rates] = useLoad(() => api('/rates'));
  const [showTop, setShowTop] = useState(false);
  const top = rates?.slice(0, 5) || [];
  const socials = SOCIAL.filter(s => CONTACT[s.key]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {!me && (
        <section className="cta-band">
          <div>
            <h3>ખેડૂત કે વેપારી છો? 🌾</h3>
            <p>મફત રજીસ્ટર કરો અને લાઈવ ભાવ, પારદર્શક હરાજી તથા ડિજિટલ પટ્ટીનો લાભ લો.</p>
          </div>
          <div className="cta-actions">
            <Link className="btn-yellow dark" to="/register">મફત શરૂ કરો →</Link>
            <Link className="cta-link" to="/login">લોગિન</Link>
          </div>
        </section>
      )}

      <footer className={'footer' + (!me ? ' with-cta' : '')}>
        <span className="footer-glow g1" /><span className="footer-glow g2" />

        <div className="footer-grid">
          <div className="f-col f-brand">
            <div className="f-logo-row">
              <span className="f-logo">🌾</span>
              <div><strong>મહુવા APMC ડિજિટલ બજાર</strong><small>કૃષિ ઉત્પન્ન બજાર સમિતિ • મહુવા</small></div>
            </div>
            <p>ખેડૂત અને વેપારીને જોડતું પારદર્શક ડિજિટલ બજાર. QR ગેટ પાસ, લાઈવ ઓનલાઈન હરાજી અને ઓટોમેટિક ડિજિટલ પટ્ટી, બધું એક જ જગ્યાએ.</p>
            <div className="f-badges">
              <span>🔒 સુરક્ષિત લોગિન</span><span>⚡ લાઈવ બોલી</span><span>🧾 ડિજિટલ પટ્ટી</span><span>📲 QR ગેટ પાસ</span>
            </div>
            {socials.length > 0 && (
              <div className="f-social">
                {socials.map(s => <a key={s.key} href={CONTACT[s.key]} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}>{s.icon}</a>)}
              </div>
            )}
          </div>

          <div className="f-col">
            <h4>ઝડપી લિંક</h4>
            {QUICK.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}
          </div>

          <div className="f-col">
            <h4>સમિતિ વિશે</h4>
            {PAGES.map(p => <Link key={p.slug} to={'/' + p.slug}>{p.label}</Link>)}
          </div>

          <div className="f-col">
            <h4>ખેડૂત • વેપારી</h4>
            {me ? (
              <>
                <Link to={'/' + me.role}>🗂 મારું ડેશબોર્ડ</Link>
                <Link to="/profile">👤 મારી પ્રોફાઇલ</Link>
              </>
            ) : (
              <>
                <Link to="/register">🌾 ખેડૂત રજીસ્ટ્રેશન</Link>
                <Link to="/register">💼 વેપારી રજીસ્ટ્રેશન</Link>
                <Link to="/login">🔑 લોગિન</Link>
              </>
            )}
            <Link to="/guidance">📖 ખેડૂત માર્ગદર્શન</Link>
          </div>

          <div className="f-col f-contact">
            <h4>સંપર્ક</h4>
            <p><span>📍</span>{CONTACT.address}</p>
            <p><span>📞</span><a href={'tel:' + CONTACT.phone.replace(/\s/g, '')}>{CONTACT.phone}</a></p>
            <p><span>✉️</span><a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a></p>
            <p><span>🕗</span>{CONTACT.hours}</p>
          </div>
        </div>

        {top.length > 0 && (
          <div className="f-rates">
            <b>📈 આજના ભાવ</b>
            {top.map(r => <span key={r._id} className="f-chip">{r.crop} <em>₹{r.min}–₹{r.max}</em></span>)}
            <Link to="/">બધા ભાવ →</Link>
          </div>
        )}

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ. સર્વ હક્ક સુરક્ષિત.</span>
          {/* <span>ખેડૂતોના હિત માટે ❤️ સાથે બનાવ્યું</span> */}
          <span>ખેડૂતોના હિત માટે ❤️ Developed By Vishal B Shiyal</span>
          <button className="top-link" onClick={toTop}>ઉપર જાઓ ↑</button>
        </div>
      </footer>

      <button className={'to-top' + (showTop ? ' show' : '')} onClick={toTop} aria-label="ઉપર જાઓ">↑</button>
    </>
  );
}