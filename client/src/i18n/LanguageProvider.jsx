import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { startTranslating, stopTranslating } from './translator.js';
import './language.css';

const KEY = 'lang';                       // 'gu' | 'en'
const LangCtx = createContext({ lang: 'gu', setLang: () => {}, t: (gu) => gu });
export const useLang = () => useContext(LangCtx);

const readLang = () => {
  try { const v = localStorage.getItem(KEY); return v === 'en' || v === 'gu' ? v : null; } catch { return null; }
};

// First screen of the app: the visitor chooses Gujarati or English before anything else
// (login / sign up included). The choice is remembered and can be changed from the navbar.
function LanguageGate({ onPick }) {
  return (
    <div className="lg-gate" role="dialog" aria-modal="true" aria-labelledby="lg-title">
      <div className="lg-card">
        <div className="lg-logo">🌾</div>
        <h1 id="lg-title">Mahuva APMC</h1>
        <p className="lg-q">તમે એપ્લિકેશન કઈ ભાષામાં જોવા માંગો છો?</p>
        <p className="lg-q en">In which language would you like to view the application?</p>
        <div className="lg-btns">
          <button type="button" className="lg-btn" onClick={() => onPick('gu')}>
            <span className="lg-big">ગુજરાતી</span><small>Gujarati</small>
          </button>
          <button type="button" className="lg-btn" onClick={() => onPick('en')}>
            <span className="lg-big">English</span><small>અંગ્રેજી</small>
          </button>
        </div>
        <p className="lg-hint">ભાષા પછી ઉપરના મેનુમાંથી બદલી શકાશે • You can change the language later from the top menu</p>
      </div>
    </div>
  );
}

export default function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readLang);   // null until the visitor chooses

  const setLang = useCallback(l => {
    try { localStorage.setItem(KEY, l); } catch { /* private mode: still works for this visit */ }
    setLangState(l);
  }, []);

  // Apply the language to the whole page
  useEffect(() => {
    if (!lang) return;
    document.documentElement.lang = lang;
    if (lang === 'en') startTranslating();
    else stopTranslating();
    return () => stopTranslating();
  }, [lang]);

  // Re-translate once the app below has rendered after the gate closes
  const t = useCallback((gu, en) => (lang === 'en' && en ? en : gu), [lang]);

  if (!lang) return <LanguageGate onPick={setLang} />;
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}