import type { DoorSetup } from '../door-kit';

/** Проект распашной двери (одно изделие) */
export type SwingProject = {
  name: string;
  setup: DoorSetup;
};
