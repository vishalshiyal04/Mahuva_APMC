import { useEffect, useId, useState } from 'react';
import { CROP_GROUPS, cropGroup, normalizeCropName, displayCropName } from '../constants.js';
import './CropPicker.css';

export default function CropPicker({ value = '', onChange, label = 'પાક', required = true, disabled = false, allowLegacy = false, legacyValues = [], allowAll = false }) {
  const id = useId();
  const knownGroup = cropGroup(value);
  const [group, setGroup] = useState(knownGroup || (value && allowLegacy ? value : allowAll ? '' : CROP_GROUPS[0].name));
  useEffect(() => {
    if (value) setGroup(cropGroup(value) || value);
  }, [value]);
  const extra = allowLegacy ? [...new Set(legacyValues.filter(v => v && !cropGroup(v)))] : [];
  const groups = [...CROP_GROUPS, ...extra.map(name => ({name, varieties:[]}))];
  const current = groups.find(g => g.name === group);
  const legacy = allowLegacy && legacyValues.some(v => normalizeCropName(v) === group);
  const hasVarieties = !!current?.varieties.length;
  const options = hasVarieties ? [...current.varieties, ...(legacy ? [group] : [])] : [];
  const chosen = normalizeCropName(value);

  return (
    <div className="crop-picker">
      <label htmlFor={`${id}-crop`}>
        <span>{label}</span>
        <select id={`${id}-crop`} aria-label={label} value={group} disabled={disabled} required={required}
          onChange={e => {
            const next = e.target.value;
            setGroup(next);
            const entry = groups.find(g => g.name === next);
            onChange(entry?.varieties.length ? '' : next);
          }}>
          {allowAll && <option value="">બધા પાક</option>}
          {groups.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
        </select>
      </label>
      {hasVarieties && (
        <label htmlFor={`${id}-variety`}>
          <span>{group === 'મગફળી' ? 'મગફળીનો નંબર' : 'ડુંગળીની જાત'}</span>
          <select id={`${id}-variety`} aria-label={group === 'મગફળી' ? 'મગફળીનો નંબર' : 'ડુંગળીની જાત'}
            value={options.includes(chosen) ? chosen : ''} required={required} disabled={disabled} onChange={e => onChange(e.target.value)}>
            <option value="">જાત / નંબર પસંદ કરો</option>
            {options.map(name => <option key={name} value={name}>{displayCropName(name)}</option>)}
          </select>
        </label>
      )}
    </div>
  );
}