const Msg = ({ e, ok }) => e ? <p className={ok && !e.startsWith('⚠') ? 'ok' : 'err'}>{e}</p> : null;
export default Msg;
