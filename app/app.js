const { Kafka } = require('kafkajs')
const express = require('express')
const app = express()
const port = process.env.LISTENING_PORT

app.use(express.json());

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092', 'kafka2:9092']
})

const producer = kafka.producer()

app.post('/', (req, res) => {
    const {id,correo_vendedor,correo} = req.body;
    
    await producer.connect();
    console.log(process.env.KAFKA_BROKER)
    await producer.send({
    topic: 'orders',
    messages: [
        { 
            id,
            correo_vendedor,
            correo
         },
    ],
    })
    res.json({
      msg: "hola",
    });
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})