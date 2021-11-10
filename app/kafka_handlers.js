const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: "backend",
    brokers: [process.env.KAFKA_BROKER],
});


const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP });

const consumeMessages = async (ordersCallback, summariesCallback) => {
    await consumer.connect()
    await consumer.subscribe({ topic: process.env.KAFKA_ORDERS_TOPIC })
    await consumer.subscribe({ topic: process.env.KAFKA_SUMMARIES_TOPIC })
    await consumer.run({
        eachMessage: async ({topic, message}) => {
            const parsedMessage = JSON.parse(message.value.toString())

            if(topic === process.env.KAFKA_ORDERS_TOPIC){
                ordersCallback(parsedMessage)
            }else if(topic === process.env.KAFKA_SUMMARIES_TOPIC){
                summariesCallback(parsedMessage)
            }else{
                console.log(`Message received without callback, TOPIC: ${topic}`);
            }
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

module.exports = { consumeMessages, sendMessages };