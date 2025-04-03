import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { viteClientGeneratorPlugin } from "./vite-client-generator";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const clientGeneratorPlugin = [viteClientGeneratorPlugin()];
  const env = loadEnv(mode, process.cwd(), '');

  const port = 3002;
  const proxyPort = 3001;
  console.log(`http://0.0.0.0:${proxyPort}`)
  return {
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
      __GOOGLE_CLIENT_ID__: JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
      __APP_HOST__: JSON.stringify(env.VITE_APP_HOST),
    },
    plugins: [react(), tsconfigPaths(), ...clientGeneratorPlugin],
    optimizeDeps: {},
    server: {
      host: '0.0.0.0',
      port,
      proxy: {
        '/api': mode === 'production' ? '' : `http://0.0.0.0:${proxyPort}`,
      },
    },
    build: {
      commonjsOptions: {
        include: [/firebase/, 'prop-types', /node_modules/],
      },
      outDir: 'build',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
