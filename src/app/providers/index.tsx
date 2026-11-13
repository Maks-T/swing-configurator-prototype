import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/shared/lib/theme';
import { QueryLoadingState } from '@/shared/ui/query-loading-state';
import { TooltipProvider } from '@/shared/ui/tooltip';

import { CatalogGate } from '../gates/catalog-gate';

import { QueryProvider } from './query-provider';

const App = lazy(() => import('../App'));

export function Providers() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <TooltipProvider>
          <CatalogGate>
            <Suspense fallback={<QueryLoadingState className="calc:min-h-svh" />}>
              <App />
            </Suspense>
          </CatalogGate>
          <Toaster richColors />
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
