import { useEffect, useRef } from 'react';

export default function AdminModal({ children, titleId, busy, onClose, alert = false }) {
  const dialog = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')?.focus();
    return () => { document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  function handleKey(event) {
    if (event.key === 'Escape') { event.stopPropagation(); if (!busy) onClose(); }
    if (event.key !== 'Tab') return;
    const items = [...dialog.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')];
    if (!items.length) { event.preventDefault(); dialog.current.focus(); return; }
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onKeyDown={handleKey}>
    <section ref={dialog} tabIndex={-1} role={alert ? 'alertdialog' : 'dialog'} aria-modal="true" aria-labelledby={titleId}
      className="max-h-[90dvh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-2xl border border-white/15 bg-slate-950 p-6 shadow-2xl">{children}</section>
  </div>;
}
