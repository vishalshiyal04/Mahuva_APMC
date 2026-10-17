import { useState, useEffect } from 'react';

const useLoad = fn => { const [d, setD] = useState(null); const [e, setE] = useState('');
  const load = () => fn().then(x => { setD(x); setE(''); }).catch(x => setE(x.message)); useEffect(() => { load(); }, []); return [d, load, e]; };
export default useLoad;
