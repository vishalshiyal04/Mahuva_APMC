import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import CropPicker from '../../components/CropPicker.jsx';

const TOPICS = {
  hours: 'ઓફિસ સમય અને રજાઓ',
  auction: 'હરાજી સમય',
  registration: 'વેપારી રજીસ્ટ્રેશન',
  documents: 'લાઇસન્સ દસ્તાવેજ',
  fees: 'ફી અને સેસ',
  schemes: 'સરકારી યોજનાઓ',
  transport: 'ટ્રાન્સપોર્ટ / ગેટ નિયમો',
};

const today = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const part = name =>
    parts.find(p => p.type === name).value;

  return `${part('year')}-${part('month')}-${part('day')}`;
};

const freshRate = () => ({
  crop: '',
  min: '',
  max: '',
  avg: '',
  unitLabel: '',
  unitKg: '',
  date: today(),
});

export default function AssistantSettings() {
  const [config, setConfig] = useState(null);
  const [rate, setRate] = useState(freshRate);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      setConfig(await api('/admin/assistant'));
      setMsg('');
    } catch (error) {
      setMsg(error.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const update = (key, value) =>
    setConfig(current => ({
      ...current,
      [key]: value,
    }));

  const updateFaq = (key, field, value) =>
    setConfig(current => ({
      ...current,
      faq: {
        ...current.faq,
        [key]: {
          ...current.faq[key],
          [field]: value,
        },
      },
    }));

  async function save(event, kind) {
    event.preventDefault();

    if (busy) return;

    setBusy(true);
    setMsg('');

    try {
      const result =
        kind === 'rate'
          ? await api('/admin/assistant/rates', 'POST', rate)
          : await api('/admin/assistant', 'PUT', config);

      setMsg(result.msg);

      if (kind === 'rate') setRate(freshRate());
    } catch (error) {
      setMsg(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="assistant-settings">
      <h1>🌾 ડિજિટલ સહાયકની માહિતી</h1>

      <p>
        ખાતરી કરેલી જાહેર માહિતી જ નોંધો. માન્યતા પૂરી થયા
        પછી સહાયક તે જવાબને તાજો નહીં બતાવે.
      </p>

      {msg && (
        <p role="status" className="assistant-admin-msg">
          {msg}
        </p>
      )}

      {!config ? (
        <button onClick={load}>માહિતી ફરી લાવો</button>
      ) : (
        <>
          <form
            className="assistant-admin-card"
            onSubmit={event => save(event, 'config')}
          >
            <fieldset disabled={busy}>
              <legend>યાર્ડ અને સંપર્ક</legend>

              <div className="assistant-fields">
                <label>
                  ઓફિસ ફોન
                  <input
                    type="tel"
                    value={config.officePhone}
                    onChange={event =>
                      update('officePhone', event.target.value)
                    }
                    maxLength={25}
                  />
                </label>

                <label>
                  ઓફિસ WhatsApp — દેશના કોડ સાથે
                  <input
                    type="tel"
                    placeholder="91 પછી 10 અંક"
                    value={config.whatsappPhone}
                    onChange={event =>
                      update('whatsappPhone', event.target.value)
                    }
                    maxLength={25}
                  />
                </label>

                <label>
                  યાર્ડની સ્થિતિ
                  <select
                    value={config.yardStatus}
                    onChange={event =>
                      update('yardStatus', event.target.value)
                    }
                  >
                    <option value="unknown">
                      હજુ ખાતરી નથી
                    </option>
                    <option value="open">ચાલુ</option>
                    <option value="closed">બંધ</option>
                    <option value="limited">
                      મર્યાદિત પ્રવેશ
                    </option>
                  </select>
                </label>

                <label>
                  સ્થિતિ કઈ તારીખ સુધી માન્ય?
                  <input
                    type="date"
                    value={config.yardUntil}
                    onChange={event =>
                      update('yardUntil', event.target.value)
                    }
                    required={config.yardStatus !== 'unknown'}
                  />
                </label>
              </div>

              <label>
                યાર્ડ અંગે ખાસ નોંધ
                <textarea
                  value={config.yardNote}
                  onChange={event =>
                    update('yardNote', event.target.value)
                  }
                  maxLength={500}
                />
              </label>

              {Object.entries(TOPICS).map(([key, label]) => (
                <section
                  className="assistant-topic"
                  key={key}
                >
                  <h3>{label}</h3>

                  <label>
                    મંજૂર જવાબ
                    <textarea
                      value={config.faq[key].text}
                      onChange={event =>
                        updateFaq(
                          key,
                          'text',
                          event.target.value,
                        )
                      }
                      maxLength={1800}
                    />
                  </label>

                  <div className="assistant-fields">
                    <label>
                      અધિકૃત સોર્સ લિંક
                      <input
                        type="url"
                        placeholder="https://..."
                        value={config.faq[key].url}
                        onChange={event =>
                          updateFaq(
                            key,
                            'url',
                            event.target.value,
                          )
                        }
                        maxLength={500}
                      />
                    </label>

                    <label>
                      માહિતી કઈ તારીખ સુધી માન્ય?
                      <input
                        type="date"
                        value={config.faq[key].until}
                        onChange={event =>
                          updateFaq(
                            key,
                            'until',
                            event.target.value,
                          )
                        }
                        required={
                          !!config.faq[key].text.trim()
                        }
                      />
                    </label>
                  </div>
                </section>
              ))}

              <button type="submit">
                {busy
                  ? 'સેવ થઈ રહ્યું છે…'
                  : 'સહાયકની માહિતી સેવ કરો'}
              </button>
            </fieldset>
          </form>

          <form
            className="assistant-admin-card"
            onSubmit={event => save(event, 'rate')}
          >
            <fieldset disabled={busy}>
              <legend>
                એકમ સાથે પાકનો ભાવ પ્રકાશિત કરો
              </legend>

              <p>
                સરેરાશ માત્ર અધિકૃત રીતે ઉપલબ્ધ હોય ત્યારે
                લખો. વજનના એકમ માટે unitKg આપો; પ્રતિ નંગના
                ભાવમાં ખાલી રાખો.
              </p>

              <div className="assistant-fields">
                <CropPicker label="પાક" value={rate.crop} onChange={crop => setRate({ ...rate, crop })} />

                <label>
                  ભાવની તારીખ
                  <input
                    type="date"
                    value={rate.date}
                    max={today()}
                    onChange={event =>
                      setRate({
                        ...rate,
                        date: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                {['min', 'max', 'avg'].map((key, index) => (
                  <label key={key}>
                    {
                      [
                        'નીચો ભાવ ₹',
                        'ઊંચો ભાવ ₹',
                        'સરેરાશ ₹ — વૈકલ્પિક',
                      ][index]
                    }

                    <input
                      type="number"
                      min="0"
                      max="100000000"
                      step="0.01"
                      value={rate[key]}
                      onChange={event =>
                        setRate({
                          ...rate,
                          [key]: event.target.value,
                        })
                      }
                      required={key !== 'avg'}
                    />
                  </label>
                ))}

                <label>
                  ભાવનો એકમ
                  <input
                    placeholder="મણ (20 કિલો) / ક્વિન્ટલ / નંગ"
                    value={rate.unitLabel}
                    maxLength={60}
                    onChange={event =>
                      setRate({
                        ...rate,
                        unitLabel: event.target.value,
                      })
                    }
                    required
                  />
                </label>

                <label>
                  એક એકમનું વજન, કિલોમાં
                  <input
                    type="number"
                    min="0.001"
                    step="any"
                    value={rate.unitKg}
                    onChange={event =>
                      setRate({
                        ...rate,
                        unitKg: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <button type="submit">
                ભાવ પ્રકાશિત કરો
              </button>
            </fieldset>
          </form>
        </>
      )}
    </div>
  );
}