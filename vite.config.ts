import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
dotenv.config()

export default defineConfig({
	plugins: [react()],
	server: {
		host: process.env.VITE_SERVER_HOST || true,
		port: parseInt(process.env.VITE_SERVER_PORT, 10) || 3100,
		open: process.env.VITE_SERVER_OPEN === 'true',
	},
})
