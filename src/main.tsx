import '@/app/styles/global.css';
import { mount } from '@/app/mount';

export { mount } from '@/app/mount';

// Самостоятельный запуск (dev и превью прототипа); в хосте VMS-NC монтирует window.initCalculator
if (import.meta.env.DEV || import.meta.env.VITE_STANDALONE === 'true') {
  mount(import.meta.env.ROOT_CONTAINER);
}
