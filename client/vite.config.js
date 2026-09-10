import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import caseItems from './vite-plugin-case-items.js'
import seo from './vite-plugin-seo.js'

// https://vite.dev/config/
export default defineConfig({
  // Vite's hashed output defaults to dist/assets, the same URL prefix that
  // public/assets already occupies. The two need opposite cache policies —
  // content-hashed bundles can be immutable forever, hand-named media cannot —
  // so the build output moves to /build/ to keep the two namespaces apart.
  build: { assetsDir: 'build' },
  plugins: [
    react(),
    caseItems({
      rootDir: 'public/assets/works',
      outFile: 'src/mediaSizes.generated.json',
    }),
    seo(),
  ],
})
