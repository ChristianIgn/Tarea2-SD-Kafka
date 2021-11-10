const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: "backend",
    brokers: [process.env.KAFKA_BROKER],
});


const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP });

const ordersParser = async (callback) => {
    await consumer.connect()
    await consumer.subscribe({ topic: process.env.KAFKA_ORDERS_TOPIC })
    await consumer.run({
        eachMessage: async ({ message }) => {
            callback(JSON.parse(message.value.toString()))
        }
    })
}

const summaryParser = async (callback) => {
    await consumer.connect()
    await consumer.subscribe({ topic: process.env.KAFKA_SUMMARIES_TOPIC })
    await consumer.run({
        eachMessage: async ({ message }) => {
            callback(JSON.parse(message.value.toString()))
        }
    })
}

const sendMessages = async (topic, messages) => {
    await producer.connect()
    await producer.send({
        topic: topic,
        messages: messages
    })
    await producer.disconnect()
}

module.exports = { ordersParser, summaryParser, sendMessages };