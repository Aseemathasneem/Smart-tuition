import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://13.127.132.140',
        secure: false,
      },
    },
  },
  plugins: [react()],
})
