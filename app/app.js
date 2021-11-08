const { Kafka } = require('kafkajs')
const express = require('express')
const app = express()
const port = process.env.LISTENING_PORT

app.use(express.json());

const kafka = new Kafka({
    clientId: "backend",
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
const run = async () => {
    // Producing
    await producer.connect()
    await producer.send({
      topic: process.env.KAFKA_ORDERS_TOPIC,
      messages: [
        { key:"test", value:"test" },
      ],
    })
}
run().catch(console.error)


app.post('/', (req, res) => {
    const {id,correo_vendedor,correo} = req.body;
    res.json({
      msg: "hola",
    });
});
app.listen(port, () => {
    console.log(`Server started! at http://localhost:${port}`);
  });