'use strict'

var User = require('../models/user');
var Follow = require('../models/follow');

//Importamos el servicio de jwt token
var jwt = require('../services/jwt');

//Importamos mongoose paginate
var mongoosePaginate = require('mongoose-pagination');

//Importamos la libreria moment para generar fechas
var moment = require("moment");

function prueba(req, res){
    res.status(200).send({messsage: "Hola, esto es una prueba desde el controlador Follow."})
}
 
function followUser(req, res){
    var params = req.body;
    
    var follow = new Follow();

    //Seteo el usuario logeado (el que sigue a X persona)
    follow.user = req.user.sub;

    //Seteo el usuario seguido
    follow.followed = params.followed;


    follow.created_at = moment().unix();
    
    follow.save().then(followStored => {
        if(!followStored){
            return res.status(404).send({message: "Error al guardar el seguimiento."})
        }
        return res.status(200).send({follow: followStored})
    }).catch(err => {
        return res.status(500).send({message: "No se ha podido realizar la operación de seguimiento."})
    })
}

function unfollowUser(req, res){
    var idFollowed = req.params.id;
    var user = req.user.sub;

    Follow.find({'followed': idFollowed, 'user': user }).deleteOne().then(
        user => {
            return res.status(200).send({message: "Se ha realizado el unfollow correctamente."})
        }
    ).catch(err => {
        return res.status(500).send({message: "No se ha podido realizar la operacion."})

    })

}

function getFollowingUsers(req, res){
    var user = req.user.sub;

    if(req.params.id && req.params.page){
        user = req.params.id;
    }

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    if(req.params.itemsPerPage){
        itemsPerPage = req.params.itemsPerPage
    }

    //Check valid user mongo id (size)
    if(!user || user.length != 24){
        return res.status(404).send({message: "El usuario no es válido."});
    }

    Follow.find({'user': user}).populate({path: 'followed'}).paginate(page, itemsPerPage).exec().then((follows) => {
        if(!follows) return res.status(404).send({message: "No hay follows disponibles"});

        followUsersIds(user).then((value) => {
            var total = follows.length;
            return res.status(200).send({
                users_following: value.following,
                users_followers: value.followed,
                follows,
                total,
                pages: Math.ceil(total/itemsPerPage)
            })
        }
        ).catch(err => {
            if(err) return res.status(500).send({message: "Error en la petición"});
        })
    }).catch(err => {
        if(err) {
            console.log(err)
            return res.status(500).send({message: "Error en la petición"});
        }
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



function getFollowers(req, res){
    var user = req.user.sub;

    if(req.params.id && req.params.page){
        user = req.params.id;
    }

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    if(req.params.itemsPerPage){
        itemsPerPage = req.params.itemsPerPage
    }


    Follow.find({'followed': user}).populate({path: 'user'}).paginate(page, itemsPerPage).exec().then((follows) => {
        if(!follows) return res.status(404).send({message: "No hay follows disponibles"});

        followUsersIds(user).then((value) => {
            var total = follows.length;

            return res.status(200).send({
                users_following: value.following,
                users_followers: value.followed,
                follows,
                total,
                pages: Math.ceil(total/itemsPerPage)
            })
        }).catch(err => {
            if(err) return res.status(500).send({message: "Error en la petición"});
        })  
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});

    })

}

function getMyFollows(req, res){
    var user = req.user.sub;

    var find = Follow.find({user: user});

    if(req.params.followed){
        find = Follow.find({followed: user});
    }
    
    find.populate('user followed').then((follows) => {
        if(!follows) return res.status(404).send({message: "No sigues a ningún usuario"});

        var total = follows.length;

        return res.status(200).send({
            follows,
            total,
        })
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});
    });
    
}




module.exports = {
    prueba,
    followUser,
    unfollowUser,
    getFollowingUsers,
    getFollowers,
    getMyFollows
}