import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/badminions-fund/' : '/'

  return {
    base,
    plugins: [react()],
  }
})
