/// <reference types="vite/client" />

import type { Env } from './schema';

declare global {
  interface ImportMetaEnv extends Readonly<Env> {
    /** Связывает ImportMetaEnv со схемой env — не удалять */
    readonly __fromEnvSchema?: never;
  }
}

export {};
