import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import vitePluginFaviconsInject from 'vite-plugin-favicons-inject'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // vitePluginFaviconsInject('./src/assets/favicon.ico'),
  ],
  base: '/password_generator',
})
