// Import required modules
const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer") // Nodemailer v0.7.1

require("dotenv").config();

// Initialize express app
const app = express()

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// ✅ Create transport using old API (v0.7.1)
const smtpTransport = nodemailer.createTransport("SMTP", {
  host: process.env.SMTP_HOST, // SMTP host
  secureConnection: false, // Use SSL
  port: 587, // Port 465 for SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Replace with your password or app password
  },
//   debug: true,
})

// 📩 Email route for sending emails
app.post("/web/attachmentsMail", (req, res) => {
  console.log("📩 Incoming request:", req.body)
  const { to, subject, text } = req.body

  // Validate required fields
  if (!to || !subject || !text) {
    return res.status(400).send({ error: "Missing required fields" })
  }

  // ✅ Mail options for v0.7.1
  const mailOptions = {
    from: "jdi@suites.digital", // Replace with your email
    to: to, // Recipient(s)
    subject: subject, // Subject line
    text: text, // Plain text version
    html: `<b>Hey there!</b><br> This is an email sent with Nodemailer v0.7.1.<br> <p>${text}</p>`, // Optional HTML content
  }

  // ✅ Send mail using v0.7.1
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.error("❌ Error sending email:", error)
      return res.status(500).send({ error: "Error sending email", details: error.message })
    }
    console.log("✅ Email sent successfully:", response.message)
    res.status(200).send({ message: "Mail sent successfully!", messageId: response.message })
  })
})

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`🚀 Server running on  http://localhost:${port}`)
})

