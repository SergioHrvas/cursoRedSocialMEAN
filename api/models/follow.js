'use strict'

//Cargamos el módulo de mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el esquema
var FollowSchema = Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    followed: {type: Schema.ObjectId, ref: 'User'},
    created_at: String
});

//exportamos el esquema
module.exports = mongoose.model('Follow', FollowSchema);