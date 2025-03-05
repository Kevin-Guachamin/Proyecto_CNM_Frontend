import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Esto abrirá automáticamente el navegador al ejecutar `npm run dev`
  },
})
