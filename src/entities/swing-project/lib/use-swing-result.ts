import { useMemo } from 'react';

import { calculateSwing, type SwingResult } from '@calculation/swing';
import { useDoorData } from '@/entities/door-catalog/@x/swing-project';

import { useSwingProjectStore } from '../model/store';

/** Результат расчёта текущей двери (null до инициализации) */
export function useSwingResult(): SwingResult | null {
  const setup = useSwingProjectStore((state) => state.project?.setup);
  const data = useDoorData();
  return useMemo(() => (setup ? calculateSwing(setup, data) : null), [setup, data]);
}
