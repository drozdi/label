import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
dotenv.config()

<<<<<<< HEAD
// https://vitejs.dev/config/
=======
console.log(process.env)
// https://vite.dev/config/
>>>>>>> 2eaa6d4dc940c55c66854b15bf01ffd94cc492b2
export default defineConfig({
	plugins: [react()],
	server: {
		host: process.env.VITE_SERVER_HOST || true,
		port: parseInt(process.env.VITE_SERVER_PORT, 10) || 3100,
		open: process.env.VITE_SERVER_OPEN === 'true',
	},
})
