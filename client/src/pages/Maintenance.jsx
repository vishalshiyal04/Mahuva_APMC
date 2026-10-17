// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { CONTACT } from '../constants.js';

// const DEFAULT_MSG = 'અમે સાઇટમાં સુધારા-વધારા કરી રહ્યા છીએ. થોડી વાર પછી ફરી પ્રયાસ કરો.';

// function Gear({ className }) {
//   return (
//     <svg viewBox="0 0 100 100" className={'gear ' + className} aria-hidden="true">
//       {[...Array(8)].map((_, i) => <rect key={i} x="43" y="2" width="14" height="20" rx="3" transform={`rotate(${i * 45} 50 50)`} />)}
//       <circle cx="50" cy="50" r="35" />
//       <circle cx="50" cy="50" r="14" className="hole" />
//     </svg>
//   );
// }

// function Countdown({ until }) {
//   const [now, setNow] = useState(Date.now());
//   useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
//   const left = Math.max(0, new Date(until) - now);
//   if (!left) return <p className="mt-soon">⏳ કામ લગભગ પૂરું થવામાં છે, ટૂંક સમયમાં સાઇટ ખુલશે…</p>;
//   const parts = [
//     ['દિવસ', Math.floor(left / 864e5)],
//     ['કલાક', Math.floor(left / 36e5) % 24],
//     ['મિનિટ', Math.floor(left / 6e4) % 60],
//     ['સેકન્ડ', Math.floor(left / 1e3) % 60],
//   ];
//   return (
//     <div className="mt-count">
//       {parts.map(([k, v]) => <div key={k}><b>{String(v).padStart(2, '0')}</b><span>{k}</span></div>)}
//     </div>
//   );
// }

// // m = { message, until, down, retry }
// export default function Maintenance({ m }) {
//   const down = m.down;
//   return (
//     <div className="mt">
//       <span className="mt-orb o1" /><span className="mt-orb o2" /><span className="mt-orb o3" />

//       <div className="mt-card">
//         <div className="mt-gears"><Gear className="g-big" /><Gear className="g-small" /><span className="mt-wrench">🔧</span></div>

//         <span className="mt-tag">{down ? '⚠️ તકનીકી સમસ્યા' : '🚧 મેન્ટેનન્સ ચાલુ છે'}</span>
//         <h1>{down ? 'સર્વર સાથે જોડાઈ શકાતું નથી' : 'સાઇટ હાલ સુધારા હેઠળ છે'}</h1>
//         <p className="mt-msg">{down ? 'થોડી વાર પછી ફરી પ્રયાસ કરો. સમસ્યા ઉકેલવાનું કામ ચાલુ છે.' : (m.message || DEFAULT_MSG)}</p>

//         {!down && m.until && <Countdown until={m.until} />}

//         <div className="mt-bar"><i /></div>
//         <p className="mt-auto"><span className="mt-dot" />આ પેજ આપોઆપ તપાસ કરે છે. કામ પૂરું થતાં સાઇટ જાતે ખુલી જશે.</p>

//         <div className="mt-info">
//           <div><span>🌾</span><b>ખેડૂત</b><small>તમારું ખાતું અને માહિતી યથાવત રહેશે</small></div>
//           <div><span>💼</span><b>વેપારી</b><small>કામ પૂરું થતાં તમે ફરી લોગિન કરી શકશો</small></div>
//           <div><span>🏪</span><b>એજન્ટ</b><small>થોડી વારમાં બધી સેવા ફરી ચાલુ થશે</small></div>
//         </div>

//         <div className="mt-actions">
//           <button onClick={m.retry}>🔄 ફરી તપાસો</button>
//           <a href={'tel:' + CONTACT.phone.replace(/\s/g, '')}>📞 સંપર્ક કરો</a>
//         </div>
//         {!down && <Link className="mt-admin" to="/login">🔐 એડમિન લોગિન</Link>}
//       </div>

//       <p className="mt-foot">© {new Date().getFullYear()} મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</p>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT } from '../constants.js';

const DEFAULT_MSG = 'અમે સાઇટમાં સુધારા-વધારા કરી રહ્યા છીએ. થોડી વાર પછી ફરી પ્રયાસ કરો.';

