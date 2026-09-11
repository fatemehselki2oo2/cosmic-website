import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/pin-api': {
                target: 'https://pin.gsu.edu',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/pin-api/, ''),
            },
        },
    },
});
