import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

// કેમેરા QR સ્કેનર (HTTPS અથવા localhost પર જ કેમેરા ચાલે)
export default function Scanner({ onScan }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const s = new Html5Qrcode('qr-reader'); let busy = false;
    s.start({ facingMode: 'environment' }, { fps: 10, qrbox: 240 }, async t => {
      if (busy) return; busy = true; await onScan(t); setTimeout(() => { busy = false; }, 2500);
    }, () => {}).catch(e => { alert('કેમેરા ચાલુ ન થયો: ' + e); setOn(false); });
    return () => { Promise.resolve().then(() => s.stop()).then(() => s.clear()).catch(() => {}); };
  }, [on]);
  return <div><button className="alt" onClick={() => setOn(!on)}>{on ? 'કેમેરા બંધ કરો' : '📷 કેમેરાથી QR સ્કેન કરો'}</button>
    {on && <div id="qr-reader" style={{ maxWidth: 320 }} />}</div>;
}