// "WEB SITE UNDER CONSTRUCTION" ચિત્ર (SVG)
function Art() {
  const line = { stroke: '#2b2b33', strokeWidth: 3, strokeLinejoin: 'round' };
  const font = { fontFamily: "'Fredoka','Baloo 2',system-ui,sans-serif", fontWeight: 700 };
  return (
    <svg className="uc-art" viewBox="0 0 600 320" role="img" aria-label="વેબસાઇટ સુધારા હેઠળ">
      <defs>
        <pattern id="uc-stripe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="16" fill="#f08a3c" /><rect x="8" width="8" height="16" fill="#f4f4f7" />
        </pattern>
      </defs>

      <g fill="#5d5d66">
        <rect className="uc-c1" x="28" y="88" width="170" height="24" rx="12" />
        <rect className="uc-c2" x="402" y="64" width="170" height="22" rx="11" />
        <rect className="uc-c3" x="50" y="162" width="130" height="22" rx="11" />
        <rect className="uc-c4" x="420" y="196" width="150" height="24" rx="12" />
        <rect className="uc-c2" x="118" y="276" width="120" height="20" rx="10" />
      </g>
      <g stroke="#2b2b33" strokeWidth="2.5" strokeLinecap="round" opacity=".8">
        <path d="M112 78h24M120 92h16M436 112h22M444 126h14M120 220h22M128 232h14" />
      </g>

      <g className="uc-letters" style={font} fontSize="124">
        <text x="168" y="150" textLength="268" lengthAdjust="spacingAndGlyphs" fill="#34343c">WEB</text>
        <text x="165" y="146" textLength="268" lengthAdjust="spacingAndGlyphs" fill="#ececf1">WEB</text>
        <text x="153" y="268" textLength="298" lengthAdjust="spacingAndGlyphs" fill="#34343c">SITE</text>
        <text x="150" y="264" textLength="298" lengthAdjust="spacingAndGlyphs" fill="#ececf1">SITE</text>
      </g>

      <g transform="translate(346 62)">
        <g className="uc-hat">
          <path d="M-28 0 C-28 -28 28 -28 28 0 Z" fill="#f4a62a" {...line} />
          <rect x="-5" y="-25" width="10" height="23" rx="3" fill="#ffd36a" stroke="#2b2b33" strokeWidth="2.5" />
          <rect x="-35" y="-2" width="70" height="10" rx="5" fill="#f4a62a" {...line} />
        </g>
      </g>

      {[[84, 224, 1], [122, 238, 0.88]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M14 0 L30 0 L42 52 L2 52 Z" fill="#f08a3c" {...line} />
          <path d="M10.3 16 L33.7 16 L35.5 24 L8.5 24 Z" fill="#f4f4f7" />
          <path d="M6.2 34 L37.8 34 L39.7 42 L4.3 42 Z" fill="#f4f4f7" />
          <rect x="-4" y="52" width="52" height="9" rx="3" fill="#3b3b44" {...line} />
        </g>
      ))}

      <g transform="translate(236 238)">
        <rect x="8" y="14" width="7" height="30" fill="#c9c9d2" {...line} />
        <rect x="80" y="14" width="7" height="30" fill="#c9c9d2" {...line} />
        <rect x="0" y="0" width="95" height="19" rx="3" fill="url(#uc-stripe)" {...line} />
      </g>

      <g transform="translate(512 150)">
        <ellipse cx="0" cy="136" rx="26" ry="6" fill="#2b2b33" opacity=".35" />
        <g className="uc-sign">
          <rect x="-3.5" y="30" width="7" height="106" fill="#c9c9d2" {...line} />
          <rect x="-26" y="-26" width="52" height="52" rx="9" transform="rotate(45)" fill="#f08a3c" {...line} />
          <rect x="-4" y="-15" width="8" height="19" rx="3.5" fill="#2b2b33" />
          <circle cx="0" cy="12" r="4.5" fill="#2b2b33" />
        </g>
      </g>
    </svg>
  );
}

function Countdown({ until }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const left = Math.max(0, new Date(until) - now);
  if (!left) return <p className="uc-soon">⏳ કામ લગભગ પૂરું થવામાં છે, ટૂંક સમયમાં સાઇટ ખુલશે…</p>;
  const parts = [
    ['દિવસ', Math.floor(left / 864e5)],
    ['કલાક', Math.floor(left / 36e5) % 24],
    ['મિનિટ', Math.floor(left / 6e4) % 60],
    ['સેકન્ડ', Math.floor(left / 1e3) % 60],
  ];
  return (
    <div className="uc-count">
      {parts.map(([k, v]) => <div key={k}><b>{String(v).padStart(2, '0')}</b><span>{k}</span></div>)}
    </div>
  );
}

// m = { message, until, down, retry }, preview = એડમિન પ્રિવ્યૂ
export default function Maintenance({ m, preview }) {
  const down = m.down;
  return (
    <div className="uc">
      {preview && (
        <div className="uc-preview">👁 આ એડમિન પ્રિવ્યૂ છે, યુઝરને આવું પેજ દેખાય છે. <Link to="/admin">← એડમિન પેનલ</Link></div>
      )}

      <div className="uc-window">
        <div className="uc-bar"><span /><span /><span /></div>
        <div className="uc-body">
          <Art />
          <div className="uc-line" />

          <h2 className="uc-title">
            {down ? <>TECHNICAL <em>PROBLEM</em></> : <>UNDER <em>CONSTRUCTION</em></>}
          </h2>
          <h1 className="uc-gu">{down ? 'સર્વર સાથે જોડાઈ શકાતું નથી' : 'સાઇટ હાલ સુધારા હેઠળ છે'}</h1>
          <p className="uc-msg">{down ? 'થોડી વાર પછી ફરી પ્રયાસ કરો. સમસ્યા ઉકેલવાનું કામ ચાલુ છે.' : (m.message || DEFAULT_MSG)}</p>

          {!down && m.until && <Countdown until={m.until} />}

          <div className="uc-progress"><i /></div>
          <p className="uc-auto"><span className="uc-dot" />આ પેજ આપોઆપ તપાસ કરે છે. કામ પૂરું થતાં સાઇટ જાતે ખુલી જશે.</p>

          <div className="uc-actions">
            <a className="uc-btn" href={'tel:' + CONTACT.phone.replace(/\s/g, '')}>CONTACT US • સંપર્ક કરો</a>
            <button className="uc-ghost" onClick={m.retry}>🔄 ફરી તપાસો</button>
          </div>
          {!down && !preview && <Link className="uc-admin" to="/login">🔐 એડમિન લોગિન</Link>}
        </div>
      </div>

      <p className="uc-foot">© {new Date().getFullYear()} મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</p>
    </div>
  );
}