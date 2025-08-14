import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'rtd.ccc.vg',
      'dev.rtd.ccc.vg',
      'api.rtd.ccc.vg',
      'vite.ccc.vg',
    ],
  },
});
