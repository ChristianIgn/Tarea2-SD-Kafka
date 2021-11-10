const nodemailer = require('nodemailer') 

const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_SMTP_HOST,
    port: process.env.NODEMAILER_SMTP_PORT,
    auth: {
        user: process.env.NODEMAILER_AUTH_USERNAME,
        pass: process.env.NODEMAILER_AUTH_PASSWORD
    }
});

const sendEmail = async (summary) => {
    const email = summary["email"]
    const orders = summary["orders"]

    var mailOptions = {
        from: process.env.NODEMAILER_DEFAULT_ADDRESS,
        to: email,
        subject: "Reporte diario",
        body: `Hola!\n\nSe han realizado ${orders} ordenes durante este periodo.`,
        html: `<p>Hola! <br><br> Se han realizado ${orders} ordenes durante este periodo. </p>`,
    }

    transport.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.log(error)
        }
        console.log(`Message sent successfully: ${info.messageId}`);
    })
}

module.exports = { sendEmail };