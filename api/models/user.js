'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
var UserSchema = Schema({
    name: String,
    surname: String,
    username: String, 
    password: String,
    email: String,
    role: String,
    image: String,
});

//exportamos el esquema
module.exports = mongoose.model('User', UserSchema);