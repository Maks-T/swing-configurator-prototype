import { CircleXIcon } from 'lucide-react';

import { useFieldErrorHint } from '@/shared/lib/hooks';
import { HintTooltip } from '@/shared/ui/info-tooltip';

type FieldErrorHintProps = {
  error: string | null;
};

export function FieldErrorHint({ error }: FieldErrorHintProps) {
  const { visible, message, open, onOpenChange } = useFieldErrorHint(error);

  if (!visible) {
    return null;
  }

  return (
    <HintTooltip
      text={message}
      variant="destructive"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CircleXIcon className="calc:size-3.5 calc:text-destructive" />
    </HintTooltip>
  );
}
