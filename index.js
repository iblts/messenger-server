import cors from 'cors'
import express from 'express'
import expressWs from 'express-ws'

const PORT = process.env.PORT || 3000
const app = express()

const wss = expressWs(app)

app.use(cors())
app.use(express.json())

app.get('/', function (req, res) {
	res.json({
		message: 'Hello',
	})
})

app.ws('/', function (ws, req) {
	ws.on('message', function (msg) {
		broadcastMessage(JSON.parse(msg))
	})
})

function broadcastMessage(msg) {
	wss.getWss().clients.forEach(client => {
		client.send(
			JSON.stringify({
				method: msg.method,
				author: msg.author,
				text: msg.text,
			})
		)
	})
}

app.listen(PORT, err => {
	if (err) {
		return console.log(err)
	}
	return console.log('Server started')
})
