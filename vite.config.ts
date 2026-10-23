import { defineConfig } from 'vite';

// Encuesta independiente y aplicación comparten recursos y rutas relativas para Pages.
export default defineConfig({
  base: './',
  build: { rollupOptions: { input: { app: 'index.html', mission0: 'mision-0.html' } } },
});
