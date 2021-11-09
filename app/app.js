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
    await producer.disconnect()
}

app.post('/producer', async (req, res) => {
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

let consumidos = [];

const run = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({
        topic: process.env.KAFKA_ORDERS_TOPIC,
        fromBeginning: true
    })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            consumidos.push(JSON.parse(message.value.toString())
            )
        }
    })
}
run().catch(console.error)

app.get('/consumer', (req,res)=> {
    let suma = 0;
    consumidos.forEach(element => {
        console.log(element)
        suma += Number(element.cantidad);
        let cantidad = element.cantidad
        let correo_vendedor = element.correo_vendedor
        console.log({
            cantidad,
            correo_vendedor
        })
        consumidos = [];
    });
    res.json({
        suma
    })
})

app.listen(port, () => {
    console.log(`Server started! at http://localhost:${port}`);
});