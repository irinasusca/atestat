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
        'modifica-orar': './modifica-orar.html',
        'add-programare': './add-programare.html',
        'view-available': './view-available.html',
        admin: './admin.html',
        doctors: './doctors.html',
        pricing: './pricing.html',
        login: './login.html',
        register: './register.html',
        programari: './programari.html',
        'tratament-acnee': './services/tratament-acnee.html',
        'consultatie-dermatologica': './services/consultatie-dermatologica.html',
        'acid-hialuronic': './services/acid-hialuronic.html',
        'botox': './services/botox.html',
        'epilare-laser': './services/epilare-laser.html',
        'laser-co2': './services/laser-co2.html',
        'tratament-celulita': './services/tratament-celulita.html',
        'criolipoliza': './services/criolipoliza.html',
        'peeling-chimic': './services/peeling-chimic.html',
        'biorevitalizare': './services/biorevitalizare.html',
        'laser-vascular': './services/laser-vascular.html',
        'radiofrecventa': './services/radiofrecventa.html',
        'terms': './terms.html',
        'privacy': './privacy.html',
      }
    }
  }
})