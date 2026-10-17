

import { useEffect, useId, useState } from 'react';
import { api } from '../api.js';
import { CROPS, displayCropName } from '../constants.js';
import CropPicker from './CropPicker.jsx';
import './TrendChart.css';

const rupees = value =>
  value == null
    ? '—'
    : `₹${Math.round(value).toLocaleString('en-IN')}`;

// function sevenDays(rows) {
//   const byDate = new Map(rows.map(row => [row._id, row]));
//   const today = new Date(
//     new Date().toISOString().slice(0, 10) + 'T00:00:00Z'
//   );

//   const number = value =>
//     value == null ||
//     value === '' ||
//     !Number.isFinite(Number(value)) ||
//     Number(value) < 0
//       ? null
//       : Number(value);

//   return Array.from({ length: 7 }, (_, index) => {
//     const date = new Date(
//       today.getTime() - (6 - index) * 86400000
//     ).toISOString().slice(0, 10);

//     const row = byDate.get(date);

//     return {
//       date,
//       min: number(row?.min),
//       max: number(row?.max),
//     };
//   });
// }

function sevenDays(rows, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const part = name =>
    parts.find(item => item.type === name).value;

  const today =
    `${part('year')}-${part('month')}-${part('day')}`;

  const anchor = Date.parse(today + 'T00:00:00Z');
  const byDate = new Map(rows.map(row => [row._id, row]));

  const number = value => {
    if (
      value == null ||
      value === '' ||
      !Number.isFinite(Number(value)) ||
      Number(value) < 0
    ) {
      return null;
    }

    return Number(value);
  };

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      anchor - (6 - index) * 86400000,
    )
      .toISOString()
      .slice(0, 10);

    const row = byDate.get(date);

    return {
      date,
      min: number(row?.min),
      max: number(row?.max),
    };
  });
}
function Bar({ x, y, base, fill, side, top, value, label }) {
  if (value == null) return null;

  const width = 28;
  const depth = 6;

  return (
    <g>
      <title>{label}: {rupees(value)} પ્રતિ મણ</title>

      <rect
        x={x}
        y={y}
        width={width}
        height={base - y}
        fill={fill}
      />

      <polygon
        points={`
          ${x + width},${y}
          ${x + width + depth},${y - depth}
          ${x + width + depth},${base - depth}
          ${x + width},${base}
        `}
        fill={side}
      />

      <polygon
        points={`
          ${x},${y}
          ${x + depth},${y - depth}
          ${x + width + depth},${y - depth}
          ${x + width},${y}
        `}
        fill={top}
      />

      <text
        x={x + width / 2}
        y={y - 15}
        textAnchor="middle"
        className="trend-value"
      >
        {rupees(value)}
      </text>
    </g>
  );
}

