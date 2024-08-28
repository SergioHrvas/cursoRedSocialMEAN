'use strict'

//Cargamos el módulo de express
var express = require('express');

//Cargamos el módulo del body parser
var bodyParser = require('body-parser')

var app = express();

//**cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
//**middleware

///Cuando reciba datos, lo convierte en JSON.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//**cors


//**rutas
///El app.use nos permite que se ejecute el middleware antes de la acción del controlador
app.use('/api', user_routes);
app.use('/api', follow_routes);

//exportar
module.exports = app;