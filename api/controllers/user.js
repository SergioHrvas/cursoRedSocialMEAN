'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');

const message = require('../models/message');
var User = require('../models/user');

//Importamos el servicio de jwt token
var jwt = require('../services/jwt');

//Importamos mongoose paginate
var mongoosePaginate = require('mongoose-pagination')


function home(req, res){
        res.status(200).send({
            message:"Hola mundo desde el servidor de NodeJS"
        })
};
   
function pruebas(req, res){
    res.status(200).send({
        message:"Acción de pruebas en el servidor de NodeJS"
    })
};

//Registro de usuario
function saveUser(req, res){
    //Recogemos los parámetros de la request
    var params = req.body;

    //Creamos una instancia/objeto de usuario (de su modelo)
    var user = new User();

    if(params.name && params.surname && params.username && params.password && params.email){
        user.name = params.name;
        user.surname = params.surname;
        user.username = params.username;
        user.email = params.email;
        user.role = "ROLE_USER";
        user.image = null;

        User.find({ $or: [
            {
                email: user.email.toLowerCase() },
                {    username: user.username.toLowerCase()}
           
        ]}).exec().then(users => {
            if(users && users.length > 0){
                return res.status(200).send({message: "Ya existe el usuario con esos datos"});
            }
            else{
                        //Encriptamos la contraseña
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;

            //Guardamos el usuario
            user.save().then(userStored => {
                //Si se ha guardado, devuelvo el usuario
                if(userStored){
                    res.status(200).send({user: userStored});
                }else{
                    res.status(404).send({message: "No se ha registrado el usuario"}); 
                }
            }).catch(err => {
                if(err) return res.status(500).send({message: "Error al guardar el usuario."})
            })

        });
            }


        }).catch(err => {
            if(err) return res.status(500).send({message: "Error en la petición de usuarios"});
        })

    }
    else{
        res.status(200).send({
            message: "Envía todos los campos obligatorios."
        })
    }
}

//Login de usuario
function loginUser(req, res){
    //Recogemos los parámetros del body
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email}).exec().then( 
        user => {
            if(user){
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check){
                        //Devuelvo los datos del usuario
                        if(params.gettoken){
                            //devolver token
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            user.password = undefined;
                            return res.status(200).send({user});
                        }

                    }   
                    else{
                        return res.status(404).send({message: "El usuario no se ha podido identificar."});
                    }
                })
            }
            else{
                return res.status(404).send({message: "El usuario no se ha podido identificar."});
            }
        }

    ).catch(
        err => {
            return res.status(500).send({message: "Error en la petición."});
        } 
    )
}

//Obtener datos de usuario
function getUser(req, res){
    var id = req.params.id;

    User.findById(id).exec().then( user => {

        if(!user) return res.status(404).send({message: "El usuario no existe"});

        return res.status(200).send({user});
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});

    });
}

//Obtener lista de usuarios paginados
function getUsers(req, res){
    //Recogemos el id del usuario logeado en este momento (por el middleware)
    var identity_user_id = req.user.sub;

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    if(req.params.itemsPerPage){
        itemsPerPage = req.params.itemsPerPage
    }

    User.find().sort('_id').paginate(page, itemsPerPage).exec().then((users) => {
        if(!users) return res.status(404).send({message: "No hay usuarios disponibles"});

        var total = users.length;
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        })
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});

    })
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers
}