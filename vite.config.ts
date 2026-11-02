import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { headTags } from './scripts/head.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), headTags()],
})
