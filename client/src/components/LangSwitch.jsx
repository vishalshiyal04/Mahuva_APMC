import { useLang } from '../i18n/LanguageProvider.jsx';

// Small ગુજરાતી | EN toggle shown in the navbar
export default function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button type="button" className={lang === 'gu' ? 'on' : ''} onClick={() => setLang('gu')} lang="gu">ગુજરાતી</button>
      <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} lang="en">EN</button>
    </div>
  );
}