'use strict'

//Incluimos modulo bcrypt para encriptar las contraseñas
var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

//Importamos la libreria moment para generar fechas
var moment = require("moment");

//Importamos el servicio de jwt token
var jwt = require('../services/jwt');

//Importamos mongoose paginate
var mongoosePaginate = require('mongoose-pagination');

//Incluimos la librería fs para trabajar con archivos y la path para trabajar con rutas del sistema de ficheros
var fs = require('fs');
var path = require('path');
const { escape } = require('querystring');
const Follow = require('../models/follow');

const Publication = require('../models/publication');



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
        user.created_at = moment().unix();

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
    var gettoken;

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

    var user_logged = req.user.sub;

    User.findById(id).exec().then( user => {

        if(!user) return res.status(404).send({message: "El usuario no existe"});

        
        followThisUser(id, user_logged).then(followData => {
            return res.status(200).send({user, "following": followData.following, "followed": followData.followed});

        }).catch(err => {
            if(err) return res.status(500).send({message: "Errosr en la petición"});
        }
        );

    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});

    });
}

async function followThisUser(identity_user_id, user_id){

    //Saco si el usuario me sigue a mi
    var followed = await Follow.findOne({'user': identity_user_id, 'followed': user_id}).then(follow => {
        return follow;
    }).catch(err => {
        if(err) return handleError(err);
    })

    //Si sigo al usuario
    var following = await Follow.findOne({'user': user_id, 'followed': identity_user_id}).then(follow => {
        return follow;
    }).catch(err => {
        if(err) return handleError(err);
    })

    return {following, followed};
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

    User.find().sort('_id').paginate(page, itemsPerPage).then((users) => {
        if(!users) return res.status(404).send({message: "No hay usuarios disponibles"});

        var total = users.length;

        followUsersIds(identity_user_id).then((value) => {
            return res.status(200).send({
                users,
                total,
                pages: Math.ceil(total/itemsPerPage),
                "followed": value.followed,
                "following": value.following,
            })
        })

    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});

    })
}


async function followUsersIds(user_id){

    //Usuarios que me siguen
    var followed = await Follow.find({'followed': user_id}).select({'_id': 0, '_v': 0, 'followed': 0}).then(follows => {
        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.user)
        })
        return follows_clean;
    }).catch(err => {
        if(err) return handleError(err);
    })

    //Usuarios que sigo
    var following = await Follow.find({'user': user_id}).select({'_id': 0, '_v': 0, 'user': 0}).then(follows => {
        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.followed)
        })
        return follows_clean;
    }).catch(err => {
        if(err) return handleError(err);
    })

    return {following, followed};
}


//Editar datos de usuarios
function updateUser(req, res){
    var id = req.params.id;
    var update = req.body;

    //Eliminamos la propiedad contraseña por seguridad (se modificará en un método por separado)
    delete update.password;

    //Comprobamos si el id del usuario coincide con el que me llega en la request
    if(id != req.user.sub){
        return res.status(500).send({message: "No tienes permisos para actualizar los datos del usuario."})
    }

    User.findByIdAndUpdate(id, update, {new: true}).exec().then(
        userUpdated => {
            if(!userUpdated){
                return res.send(404).send({message: "No se ha podido actualizar el usuario"});
            }

            return res.status(200).send({user: userUpdated});
        }
    ).catch(
        err => {
            if(err) return res.status(500).send({message: "Error en la petición"});
        }
    )
}

//Subir archivos de imagen de usuario
async function uploadImage(req, res){
    var id = req.params.id;


    
    //Si estamos enviando un fichero, lo subimos y lo guardamos en la db
    if(req.files){
            
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];
        
        //Comprobamos si el id del usuario coincide con el que me llega en la request
        if(id != req.user.sub){
            return removeFilesOfUploads(res, file_path, "No tienes permisos para actualizar los datos del usuario.");
        }

        //Comprobamos si es imagen
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();

        if((file_ext == "jpg") || (file_ext == "png") || (file_ext == "jpeg") || ( file_ext == "gif")){

            var old_user = await User.findById(id).exec();
            
            var old_path = old_user.image;

            //Actualizamos documento de usuario logueado
            await User.findByIdAndUpdate(id, {image: file_name}, {new: true}).exec().then(userUpdated => {
                if(!userUpdated){
                    return res.send(404).send({message: "No se ha podido actualizar el usuario"});
                }

                //Si tenía ya una imagen, la borramos
                if(old_path){
                    fs.unlink(file_split[0] + "\\" + file_split[1] + "\\" + old_path, (err) =>{
                    });
                }

                return res.status(200).send({user: userUpdated});
            }).catch(err =>{
                if(err) return res.status(500).send({message: "Error en la petición"});
            })
        }
        else{
            return removeFilesOfUploads(res, file_path, "Extensión no válida");

        }

    }else{
        return res.status(200).send({message: "No se han subido imágenes"});
    }
};

//Le pasamos la respuesta para poder devolverla
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
           return res.status(200).send({message});
   });
}

function getImageFile(req, res){
    var image_file = req.params.imageFile;

    var path_file = './uploads/users/' + image_file;

    if(fs.existsSync(path_file)){
        res.sendFile(path.resolve(path_file));
    }else{
        res.status(200).send({message: "No existe esa imagen."})
    }
}

function getCounters(req, res){
    var userId = req.user.sub;

    if(req.params.id){
        userId = req.params.id;
    }
    
    getCountFollow(userId).then(counters => {
        return res.status(200).send({counters});
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});
    })
}

async function getCountFollow(userId){
    var following = await Follow.countDocuments({"user": userId}).then(count => {
        return count;
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});
    }
    );
    
    var followed = await Follow.countDocuments({"followed": userId}).then(count => {
        return count;
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});
    }
    );
    
    var publications = await Publication.countDocuments({"user": userId}).then(count => {
        return count;
    }).catch(err => {
        if(err) handleError(err);
    }
    );

    return {following, followed, publications};}

 
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile,
    getCounters
}