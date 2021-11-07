const express = require('express')
const app = express()
const port = process.env.LISTENING_PORT

app.get('/', (req, res) => {
    console.log(process.env.KAFKA_BROKER)
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
