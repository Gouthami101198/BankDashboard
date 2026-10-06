import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` -> normal multi-file build.
// `SINGLE=1 npm run build` -> one self-contained dist/index.html (used for the preview).
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    ...(process.env.SINGLE ? [viteSingleFile()] : []),
  ],
});
