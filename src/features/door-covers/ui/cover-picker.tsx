import { useState } from 'react';

import { getCoverColor, useDoorData } from '@/entities/door-catalog';
import { cn } from '@/shared/lib/utils';
import { Swatch } from '@/shared/ui/choice-card';

import {
  COVER_GROUPS,
  getCoverGroup,
  getCoverList,
  type CoverGroup,
} from '../lib/cover-groups';

type CoverPickerProps = { value: string; onChange: (sku: string) => void };

/** Сетка образцов покрытия с вкладками групп */
export function CoverPicker({ value, onChange }: CoverPickerProps) {
  const data = useDoorData();
  const [group, setGroup] = useState<CoverGroup>(() => getCoverGroup(data, value));
  const list = getCoverList(data, group);

  return (
    <div className="calc:flex calc:flex-col calc:gap-2">
      <div className="calc:flex calc:gap-1" role="tablist">
        {COVER_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={group === g.id}
            onClick={() => {
              setGroup(g.id);
            }}
            className={cn(
              'calc:cursor-pointer calc:rounded-xl calc:px-2 calc:py-0.5 calc:text-xs calc:text-muted-foreground calc:hover:bg-muted',
              group === g.id && 'calc:bg-primary/10 calc:font-medium calc:text-primary'
            )}
          >
            {g.title}
          </button>
        ))}
      </div>
      <div className="calc:grid calc:max-h-56 calc:grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] calc:gap-1 calc:overflow-auto calc:p-0.5">
        {list.map((row) => (
          <button
            key={row.key}
            type="button"
            title={row.name}
            aria-label={row.name}
            aria-pressed={row.key === value}
            onClick={() => {
              onChange(row.key);
            }}
            className={cn(
              'calc:flex calc:aspect-square calc:cursor-pointer calc:items-center calc:justify-center calc:rounded-lg calc:p-0.5',
              row.key === value && 'calc:ring-2 calc:ring-primary'
            )}
          >
            <Swatch
              color={getCoverColor(row.name)}
              className="calc:size-full"
              size={28}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
