const express = require("express");
const dotenv = require("dotenv");
const mg = require("mailgun-js");
const bodyParser = require('body-parser')

dotenv.config();

const mailgun = () => {
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });
};

const app = express();
app.use = express.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post("/email", urlencodedParser,  (req, res) => {
  const { email, subject, message } = req.body;
  mailgun()
    .messages()
    .send(
      {
        from: "aloneroland@gmail.com",
        to: `${email}`,
        subject: `${subject}`,
        html: `<p>${message}</p>`,
      },
      (error, body) => {
        if (error) {
          console.log(error);
          res.status(500).send({ message: "Error in sending email" });
        } else {
          console.log(body);
          res.send({ message: "Email sent successfully" });
        }
      }
    );
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
