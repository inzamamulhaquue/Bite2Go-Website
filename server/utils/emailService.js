const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) =>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.Email_User, pass: process.env.Email_Pass},
    });

    await transporter.sendMail({ from: process.env.Email_User, to, subject, text});
};

module.exports = sendEmail;