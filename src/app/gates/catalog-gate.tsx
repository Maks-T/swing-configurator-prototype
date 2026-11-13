import { useQuery } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { DoorCatalogQueries } from '@/entities/door-catalog';
import { readDraft, useSwingProjectStore } from '@/entities/swing-project';
import { QueryErrorState } from '@/shared/ui/query-error-state';
import { QueryLoadingState } from '@/shared/ui/query-loading-state';

import type { LegacyData } from '@calculation/door-kit';

/** Инициализация проекта один раз при монтировании (черновик или дверь по умолчанию) */
function ProjectInit({ data, children }: { data: LegacyData; children: ReactNode }) {
  useState(() => {
    useSwingProjectStore.getState().init(data, readDraft());
    return true;
  });

  return children;
}

/** Загружает данные дверей (формат ядра VMS-NC) и готовит проект */
export function CatalogGate({ children }: { children: ReactNode }) {
  const query = useQuery(DoorCatalogQueries.getData());

  if (query.isError) {
    return (
      <QueryErrorState
        className="calc:min-h-svh"
        title="Не удалось загрузить каталог дверей"
        description={query.error.message || 'Попробуйте ещё раз'}
        onRetry={() => {
          void query.refetch();
        }}
        isRetrying={query.isFetching}
      />
    );
  }

  if (!query.data) {
    return (
      <QueryLoadingState className="calc:min-h-svh" message="Загрузка каталога дверей…" />
    );
  }

  return <ProjectInit data={query.data}>{children}</ProjectInit>;
}
