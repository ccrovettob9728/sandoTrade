import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), basicSsl(), tailwindcss()],
  server: {
    https: true,         // 🟢 Activar HTTPS
    port: 3000,          // (opcional)
  },
});
