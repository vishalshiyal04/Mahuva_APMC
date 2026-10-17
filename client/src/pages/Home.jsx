
import { displayCropName } from '../constants.js';
import { Link } from 'react-router-dom';
import { api, getAuth } from '../api.js';
import useLoad from '../hooks/useLoad.js';
import NewsPreview from '../components/NewsPreview.jsx';
import TrendChart from '../components/TrendChart.jsx';

export default function Home() {
  const [rates] = useLoad(() => api('/rates'));
  const [ads] = useLoad(() => api('/ads'));

  const speak = () => {
    if (!rates?.length) return;

    if (
      !('speechSynthesis' in window) ||
      !('SpeechSynthesisUtterance' in window)
    ) {
      alert('આ browserમાં અવાજની સુવિધા ઉપલબ્ધ નથી.');
      return;
    }

    const text = rates
      .slice(0, 8)
      .map(row => {
        const unit = row.unitLabel
          ? `પ્રતિ ${row.unitLabel}`
          : 'એકમની ખાતરી બાકી છે';

        return (
          `${displayCropName(row.crop)}: ${row.min} થી ${row.max} રૂપિયા. ` +
          `${unit}. તારીખ ${row.date}`
        );
      })
      .join('. ');

    const utterance = new SpeechSynthesisUtterance(
      'નોંધાયેલા બજાર ભાવ. ' + text
    );

    utterance.lang = 'gu-IN';
    utterance.rate = 0.9;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <section className="hero">
        <span className="tag">
          મહુવા APMC • બજાર ભાવ
        </span>

        <h1>
          ખેડૂત અને વેપારી માટે
          <br />
          ડિજિટલ હરાજી
        </h1>

        <p>
          બજાર ભાવ, QR ગેટ પાસ અને પારદર્શક બોલી —
          બધું એક જ જગ્યાએ.
        </p>

        <div className="cta">
          {!getAuth() && (
            <Link className="btn-yellow" to="/register">
              મફત શરૂ કરો
            </Link>
          )}

          <button
            type="button"
            className="btn-ghost"
            onClick={speak}
            disabled={!rates?.length}
          >
            ▶ ગુજરાતી અવાજમાં ભાવ સાંભળો
          </button>
        </div>
      </section>

      <NewsPreview />

      <h2>બજાર ભાવ</h2>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>પાક</th>
              <th>ન્યૂનતમ</th>
              <th>મહત્તમ</th>
              <th>એકમ</th>
              <th>તારીખ</th>
            </tr>
          </thead>

          <tbody>
            {rates?.map(row => (
              <tr key={row._id}>
                <td>{displayCropName(row.crop)}</td>
                <td>₹{row.min}</td>
                <td>₹{row.max}</td>
                <td>
                  {row.unitLabel || 'એકમની ખાતરી બાકી'}
                </td>
                <td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {rates && !rates.length && (
          <p>હજી ભાવ ઉમેરાયા નથી.</p>
        )}
      </div>

      <div className="card">
        <TrendChart rates={rates || []} />
      </div>

      {ads?.map(ad => (
        <div key={ad._id} className="card ad">
          <b>{ad.title}</b> — {ad.company}
          <br />
          {ad.text}
        </div>
      ))}
    </>
  );
}