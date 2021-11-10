const express = require('express');
const { consumeMessages, sendMessages } = require('./kafka_handlers');
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
    sendMessages(process.env.KAFKA_ORDERS_TOPIC, [{value: message}])
    res.json({
        id,
        correo_vendedor,
        correo,
        cantidad
    })
});


let consumidos = [];


app.get('/consumer/:correo', (req,res)=> {
    const correo = req.params.correo;
    console.log(correo);
    console.log(consumidos);
    let suma = 0;
    consumidos.forEach(element => {
        const filtered = array.filter(function(element){
        if (element.correo_vendedor === correo){
        console.log(element)
          suma += Number(element.cantidad);
          let cantidad = element.cantidad
          let correo_vendedor = element.correo_vendedor
          console.log({
            cantidad,
            correo_vendedor
        })
        }
        consumidos = [];
    });
    res.json({
        suma
    })
})

app.listen(process.env.LISTENING_PORT, () => {
    console.log(`Server started! at http://localhost:${process.env.LISTENING_PORT}`);

    consumeMessages(
        (order) => consumidos.push(order),
        (summary) => sendEmail(summary)
    );
});
