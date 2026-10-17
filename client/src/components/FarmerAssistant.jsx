
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api, getAuth } from '../api.js';
import CropPicker from './CropPicker.jsx';

const WELCOME = {
  text:
    'રામ રામ! 🙏 હું મહુવા APMCનો ડિજિટલ સહાયક.\n' +
    'પાકનું નામ લખો અથવા નીચેનો વિકલ્પ પસંદ કરો.',
  links: [],
  from: 'bot',
};

const QUICK = [
  'લાલ ડુંગળીના ભાવ',
  'સફેદ ડુંગળીના ભાવ',
  'મગફળીના ભાવ',
  'અન્ય પાકના ભાવ',
  'માલ લઈ નીકળતાં પહેલાં',
  'આજની આવક',
  'હરાજી સમય',
  'ઓફિસ સમય અને રજાઓ',
  'લાઇસન્સ દસ્તાવેજ',
  'વેપારી રજીસ્ટ્રેશન',
  'ફી અને સેસ',
  'સરકારી યોજનાઓ',
  'ટ્રાન્સપોર્ટ નિયમો',
  'સંપર્ક',
  'મારા પૈસા',
];

function SafeLink({ href, label }) {
  if (href === '/login' || href === '/admin/settlements') {
    return <Link to={href}>{label}</Link>;
  }

  if (/^tel:\d{10,15}$/.test(href)) {
    return <a href={href}>{label}</a>;
  }

  try {
    const url = new URL(href);

    if (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password
    ) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {label} ↗
        </a>
      );
    }
  } catch {}

  return null;
}

