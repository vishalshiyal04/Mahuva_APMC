
import { displayCropName } from '../constants.js';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getAuth } from '../api.js';

const dt = d => new Date(d || Date.now()).toLocaleDateString('en-GB');

// ગેટ પાસ: સ્ક્રીન પર કાર્ડ + પ્રિન્ટમાં ફક્ત પાસ (QR અને વિગત)
// pass = { passId, qr (ઇમેજ), crop (માલની વિગત) }
export default function GatePass({ pass }) {
  const [printing, setPrinting] = useState(false);
  const me = getAuth()?.user;
  const c = pass.crop || {};

  useEffect(() => {
    if (!printing) return;
    const done = () => { document.body.classList.remove('print-bill'); setPrinting(false); };
    document.body.classList.add('print-bill');
    window.addEventListener('afterprint', done, { once: true });
    const t = setTimeout(() => window.print(), 150);
    return () => { clearTimeout(t); window.removeEventListener('afterprint', done); document.body.classList.remove('print-bill'); };
  }, [printing]);

  return (
    <>
      <div className="card">
        <h3>ગેટ પાસ: {pass.passId}</h3>
        <img src={pass.qr} alt="QR" /><br />
        <button onClick={() => setPrinting(true)}>🖨 ગેટ પાસ પ્રિન્ટ</button>
      </div>

      {printing && createPortal(
        <div className="print-sheet">
          <section className="pass">
            <h1>મહુવા કૃષિ ઉત્પન્ન બજાર સમિતિ</h1>
            <h2>ગેટ પાસ</h2>
            <img src={pass.qr} alt="QR" />
            <div className="pass-id">{pass.passId}</div>
            <table>
              <tbody>
                <tr><td>ખેડૂત</td><td>{me?.name || '-'}</td></tr>
                <tr><td>પાક</td><td>{displayCropName(c.name)} {c.grade && `(ગ્રેડ ${c.grade})`}</td></tr>
                <tr><td>જથ્થો</td><td>{c.man} મણ</td></tr>
                {c.shed && <tr><td>શેડ નં</td><td>{c.shed}</td></tr>}
                <tr><td>તારીખ</td><td>{dt(c.createdAt)}</td></tr>
              </tbody>
            </table>
            <p>યાર્ડના ગેટ પર આ QR સ્કેન કરાવો. આ પાસ એક જ વાર માન્ય છે.</p>
          </section>
        </div>,
        document.body
      )}
    </>
  );
}