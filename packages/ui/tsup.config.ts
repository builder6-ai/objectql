import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  globalName: 'ObjectQLUI',
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  noExternal: ['clsx', 'tailwind-merge', 'class-variance-authority', '@radix-ui/react-label', '@radix-ui/react-slot', '@radix-ui/react-checkbox', 'lucide-react', 'react-hook-form', 'zod', '@hookform/resolvers'],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  minify: true,
  target: 'es2020'
})
