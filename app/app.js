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
  const consumer1 = await kafka.consumer({ groupId: "backend" })
  main(consumer1);
})

const main = async (consumer) => {
  await consumer.connect()
  await consumer.subscribe({
    topic: process.env.KAFKA_ORDERS_TOPIC,
    fromBeginning: true
  })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message', {
        topic,
        partition,
        key: message.key.toString(),
        value: message.value.toString()
      })
    }
  })
}

app.listen(port, () => {
    console.log(`Server started! at http://localhost:${port}`);
  });