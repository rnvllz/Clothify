import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    
    react({
      babel: {
        plugins: [
          [ 'babel-plugin-react-compiler']
        ],
      },
    }),
  ],
  server: {
    allowedHosts: [
      '.ngrok-free.dev',
      '.ngrok.io',
      '.ngrok-free.app',
    ],
  },
})
