import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',

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
        'view-available': './view-available.html',
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