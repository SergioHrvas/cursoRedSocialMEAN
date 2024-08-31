'use strict'

var User = require('../models/user');
var Publication = require('../models/publication');

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
const follow = require('../models/follow');


function prueba(req, res){
    res.status(200).send({messsage: "Hola, esto es una prueba desde el controlador Publication."})
}
 
function savePublication(req, res){

    var params = req.body;

    if(!params.text){
        res.status(200).send({message: "Debes enviar un texto!"})
    }

    var publication = new Publication();

    publication.user = req.user.sub;
    publication.text = req.body.text;
    publication.file = null;
    publication.created_at = moment().unix();
    
    publication.save().then(pub => {
        if(!pub) return res.status(404).send("La publicación no ha sido guardada.");

        return res.status(200).send({publication: pub});
    }).catch(err => {
        if(err) return res.status(500).send("Error al guardar la publicación");
    });
}

function getPublications(req, res){
    var user = req.user.sub;

    
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    if(req.params.itemsPerPage){
        itemsPerPage = req.params.itemsPerPage
    }

    //Cargo mis seguidos
    follow.find({user: user}).then(follows => {
        var follows_clean = [];

        follows.forEach(follow => {
            follows_clean.push(follow.followed);
        })

        Publication.find({user: {"$in": follows_clean}}).sort("-created_at").populate("user").paginate(page, itemsPerPage).then(publications =>{
            var total = publications.length;
            if(!publications || (total == 0)){
                return res.status(404).send("No hay publicaciones disponibles");
            }

            return res.status(200).send({
                publications,
                total,
                page,
                pages: Math.ceil(total/itemsPerPage)
            }
            )

        }).catch(err => {
            if(err) return res.status(500).send("Error en la operación");
        })

    }).catch(err => {
        if(err) return res.status(500).send("Error en la operación");
    });
}

function getPublication(req, res){
    var id = req.params.id;

    Publication.findById(id).then(pub => {
        if(!pub) return res.status(404).send("La publicación no se ha encontrado.");

        return res.status(200).send({publication: pub});
    }).catch(err => {
        if(err) return res.status(500).send("Error en la operación");  
    })
}

function deletePublication(req, res){
    var id = req.params.id;
    var user_id = req.user.sub;


    Publication.find({'_id': id, 'user': user_id}).deleteOne().then(
        pubs =>{
            if(pubs.deletedCount == 0){
                return res.status(404).send({message: "No se ha podido eliminar la publicacion."})
            }
            return res.status(200).send({message: "Se ha borrado la publicacion correctamente.", pubs})
        }
    ).catch(err => {
        return res.status(500).send("Error en la operación");
    })
}

//Subir archivos de publicacion
async function uploadImage(req, res){
    var id = req.params.id;
    var user = req.user.sub;
    //Si estamos enviando un fichero, lo subimos y lo guardamos en la db
    if(req.files.image){
            
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        //Comprobamos si es imagen
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLowerCase();
        if((file_ext == "jpg") || (file_ext == "png") || (file_ext == "jpeg") || ( file_ext == "gif")){

            //Comprobamos si el id del usuario de la publicacion coincide con el que me llega en la request
            Publication.find({'_id': id, 'user': user}).then(publication => {
                if(!publication || (publication.length == 0)){
                    return removeFilesOfUploads(res, file_path, "No tienes permisos para actualizar los datos del usuario.");
                }
                return hola(id, file_name, file_split, res)
            }).catch(err => {
                if(err) return res.status(500).send("Error en la operación2");
            })
        }
        else{
            return removeFilesOfUploads(res, file_path, "Extensión no válida");
        }
    }else{
        return res.status(200).send({message: "No se han subido imágenes"});
    }
};

async function hola(id, file_name, file_split, res){
    
    try{
        var old_publication = await Publication.findById(id).exec();
        var old_path = old_publication.file;

        //Actualizamos documento de usuario logueado
        const publicationUpdated = await Publication.findByIdAndUpdate(id, {file: file_name}, {new: true}).exec();
        if(!publicationUpdated){
            return res.send(404).send({message: "No se ha podido actualizar el usuario"});
        }

        //Si tenía ya una imagen, la borramos
        if(old_path){
            fs.unlink(file_split[0] + "\\" + file_split[1] + "\\" + old_path, (err) =>{
                if(err) console.error("Error al eliminar la imagen.")
            });
        }
        console.log("Asas");

            return res.status(200).send({publication: publicationUpdated});
        } catch(err){
            return res.status(500).send({message: "Error en la petición"});
        }
}

//Le pasamos la respuesta para poder devolverla
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
           return res.status(200).send({message});
   });
}


function getImageFile(req, res){
    var image_file = req.params.imageFile;

    var path_file = './uploads/publications/' + image_file;

    if(fs.existsSync(path_file)){
        res.sendFile(path.resolve(path_file));
    }else{
        res.status(200).send({message: "No existe esa imagen."})
    }
}


module.exports = {
    prueba,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
}