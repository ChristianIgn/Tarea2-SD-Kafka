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

async function kafka_producer(id,correo_vendedor,correo,cantidad) {
    await producer.connect();
    await producer.send({
        topic: process.env.KAFKA_ORDERS_TOPIC,
        messages: [
            { key: "Orden" , value: JSON.stringify({
                id: id,
                correo_vendedor: correo_vendedor,
                correo: correo,
                cantidad: cantidad
            }) },
        ],
    });
}

app.post('/producer', (req, res) => {
    const {id,correo_vendedor,correo,cantidad} = req.body;
    kafka_producer(id,correo_vendedor,correo,cantidad);
    res.json({
        id,
        correo_vendedor,
        correo,
        cantidad
    });
});

const consumer = kafka.consumer({ groupId: "backend" })

app.get('/consumer', async(req,res)=> {
  let suma = 0;
  const consumer = await kafka.consumer({ groupId: "backend" })
  await consumer.connect()
  await consumer.subscribe({
    topic: process.env.KAFKA_ORDERS_TOPIC,
    fromBeginning: true
  })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const {cantidad,correo_vendedor} = JSON.parse(message.value.toString())
      console.log('Received message', {
        topic,
        partition,
        key: message.key.toString(),
        cantidad,
        correo_vendedor
      })
    }
  })
})

app.listen(port, () => {
    console.log(`Server started! at http://localhost:${port}`);
  });