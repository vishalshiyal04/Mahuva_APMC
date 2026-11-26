import { useEffect, useState } from 'react';
import { useLang } from '../i18n/LanguageProvider.jsx';

// યાર્ડનો નિયમિત સમય: સોમ–શનિ, સવારે 8:00 થી સાંજે 6:00 (ફૂટરના CONTACT.hours સાથે મેળ રાખવો)
export const YARD = { days: [1, 2, 3, 4, 5, 6], from: 8 * 60, to: 18 * 60 };

const DAY = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// શુદ્ધ ગણતરી: ભારતીય સમય મુજબ યાર્ડ અત્યારે ખુલ્લું છે કે બંધ, અને ક્યારે ખુલશે
export function yardStatus(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(date);
  const get = t => parts.find(p => p.type === t)?.value;
  const day = DAY[get('weekday')];
  const mins = Number(get('hour')) * 60 + Number(get('minute'));
  const workday = YARD.days.includes(day);

  if (workday && mins >= YARD.from && mins < YARD.to)
    return { open: true, gu: 'યાર્ડ ખુલ્લું • સાંજે 6:00 સુધી', en: 'Yard open • till 6:00 PM' };
  if (workday && mins < YARD.from)
    return { open: false, gu: 'યાર્ડ બંધ • આજે સવારે 8:00 વાગ્યે ખુલશે', en: 'Yard closed • opens today at 8:00 AM' };
  if (day === 0)
    return { open: false, gu: 'યાર્ડ બંધ (રવિવાર) • સોમવારે સવારે 8:00 વાગ્યે ખુલશે', en: 'Yard closed (Sunday) • opens Monday at 8:00 AM' };
  if (day === 6)
    return { open: false, gu: 'યાર્ડ બંધ • સોમવારે સવારે 8:00 વાગ્યે ખુલશે', en: 'Yard closed • opens Monday at 8:00 AM' };
  return { open: false, gu: 'યાર્ડ બંધ • કાલે સવારે 8:00 વાગ્યે ખુલશે', en: 'Yard closed • opens tomorrow at 8:00 AM' };
}

// હેડરની ઉપરની પાતળી પટ્ટી: યાર્ડનું સ્થળ, યાર્ડ ખુલ્લું/બંધ અને આજની તારીખ
export default function YardStrip() {
  const { lang, t } = useLang();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const s = yardStatus(now);
  const locale = lang === 'en' ? 'en-IN' : 'gu-IN';
  const fmt = o => now.toLocaleDateString(locale, { timeZone: 'Asia/Kolkata', ...o });

  return (
    <div className="sh-strip">
      <span className="sh-addr">📍 {t('માર્કેટિંગ યાર્ડ, મહુવા', 'Marketing Yard, Mahuva')}</span>
      <span className="sh-right">
        <span
          className={'sh-yard ' + (s.open ? 'open' : 'closed')}
          title={t('યાર્ડના નિયમિત સમય મુજબ. રજા કે ફેરફાર માટે ઓફિસમાં પૂછો.', 'Based on regular yard hours. Ask the office about holidays or changes.')}
        >
          <i aria-hidden="true" />
          {t(s.gu, s.en)}
        </span>
        <span className="sh-date">
          <span className="long">📅 {fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="short">📅 {fmt({ day: 'numeric', month: 'short' })}</span>
        </span>
      </span>
    </div>
  );
}