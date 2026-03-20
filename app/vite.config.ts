import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/atestat/',

  server: {
    proxy: {
        '/api': 'https://atestat.onrender.com',
    }
  },
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        about: './about.html',
        services: './services.html',
        'sample-service': './sample-service.html',
        'modifica-orar': './modifica-orar.html',
        'add-programare': './add-programare.html',
        admin: './admin.html',
        doctors: './doctors.html',
        pricing: './pricing.html',
        login: './login.html',
        register: './register.html',
        programari: './programari.html',

      }
    }
  }
})