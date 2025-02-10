import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {

  return {
    // preview: {
    //   allowedHosts: true,
    // },
    // server: {
    //   allowedHosts: true,
    // },
    plugins: [react(), tsconfigPaths()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './vitest.setup.mjs',
    },
  }
});
