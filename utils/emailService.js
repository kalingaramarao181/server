const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // Secure for 465, false for others
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false, // ✅ Fix for self-signed certificate error
    },
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: `"EzySign" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent: ", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Email sending failed");
    }
};

module.exports = sendEmail;
