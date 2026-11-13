import { useEffect, useState } from 'react';

export function useFieldErrorHint(error: string | null) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [syncedError, setSyncedError] = useState(error);

  if (error !== syncedError) {
    setSyncedError(error);

    if (error) {
      setOpen(true);
      setPinned(true);
    } else {
      setOpen(false);
      setPinned(false);
    }
  }

  useEffect(() => {
    if (!pinned) {
      return;
    }

    const dismiss = () => {
      setPinned(false);
      setOpen(false);
    };

    window.addEventListener('pointerdown', dismiss);
    window.addEventListener('keydown', dismiss);
    window.addEventListener('wheel', dismiss, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('wheel', dismiss);
    };
  }, [pinned]);

  return {
    visible: Boolean(error),
    message: error ?? '',
    open,
    onOpenChange: (nextOpen: boolean) => {
      if (pinned && !nextOpen) {
        return;
      }

      setOpen(nextOpen);
    },
  };
}
