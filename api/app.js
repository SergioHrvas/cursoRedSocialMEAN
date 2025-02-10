'use strict'

//Cargamos el módulo de express
var express = require('express');

//Cargamos el módulo del body parser
var bodyParser = require('body-parser')
const cors = require('cors');
var app = express();

//**cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');

//**middleware

///Cuando reciba datos, lo convierte en JSON.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// cors
app.use(cors());


//**rutas
///El app.use nos permite que se ejecute el middleware antes de la acción del controlador
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);

//exportar
module.exports = app;