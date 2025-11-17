require('dotenv').config()

const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const serverApp = express()
const PORT = process.env.PORT ?? 13724
const HOST = process.env.HOST ?? '0.0.0.0'
const router = express.Router({ mergeParams: true })

serverApp.use(express.json())
serverApp.use(cors())
serverApp.use(express.static(path.join(__dirname, 'dist')))

router.post('/log', async (req, res) => {
	try {
		fs.appendFile(path.join(__dirname, 'api.log'), req.body.message + '\n', () => {
			try {
				res.status(200).send({
					message: 'Сообщение успешно отправлено',
				})
			} catch (error) {
				res.status(500).send({})
			}
		})
	} catch (error) {
		res.status(500).send({
			message: 'На сервере произошла ошибка. Попробуйте позже',
		})
	}
})

serverApp.use('', router)

serverApp.get('', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

serverApp.listen(PORT, HOST, () => {
	console.log(`Server has been started on ${HOST}:${PORT}...`)
})
