const express = require('express');
const { summaryParser, ordersParser, sendMessages } = require('./kafka_handlers');
const { sendEmail } = require('./emailer');
const app = express()

app.use(express.json());

app.post('/producer', async (req, res) => {
    const {id,correo_vendedor,correo,cantidad} = req.body;
    message = JSON.stringify({
        id: id,
        correo_vendedor: correo_vendedor,
        correo: correo,
        cantidad: cantidad,
    })
    sendMessages(process.env.KAFKA_ORDERS_TOPIC, [{value: message}]);
    res.json({
        id,
        correo_vendedor,
        correo,
        cantidad
    });
});


let consumidos = [];


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

app.listen(process.env.LISTENING_PORT, () => {
    console.log(`Server started! at http://localhost:${process.env.LISTENING_PORT}`);
    
    ordersParser(order => consumidos.push(order)).catch(e => console.log(e));
    summaryParser(summary => sendEmail(summary)).catch(e => console.log(e));
});