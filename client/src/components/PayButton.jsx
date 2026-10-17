import { api } from '../api.js';

const loadRzp = () => new Promise((ok, no) => { if (window.Razorpay) return ok();
  const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.onload = ok; s.onerror = () => no(new Error('Razorpay લોડ ન થયું')); document.body.appendChild(s); });

// Razorpay પેમેન્ટ (કી ન હોય તો વિનંતી + એડમિન મંજૂરી)
export default function PayButton({ onDone, setMsg }) {
  const pay = async () => { try {
    const cfg = await api('/pay/config');
    if (!cfg.enabled) { setMsg((await api('/trader/subscribe', 'POST')).msg); onDone(); return; }
    await loadRzp(); const o = await api('/pay/order', 'POST');
    new window.Razorpay({ key: cfg.key, amount: o.amount, currency: 'INR', order_id: o.id, name: 'મહુવા APMC', description: 'માસિક સબ્સ્ક્રિપ્શન',
      handler: async r => { try { setMsg((await api('/pay/verify', 'POST', r)).msg); onDone(); } catch (x) { setMsg(x.message); } } }).open();
  } catch (x) { setMsg(x.message); } };
  return <button onClick={pay}>💳 માસિક પ્લાન ખરીદો</button>;
}
