import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import caseItems from './vite-plugin-case-items.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    caseItems({
      rootDir: 'public/assets/works',
      outFile: 'src/caseItems.generated.json',
    }),
  ],
})
