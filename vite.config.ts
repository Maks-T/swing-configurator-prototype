import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

import { validateEnv } from './src/shared/config/env/index.ts';
import { flatManifestPlugin, getVmsBuildConfig } from './config/deploy/vms-nc.ts';

const ENV_PREFIXES = ['VITE_', 'API_', 'ASSETS_', 'ROOT_', 'DEPLOY_'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIXES);
  validateEnv(env, { exitOnError: true });

  return {
    base: env.VITE_BASE_PATH || './',
    envPrefix: ENV_PREFIXES,
    plugins: [react(), tailwindcss(), svgr(), flatManifestPlugin()],
    build: getVmsBuildConfig(mode),
    worker: {
      format: 'es',
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@calculation', replacement: path.resolve(__dirname, './calculation') },
      ],
    },
  };
});