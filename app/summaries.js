const { Kafka } = require('kafkajs')
const nodemailer = require('nodemailer') 

const kafka = new Kafka({
    clientId: "backend-summaries",
    brokers: [process.env.KAFKA_BROKER],
});

const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_SMTP_HOST,
    port: process.env.NODEMAILER_SMTP_PORT,
    auth: {
        user: process.env.NODEMAILER_AUTH_USERNAME,
        pass: process.env.NODEMAILER_AUTH_PASSWORD
    }
});

const summaryConsumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP });

const sendEmail = async (email, orders) => {
    var mailOptions = {
        from: "example@example.com",
        to: email,
        subject: "Reporte diario",
        body: `Hola!\n\nSe han realizado ${orders} durante este periodo.`,
        html: `<p>Hola! <br><br> Se han realizado ${orders} durante este periodo. </p>`,
    }

    transport.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.log(error)
        }
        console.log(`Message sent successfully: ${info.messageId}`);
    })
}


const summaryParser = async () => {
    await summaryConsumer.connect()
    await summaryConsumer.subscribe({ topic: process.env.KAFKA_SUMMARIES_TOPIC })
    await summaryConsumer.run({
        eachMessage: async ({ message }) => {
            summaries = JSON.parse(message.value.toString())
            Object.entries(summaries).forEach((summary) => {
                const [email, orders] = summary
                sendEmail(email, orders);
            })  
        }
    })
}

module.exports = { summaryParser };