export default function FarmerAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [priceCrop, setPriceCrop] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState('');

  const field = useRef(null);
  const launcher = useRef(null);
  const bottom = useRef(null);
  const recognition = useRef(null);

  const owner = useRef(getAuth()?.token || '');
  const sequence = useRef(0);
  const pending = useRef(false);

  const location = useLocation();
  const currentToken = getAuth()?.token || '';

  const visibleMessages =
    currentToken === owner.current ? messages : [WELCOME];

  const voiceOK =
    typeof window !== 'undefined' &&
    !!(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    );

  const readOK =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window;

  // Login/logout થતાં જૂની ખાનગી વાતચીત સાફ કરો.
  useEffect(() => {
    const token = getAuth()?.token || '';

    if (token !== owner.current) {
      owner.current = token;
      sequence.current++;
      pending.current = false;

      setMessages([WELCOME]);
      setBusy(false);
      setInput('');
      setNotice('');

      recognition.current?.abort();
      window.speechSynthesis?.cancel();
    }
  }, [location, currentToken]);

  useEffect(() => {
    const timer = setInterval(() => {
      const token = getAuth()?.token || '';

      if (token !== owner.current) {
        owner.current = token;
        sequence.current++;
        pending.current = false;

        setMessages([WELCOME]);
        setBusy(false);
        setInput('');
        setNotice('');

        recognition.current?.abort();
        window.speechSynthesis?.cancel();
      }
    }, 500);

    return () => {
      clearInterval(timer);
      sequence.current++;
      recognition.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) {
      bottom.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [messages, busy, open]);

  function close() {
    sequence.current++;
    pending.current = false;

    recognition.current?.abort();
    window.speechSynthesis?.cancel();

    setOpen(false);
    setBusy(false);
    setMessages([WELCOME]);
    setInput('');
    setNotice('');

    launcher.current?.focus();
  }

  async function send(value = input) {
    const text = value.trim();

    if (!text || pending.current || text.length > 500) return;

    recognition.current?.abort();
    window.speechSynthesis?.cancel();

    const token = getAuth()?.token || '';

    if (token !== owner.current) {
      owner.current = token;
      setMessages([WELCOME]);
    }

    const request = ++sequence.current;

    pending.current = true;
    setBusy(true);
    setInput('');
    setNotice('');

    setMessages(old => [
      ...old.slice(-39),
      { from: 'user', text, links: [] },
    ]);

    try {
      let result = await api(
        '/assistant/message',
        'POST',
        { text },
      );

      if (
        request !== sequence.current ||
        token !== (getAuth()?.token || '')
      ) {
        return;
      }

      if (result.action === 'account') {
        result = token
          ? await api('/assistant/account')
          : {
              text: 'તમારો હિસાબ જોવા ખેડૂત અથવા વેપારી ખાતામાં લોગિન કરો.',
              links: [
                { label: 'લોગિન કરો', href: '/login' },
              ],
            };
      }

      if (
        request === sequence.current &&
        token === (getAuth()?.token || '')
      ) {
        setMessages(old => [
          ...old.slice(-39),
          { ...result, from: 'bot' },
        ]);
      }
    } catch (error) {
      if (
        request === sequence.current &&
        token === (getAuth()?.token || '')
      ) {
        setMessages(old => [
          ...old,
          {
            from: 'bot',
            text:
              `માહિતી મળી શકી નહીં: ${error.message}\n` +
              'ફરી પ્રયાસ કરો.',
            links: [],
          },
        ]);
      }
    } finally {
      if (request === sequence.current) {
        pending.current = false;
        setBusy(false);
        field.current?.focus();
      }
    }
  }

  function startVoice() {
    if (listening) {
      recognition.current?.stop();
      return;
    }

    const Speech =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!Speech) {
      setNotice(
        'આ browserમાં વોઇસ ઉપલબ્ધ નથી. લખીને પૂછો.',
      );
      return;
    }

    const instance = new Speech();

    recognition.current = instance;
    instance.lang = 'gu-IN';
    instance.interimResults = false;
    instance.maxAlternatives = 1;

    instance.onstart = () => setListening(true);
    instance.onend = () => setListening(false);

    instance.onresult = event => {
      setInput(
        event.results[0][0].transcript.slice(0, 500),
      );

      setNotice('બોલેલું લખાણ તપાસીને મોકલો.');
      field.current?.focus();
    };

    instance.onerror = () => {
      setListening(false);
      setNotice(
        'વોઇસ ચાલી શક્યું નહીં. માઇકની પરવાનગી તપાસો અથવા લખીને પૂછો.',
      );
    };

    setNotice(
      'Browser વોઇસ ઓળખવા માટે અવાજ પોતાની સર્વિસને મોકલી શકે છે.',
    );

    try {
      instance.start();
    } catch {
      setNotice(
        'માઇક ફરી શરૂ કરો અથવા લખીને પૂછો.',
      );
    }
  }

  function speak(text) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = 'gu-IN';
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="apmc-assistant">
      <button
        ref={launcher}
        className="assistant-launch"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="farmer-assistant"
      >
        🌾 {open ? 'બંધ કરો' : 'ખેડૂત સહાયક'}
      </button>

      {open && (
        <section
          id="farmer-assistant"
          className="assistant-panel"
          role="dialog"
          aria-labelledby="assistant-title"
          onKeyDown={event => {
            if (event.key === 'Escape') close();
          }}
        >
          <header>
            <div>
              <strong id="assistant-title">
                મહુવા APMC સહાયક
              </strong>
              <small>
                ગુજરાતીમાં પૂછો • તારીખ સાથે માહિતી
              </small>
            </div>

            <button
              onClick={close}
              aria-label="સહાયક બંધ કરો"
            >
              ✕
            </button>
          </header>

          <div
            className="assistant-log"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-busy={busy}
          >
            {visibleMessages.map((message, index) => (
              <article
                key={index}
                className={`assistant-message ${message.from}`}
              >
                <p>{message.text}</p>

                <div className="assistant-links">
                  {(message.links || []).map(
                    (link, linkIndex) => (
                      <SafeLink key={linkIndex} {...link} />
                    ),
                  )}
                </div>

                {message.from === 'bot' && readOK && (
                  <button
                    className="assistant-read"
                    onClick={() => speak(message.text)}
                    aria-label="આ જવાબ સાંભળો"
                  >
                    🔊 સાંભળો
                  </button>
                )}
              </article>
            ))}

            {busy && (
              <p className="assistant-wait">
                માહિતી તપાસી રહ્યો છું…
              </p>
            )}

            <div ref={bottom} />
          </div>

          <div
            className="assistant-quick"
            aria-label="ઝડપી પ્રશ્નો"
          >
            {QUICK.map(question => (
              <button
                key={question}
                disabled={busy}
                onClick={() => send(question)}
              >
                {question}
              </button>
            ))}
          </div>

          <div className="assistant-crop-tools">
            <CropPicker value={priceCrop} onChange={setPriceCrop} disabled={busy} required={false} />
            <button type="button" disabled={busy || !priceCrop} onClick={() => send(priceCrop + 'ના ભાવ')}>
              પસંદ કરેલી જાતના ભાવ
            </button>
          </div>

          <form
            onSubmit={event => {
              event.preventDefault();
              send();
            }}
          >
            <label
              htmlFor="assistant-input"
              className="assistant-label"
            >
              તમારો પ્રશ્ન
            </label>

            <div className="assistant-compose">
              <input
                id="assistant-input"
                ref={field}
                value={input}
                onChange={event =>
                  setInput(event.target.value)
                }
                maxLength={500}
                placeholder="જેમ કે: ૧૦ મણ સફેદ ડુંગળી"
                disabled={busy}
              />

              {voiceOK && (
                <button
                  type="button"
                  onClick={startVoice}
                  disabled={busy}
                  aria-label={
                    listening
                      ? 'માઇક બંધ કરો'
                      : 'બોલીને લખો'
                  }
                  aria-pressed={listening}
                >
                  {listening ? '⏹' : '🎙'}
                </button>
              )}

              <button disabled={busy || !input.trim()}>
                મોકલો
              </button>
            </div>

            {notice && (
              <small role="status">{notice}</small>
            )}

            <small>
              આ સહાયક બેંકમાં ચુકવણી કરતો નથી.
              WhatsApp વિકલ્પ ઓફિસ સંપર્ક માટે છે.
            </small>
          </form>
        </section>
      )}
    </div>
  );
}