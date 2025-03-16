import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    outDir: '../docs',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        register: 'register.html',
        admin: 'admin.html',
        forgotPassword: 'forgot-password.html',
        resetPassword: 'reset-password.html'
      }
    }
  },
  plugins: [
    tailwindcss(),
  ],
});
