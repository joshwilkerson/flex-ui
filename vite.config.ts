import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import dts from 'vite-plugin-dts'
import { generateCSS } from './src/generate-css'

function flexCSSPlugin(): Plugin {
  const srcPath = path.resolve(__dirname, 'src/components/Flex/flex-ui.css')

  return {
    name: 'flex-css',
    buildStart() {
      // Write to src so tests can read it too
      fs.writeFileSync(srcPath, generateCSS())
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'flex-ui.css',
        source: generateCSS(),
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    flexCSSPlugin(),
    dts({
      include: ['src/components/**', 'src/config.ts', 'src/tokens/**'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  appType: 'custom',
  build: {
    lib: {
      entry: {
        react: path.resolve(__dirname, 'src/components/index.ts'),
        config: path.resolve(__dirname, 'src/config.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
    },
    copyPublicDir: false,
  },
})
