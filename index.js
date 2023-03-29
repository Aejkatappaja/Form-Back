require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(express.json());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Frank",
  key: process.env.MAILGUN_API_KEY,
});

app.get("/", (req, res) => {
  res.send("server is up");
});

app.post("/form", async (req, res) => {
  try {
    console.log(req.body);

    const { firstname, lastname, email, subject, message } = req.body;

    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: "xxx@gmail.com",
      subject: `${subject}`,
      text: message,
    };
    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log("server is listening");
});
