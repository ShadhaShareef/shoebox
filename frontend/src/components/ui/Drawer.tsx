import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

type DrawerProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

const Drawer = ({ open, title, onClose, children }: DrawerProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/45">
      <button aria-label="Close drawer" type="button" className="absolute inset-0 h-full w-full" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-level3">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="text-base font-semibold text-ink">{title}</h2>
          <button type="button" className="rounded-md border border-border bg-white px-3 py-2 text-sm text-ink transition-fast hover:bg-paper" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="h-[calc(100%-4.5rem)] overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Drawer;
