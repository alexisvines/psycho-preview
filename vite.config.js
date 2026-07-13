import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// base: nombre del repo, porque GitHub Pages de proyecto (no de usuario)
// sirve todo bajo https://<usuario>.github.io/<repo>/ — sin esto los
// assets se piden desde la raíz del dominio y dan 404.
export default defineConfig({
  base: '/psycho-preview/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
