import { useState } from 'react';
import { api } from '../../api.js';
import useLoad from '../../hooks/useLoad.js';
import useAction from '../../hooks/useAction.js';
import Msg from '../../components/Msg.jsx';
import CrudTable from '../../components/admin/CrudTable.jsx';
import CropPicker from '../../components/CropPicker.jsx';
import { displayCropName } from '../../constants.js';

export default function Rates() {
  const [list, load] = useLoad(() => api('/rates'));
  const [msg, run] = useAction();
  const [f, setF] = useState({crop:'', min:'', max:'', avg:'', date:'', unitLabel:'મણ (20 કિલો)', unitKg:'20'});
  const set = (key, value) => setF(current => ({...current, [key]:value}));
  return (
    <>
      <h2>📈 બજાર ભાવ</h2>
      <form className="card" onSubmit={e => { e.preventDefault(); run(() => api('/admin/rates', 'POST', f), load); }}>
        <h3>જાત / નંબર મુજબ ભાવ ઉમેરો</h3>
        <CropPicker value={f.crop} onChange={crop => set('crop',crop)} />
        <label>ન્યૂનતમ ₹<input type="number" min="0" step="0.01" required value={f.min} onChange={e=>set('min',e.target.value)} /></label>
        <label>મહત્તમ ₹<input type="number" min="0" step="0.01" required value={f.max} onChange={e=>set('max',e.target.value)} /></label>
        <label>સરેરાશ ₹ — વૈકલ્પિક<input type="number" min="0" step="0.01" value={f.avg} onChange={e=>set('avg',e.target.value)} /></label>
        <label>ભાવની તારીખ<input type="date" title="ખાલી રાખો તો આજની તારીખ" value={f.date} onChange={e=>set('date',e.target.value)} /></label>
        <label>ભાવનો એકમ<input required value={f.unitLabel} onChange={e=>set('unitLabel',e.target.value)} /></label>
        <label>એક એકમનું વજન — કિલો<input type="number" min="0.001" step="any" value={f.unitKg} onChange={e=>set('unitKg',e.target.value)} /></label>
        <p>મણ માટે 20, ક્વિન્ટલ માટે 100. પ્રતિ નંગના ભાવમાં વજન ખાલી રાખો. સરેરાશ અધિકૃત રીતે ઉપલબ્ધ હોય ત્યારે જ ભરો.</p>
        <button type="submit">સેવ</button>
        <Msg e={msg} ok />
      </form>
      <div className="card">
        <h3>છેલ્લા ભાવ</h3>
        <CrudTable items={list}
          columns={[
            {label:'પાક અને જાત',render:r=>displayCropName(r.crop)},
            {label:'ન્યૂનતમ',render:r=>'₹'+r.min},
            {label:'મહત્તમ',render:r=>'₹'+r.max},
            {label:'એકમ',render:r=>r.unitLabel || 'એકમની ખાતરી બાકી'},
            {label:'તારીખ',render:r=>r.date},
          ]}
          fields={[
            {key:'crop',label:'પાક',type:'crop'},
            {key:'min',label:'ન્યૂનતમ',type:'number'},
            {key:'max',label:'મહત્તમ',type:'number'},
            {key:'avg',label:'સરેરાશ — વૈકલ્પિક',type:'number'},
            {key:'unitLabel',label:'ભાવનો એકમ'},
            {key:'unitKg',label:'એક એકમનું વજન — કિલો',type:'number'},
            {key:'date',label:'તારીખ',type:'date'},
          ]}
          onSave={(r,d)=>run(()=>api(`/admin/rates/${r._id}`,'PUT',d),load)}
          onDelete={r=>run(()=>api(`/admin/rates/${r._id}`,'DELETE'),load)} />
      </div>
    </>
  );
}