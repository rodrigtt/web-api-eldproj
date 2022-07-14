// Minha primeira Web API constuida com sucesso!!

const Joi = require('joi'); // importanto a biblioteca joi
const express = require('express'); //declarando a função require que devolve um tipo de var express
const { required } = require('joi/lib/types/lazy');
const app = express();  //objeto do tipo express
const mysql = require('mysql');

app.use(express.json()); //Insere um Mildware

//Listas
var devices = [];
var categories = [{id: 1, name: "smartphone"},
                    {id: 2, name: "tablet"}];


//END-POINTS FOR DEVICES
//End-point que retorna a lista dos devices
app.get('/api/devices', (req, res) =>{
    res.send(devices);
});

//End-point que retorna um device específico de uma busca
app.get('/api/devices/:id', (req, res) =>{
    const device = devices.find(c => c.id === parseInt(req.params.id));

    //Verificar se item foi encontrado, se não aplicar uma mensagem de erro.
    if(!device) return res.status(404).send('The device with given ID was not found.')
    res.send(device);
});

//End-point para criar um novo device
app.post('/api/devices', (req, res) =>{

    //Validation data
    const schema = {name: Joi.string().required(),
                    category: Joi.string().required(),
                    color: Joi.string().max(16).required(),
                    partNumber: Joi.number().integer().positive().required()};
    
    result = Joi.validate(req.body, schema);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    };

    //Create a device
    const device = {
        id: devices.length + 1,
        name: req.body.name,
        category: req.body.category,
        color: req.body.color,
        partNumber: req.body.partNumber,
    };
    devices.push(device);
    res.send(device);
});

//End-point para editar/atualizar os devices;
app.put('/api/devices/:id', (req, res) => {
    
    //Look up the device. If not existing, return 404
    const device = devices.find(c => c.id === parseInt(req.params.id));
    if(!device) return res.status(404).send('The device with given ID was not found.');

    //Validate. If invalid, return 400 - Bad request
    const schema = {name: Joi.string().required(),
        category: Joi.string().required(),
        color: Joi.string().max(16).required(),
        partNumber: Joi.number().integer().positive().required()};

    result = Joi.validate(req.body, schema);
    if(result.error){
    res.status(400).send(result.error.details[0].message);
    return;
    };

    //Update the device
    device.name = req.body.name,
    device.color = req.body.color,
    device.category = req.body.category
    device.partNumber = req.body.partNumber;

    //Retun the update device
    res.send(device);

});

app.delete('/api/devices/:id', (req, res) => {
    //Look up the device. If not existing, return 404
    const device = devices.find(c => c.id === parseInt(req.params.id));
    if(!device) return res.status(404).send('The device with given ID was not found.');

    //Delete
    const index = devices.indexOf(device); //achando o index do device e passando para a variável index
    devices.splice(index, 1);

    //Return the information
    res.send(device);
});



//////////////////////////////////////////////////////////////////
//END-POINTS FOR CATEGORIES
//End-point que retorna um categoria específico de uma busca
app.get('/api/categories', (req, res) =>{
    res.send(categories);
});

app.get('/api/categories/:id', (req, res) =>{
    const categoria = categories.find(c => c.id === parseInt(req.params.id));

    //Verificar se item foi encontrado, se não aplicar uma mensagem de erro.
    if(!categoria) return res.status(404).send('The device with given ID was not found.')
    res.send(categoria);
});

//End-point para criar um novo
app.post('/api/categories', (req, res) =>{

    //Validation data
    const schema = {name: Joi.string().max(128).required()};
    
    result = Joi.validate(req.body, schema);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    };

    //Create a device
    const categoria = {
        id: categories.length + 1,
        name: req.body.name,
    };
    categories.push(categoria);
    res.send(categoria);
});

//End-point para editar/atualizar;
app.put('/api/categories/:id', (req, res) => {
    
    //Look up the device. If not existing, return 404
    const categoria = categories.find(c => c.id === parseInt(req.params.id));
    if(!categoria) return res.status(404).send('The category with given ID was not found.');

    //Validate. If invalid, return 400 - Bad request
    const schema = {name: Joi.string().max(128).required()};
    
    result = Joi.validate(req.body, schema);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    };

    //Update the category
    categoria.name = req.body.name,
    
    //Retun the update
    res.send(categoria);
});

app.delete('/api/categories/:id', (req, res) => {
    //Look up the category. If not existing, return 404
    const categoria = categories.find(c => c.id === parseInt(req.params.id));
    if(!categoria) return res.status(404).send('The category with given ID was not found.');

    //Delete
    const index = categories.indexOf(categoria); //achando o index da categoria e passando para a variável index
    categories.splice(index, 1);

    //Return the information
    res.send(categoria);
});


// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));