export default function TrendChart({ rates = [] }) {
  const id = useId().replace(/:/g, '');
  const [selected, setSelected] = useState(CROPS[0]);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  const available = (rates || [])
    .map(row => row.crop)
    .filter(Boolean);

  const crop = selected;

  useEffect(() => {
    let cancelled = false;

    setRows([]);
    setError('');
    if (!crop) { setStatus('ready'); return; }
    setStatus('loading');

    api('/rates/trend?crop=' + encodeURIComponent(crop))
      .then(data => {
        if (cancelled) return;

        if (!Array.isArray(data)) {
          throw new Error('ભાવનો ડેટા યોગ્ય નથી.');
        }

        setRows(data);
        setStatus('ready');
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'ભાવ લોડ થયા નથી.');
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [crop]);

  const days = sevenDays(rows);

  const highest = Math.max(
    0,
    ...days.flatMap(day => [day.min ?? 0, day.max ?? 0])
  );

  const step = Math.max(100, Math.ceil(highest / 500) * 100);
  const ceiling = step * 5;
  const base = 275;

  const y = value => base - (value / ceiling) * 205;
  const shortDate = date =>
    `${date.slice(8, 10)}/${date.slice(5, 7)}`;

  return (
    <section className="trend-panel">
      <div className="trend-header">
        <div>
          <h3>📊 છેલ્લા ૭ દિવસના બજાર ભાવ</h3>
          <p>ઊંચી પટ્ટી એટલે વધુ ભાવ • બધા ભાવ ₹ / મણ</p>
        </div>

        <CropPicker label="પાક પસંદ કરો" value={crop} onChange={setSelected}
          allowLegacy legacyValues={available} />
      </div>

      {!crop && <p>ગ્રાફ જોવા જાત / નંબર પસંદ કરો.</p>}
      <div className="trend-legend">
        <span>
          <i className="trend-dot trend-min" />
          ન્યૂનતમ ભાવ
        </span>
        <span>
          <i className="trend-dot trend-max" />
          મહત્તમ ભાવ
        </span>
      </div>
      {rows.some(row => row.legacyUnit) && (
  <p className="trend-note">
    જૂના એકમ વગરના ભાવ અગાઉના ફોર્મેટ પ્રમાણે
    ₹/મણ ગણેલા છે. Adminમાં તેમનો એકમ ખાતરી કરીને નોંધો.
  </p>
)}

      {status === 'loading' && (
        <p role="status">ભાવ લોડ થઈ રહ્યા છે...</p>
      )}

      {status === 'error' && (
        <p className="err" role="alert">{error}</p>
      )}

      {status === 'ready' && (
        <>
          {!days.some(day => day.min != null || day.max != null) && (
            <p>આ પાક માટે છેલ્લા ૭ દિવસના ભાવ નથી.</p>
          )}

          <div className="trend-scroll">
            <svg
              viewBox="0 0 980 345"
              role="img"
              aria-labelledby={`${id}-title`}
            >
              <title id={`${id}-title`}>
                {displayCropName(crop)}: છેલ્લા સાત દિવસના ન્યૂનતમ અને મહત્તમ ભાવ.
                વિગત નીચેના ટેબલમાં છે.
              </title>

              <defs>
                <linearGradient id={`${id}-min`} x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#34c2a3" />
                  <stop offset="100%" stopColor="#16856d" />
                </linearGradient>

                <linearGradient id={`${id}-max`} x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#ffba59" />
                  <stop offset="100%" stopColor="#e78319" />
                </linearGradient>
              </defs>

              <text x="65" y="35" className="trend-axis">
                ₹ / મણ
              </text>

              {Array.from({ length: 6 }, (_, index) => {
                const value = index * step;

                return (
                  <g key={index}>
                    <line
                      x1="75"
                      x2="960"
                      y1={y(value)}
                      y2={y(value)}
                      stroke="#e6ebf0"
                    />
                    <text
                      x="65"
                      y={y(value) + 5}
                      textAnchor="end"
                      className="trend-axis"
                    >
                      {value.toLocaleString('en-IN')}
                    </text>
                  </g>
                );
              })}

              {days.map((day, index) => {
                const x = 105 + index * 122;

                return (
                  <g key={day.date}>
                    <Bar
                      x={x}
                      y={y(day.min ?? 0)}
                      base={base}
                      value={day.min}
                      label="ન્યૂનતમ ભાવ"
                      fill={`url(#${id}-min)`}
                      side="#12614e"
                      top="#8ee3cc"
                    />

                    <Bar
                      x={x + 48}
                      y={y(day.max ?? 0)}
                      base={base}
                      value={day.max}
                      label="મહત્તમ ભાવ"
                      fill={`url(#${id}-max)`}
                      side="#ae5810"
                      top="#ffda98"
                    />

                    {day.min == null && day.max == null && (
                      <text
                        x={x + 40}
                        y="252"
                        textAnchor="middle"
                        className="trend-axis"
                      >
                        ભાવ નથી
                      </text>
                    )}

                    <text
                      x={x + 40}
                      y="302"
                      textAnchor="middle"
                      className="trend-date"
                    >
                      {shortDate(day.date)}
                    </text>

                    {index === 6 && (
                      <text
                        x={x + 40}
                        y="326"
                        textAnchor="middle"
                        className="trend-today"
                      >
                        આજે
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="trend-note">
            મોબાઇલમાં બધા દિવસ જોવા ગ્રાફને ડાબે–જમણે સરકાવો.
          </p>

          <details className="trend-table">
            <summary>તારીખ પ્રમાણે ભાવ ટેબલમાં જુઓ</summary>

            <div className="trend-scroll">
              <table>
                <thead>
                  <tr>
                    <th>તારીખ</th>
                    <th>ન્યૂનતમ ₹/મણ</th>
                    <th>મહત્તમ ₹/મણ</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day.date}>
                      <td>
                        {shortDate(day.date)}/{day.date.slice(0, 4)}
                      </td>
                      <td>{rupees(day.min)}</td>
                      <td>{rupees(day.max)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}