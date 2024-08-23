'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
var PublicationSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    text: String,
    file: String,
    created_at: String
});

//exportamos el esquema
module.exports = mongoose.model('Publication', PublicationSchema);