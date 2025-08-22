require('dotenv').config()

const express = require('express')
const path = require('path')

const serverApp = express()
const PORT = process.env.PORT ?? 13724
const HOST = process.env.HOST ?? '0.0.0.0'

serverApp.use(express.static(path.join(__dirname, 'dist')))

serverApp.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

serverApp.listen(PORT, HOST, () => {
	console.log(`Server has been started on ${HOST}:${PORT}...`)
})
