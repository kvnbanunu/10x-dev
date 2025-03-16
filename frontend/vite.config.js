import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    port: 3000
  },
  base: '/10x-dev/',
  build: {
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
});
