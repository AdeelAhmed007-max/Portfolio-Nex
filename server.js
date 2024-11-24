const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const app = express();
const PORT = 3000; // You can change this if needed

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Email sending function
async function sendEmail(name, email, message) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your Gmail App Password
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender email
            to: process.env.EMAIL_USER, // Receiver email (same as sender for form submissions)
            subject: `New Contact Form Submission from ${name}`,
            text: `You have a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Route to handle form submissions
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Debugging: Log incoming form data
    console.log('Received form data:', { name, email, message });

    // Validate input fields
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    try {
        await sendEmail(name, email, message);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        res.status(500).send('An error occurred while sending the email.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
