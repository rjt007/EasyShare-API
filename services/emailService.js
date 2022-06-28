require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendEmail({emailFrom, emailTo, subject, text, html}){
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USERNAME ,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Send Email with defined transport object
    let info = await transporter.sendMail({
        from: `EasyShare <${emailFrom}>`, // sender address
        to: emailTo, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
}

module.exports = sendEmail;