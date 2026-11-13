// noinspection JSUnusedGlobalSymbols

import type { Plugin, UserConfig } from 'vite';

/**
 * Manifest plugin for VMS-NC host platform (CalculatorController.php)
 */
export function flatManifestPlugin(): Plugin {
  return {
    name: 'vite-plugin-flat-manifest',
    generateBundle(this, _options, bundle) {
      const manifest: Record<string, string> = {};

      for (const [fileName, fileInfo] of Object.entries(bundle)) {
        if (fileInfo.type === 'chunk' && fileInfo.isEntry) {
          manifest['main.js'] = fileName;
        }

        if (
          fileInfo.type === 'asset' &&
          fileName.endsWith('.css') &&
          fileName.includes('main')
        ) {
          manifest['main.css'] = fileName;
        }
      }

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}

/**
 * Build configuration for VMS-NC deployment
 */
export function getVmsBuildConfig(mode: string): UserConfig['build'] {
  const isDev = mode === 'development';

  return {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: isDev,
    rolldownOptions: {
      output: {
        entryFileNames: 'js/main.[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo: { name?: string; names?: string[] }) => {
          const primaryName = assetInfo.names?.[0] ?? assetInfo.name ?? '';

          if (primaryName.endsWith('.css')) {
            return 'css/main.[hash][extname]';
          }

          return 'assets/[name].[hash][extname]';
        },
      },
    },
  };
}
