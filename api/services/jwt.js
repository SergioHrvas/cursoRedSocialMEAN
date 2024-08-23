'use strict'

//Importamos jwt
var jwt = require("jwt-simple");

//Importamos la libreria moment para generar fechas
var moment = require("moment");

//Variable secret para tener un string secreto
var secret = "clave_secreta_curso123";

exports.createToken = function(user){


    //Datos del usuario que quiero codificar en mi token
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }
    
    return jwt.encode(payload, secret);

}