const express = require("express")
const dotenv = require("dotenv")
const formData = require("form-data")
const Mailgun = require("mailgun.js")
const mailgun = new Mailgun(formData)
const bodyParser = require("body-parser")
const cors = require("cors")
const { validateEmailBody } = require("./validation")
dotenv.config()
const mg = mailgun.client({
	username: "api",
	key: process.env.MAILGUN_API_KEY || ""
})

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
		return res.status(200).json({})
	}
	next()
})
app.post("/email", async (req, res) => {
	const { email, subject, message } = req.body
	try {
		await validateEmailBody(req.body)
	} catch (err) {
		return res.status(400).json({ status: "error", statusCode: 400, message: err.errors[0] })
	}

	mg?.messages
		?.create(process.env.MAILGUN_DOMAIN || "", {
			from: "Roland Enola <festusalabo@gmail.com>",
			to: [`${email}`],
			subject: `${subject}`,
			text: `${message}`,
			html: `<h1>${message}</h1>`
		})
		.then(msg => res.send(msg))
		.catch(err => res.send(err))
})

const port = process.env.PORT || 4000

app.listen(port, () => {
	console.log(`serve at http://localhost:${port}`)
})
