import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { installMockApi } from './mocks/install-mock-api';
import { Providers } from './providers';

/** Монтирование виджета в хост-страницу (контейнер ROOT_CONTAINER) */
export function mount(containerId: string): (() => void) | undefined {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  installMockApi();

  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Providers />
    </StrictMode>
  );

  return () => root.unmount();
}

declare global {
  interface Window {
    initCalculator: typeof mount;
  }
}

window.initCalculator = mount;
