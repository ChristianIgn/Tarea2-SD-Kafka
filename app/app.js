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
        }
        else{
            i++;
        }
    }
    message = JSON.stringify({
        email: correo,
        orders: suma
    })
    sendMessages(process.env.KAFKA_SUMMARIES_TOPIC, [{value: message}])
    res.json({
        correo,
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
