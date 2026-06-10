import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ open, title, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-md bg-white shadow-level3">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button type="button" className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink transition-fast hover:bg-paper" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
