import { useEffect, useRef } from 'react';
import '../confirm.css';

// ખાતરી પૂછવાનું સુંદર popup (લોગઆઉટ, કાઢી નાખવું વગેરે માટે ફરી વાપરી શકાય).
// ડિફોલ્ટ ફોકસ "રદ કરો" પર, એટલે ભૂલથી Enter દબાય તો પણ કંઈ બગડે નહીં.
export default function ConfirmDialog({
  open,
  icon = '❓',
  title,
  message,
  confirmText = 'હા',
  cancelText = 'રદ કરો',
  danger = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = e => {
      if (e.key === 'Escape') onCancel?.();
      // Tab ફક્ત આ બે બટન વચ્ચે ફરે
      if (e.key === 'Tab') {
        const a = cancelRef.current, b = confirmRef.current;
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b?.focus(); }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="cf-back" onMouseDown={e => { if (e.target === e.currentTarget) onCancel?.(); }}>
      <div className="cf-box" role="alertdialog" aria-modal="true" aria-labelledby="cf-title" aria-describedby="cf-msg">
        <div className="cf-icon" aria-hidden="true">{icon}</div>
        <h3 id="cf-title">{title}</h3>
        {message && <p id="cf-msg">{message}</p>}
        <div className="cf-btns">
          <button type="button" ref={cancelRef} className="cf-btn cf-cancel" onClick={onCancel}>{cancelText}</button>
          <button type="button" ref={confirmRef} className={'cf-btn ' + (danger ? 'cf-danger' : 'cf-ok')} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}