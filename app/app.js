const express = require('express');
const { consumeMessages, sendMessages } = require('./kafka_handlers');
const { sendEmail } = require('./emailer');
const app = express()

app.use(express.json());


let consumidos = [];
let mensajes = [];


app.post('/producer', async (req, res) => {
    const {correo_vendedor,correo,cantidad} = req.body;
    message = JSON.stringify({
        correo_vendedor: correo_vendedor,
        correo: correo,
        cantidad: cantidad,
    })
    sendMessages(process.env.KAFKA_ORDERS_TOPIC, [{value: message}])
    res.json({
        correo_vendedor,
        correo,
        cantidad
    })
    console.log(consumidos)
});


app.get('/consumer/:correo', async(req,res)=> {
    const correo = req.params.correo;
    let suma = 0;
    let i=0;

    while(i<consumidos.length){
        if(consumidos[i].correo_vendedor === correo){
            suma += Number(consumidos[i].cantidad);
            let cantidad = consumidos[i].cantidad;
            let correo_vendedor = consumidos[i].correo_vendedor;
            consumidos.splice(i,1);
            console.log(suma);
        }
        else{
            i++;
        }
    }
    data = JSON.stringify({
        email: correo,
        orders: suma
    })
    mensajes.push(data);
    console.log(mensajes);
    res.json({
        correo,
        suma
    })
})

app.get('/daily', async(req,res)=> {
    let i=0;
    while(i<mensajes.length){
        sendMessages(process.env.KAFKA_SUMMARIES_TOPIC, [{value: mensajes[i]}])
        i++;
    }
    mensajes = [];
    res.json({
        mensajes
    })
})

app.listen(process.env.LISTENING_PORT, () => {
    console.log(`Server started! at http://localhost:${process.env.LISTENING_PORT}`);

    consumeMessages(
        (order) => consumidos.push(order),
        (summary) => sendEmail(summary)
    );
});
