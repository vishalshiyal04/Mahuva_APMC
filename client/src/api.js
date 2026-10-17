// લોગિન દરેક ટેબની પોતાની sessionStorage માં: રિફ્રેશ પર ટકે, ટેબ વચ્ચે વહેંચાય નહીં
export const getAuth = role => { try { const a = JSON.parse(sessionStorage.getItem('auth')); return a && (!role || a.user.role === role) ? a : null; } catch { return null; } };

export const tok = () => getAuth()?.token || '';

export const api = async (path, method = 'GET', body) => {
  const r = await fetch('/api' + path, { method, headers: { 'Content-Type': 'application/json',
    Authorization: 'Bearer ' + tok() }, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json(); if (r.status === 401 && getAuth()) { sessionStorage.removeItem('auth'); location.href = '/login'; }
  if (!r.ok) throw new Error(d.error || 'ભૂલ'); return d;
};
