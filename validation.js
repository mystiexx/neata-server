const yup = require("yup")

function validateEmailBody(user) {
	const schema = yup.object({
		email: yup.string().email().max(225).required().label("Email"),
		subject: yup.string().min(2).max(255).required().label("Subject"),
		message: yup.string().required().label("Message")
	})

	return schema.validate(user, { abortEarly: false })
}

module.exports = {
	validateEmailBody
}
