import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  base: '/ClimbLink/',
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
