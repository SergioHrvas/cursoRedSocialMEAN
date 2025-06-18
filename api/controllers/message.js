'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/user');
var Message = require('../models/message');

function prueba(req, res){
    res.status(200).send({message: "Probando el controlador de mensajes."})
}

function saveMessage(req, res){
    var params = req.body;

    if(!params.text || !params.receiver){
        console.log(params);
        return res.status(400).send({message: "Envía los datos necesarios."})
    }

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix(); 
    message.viewed = 0;

    message.save().then(messageStored => {
        if(!messageStored) return res.status(500).send({message: "Error al enviar el mensaje"})

        return res.status(200).send({message: messageStored})

    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición."})

    })
}


function getReceivedMessages(req, res){
    var user = req.user.sub;

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    if(req.params.itemsPerPage){
        itemsPerPage = req.params.itemsPerPage
    }

    Message.countDocuments({'receiver': user}).then(result => {
        Message.find({'receiver': user}).populate('emitter', 'name surname username image').paginate(page, itemsPerPage).exec().then((messages) => {
            var total = messages.length;

            if(!messages || (total == 0)){
                return res.status(404).send("No hay mensajes disponibles");
            }

            return res.status(200).send({
                messages,
                total: result,
                page,
                pages: Math.ceil(result/itemsPerPage)
            })
        }).catch(err => {
            if(err) return res.status(500).send({message: "Error en la petición"});

        })
    })
    .catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});
    })
}


function getEmittedMessages(req, res){
    var user = req.user.sub;


    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    if(req.params.itemsPerPage){
        itemsPerPage = req.params.itemsPerPage
    }

    Message.countDocuments({'emitter': user}).then(result => {
        Message.find({'emitter': user}).populate('emitter', 'name surname username image').populate('receiver', 'username').paginate(page, itemsPerPage).exec().then((messages) => {
            var total = messages.length;
            if(!messages || (total == 0)){
                return res.status(404).send("No hay mensajes disponibles");
            }

            return res.status(200).send({
                messages,
                total: result,
                page,
                pages: Math.ceil(result/itemsPerPage)
            })
        }).catch(err => {
            if(err) return res.status(500).send({message: "Error en la petición"});
        })
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});
    })
}

function getUnviewedMessages(req, res){
    var userId = req.user.sub;

    Message.countDocuments({receiver: userId, viewed: false}).then(count =>{
        return res.status(200).send({"unviewed": count})
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});

    })
}

function viewMessages(req, res){
    var userId = req.user.sub;

    Message.updateMany({receiver: userId, viewed: false}, {viewed: true}, {multi: true}).then(messageUpdated => {
        return res.status(200).send({messages: messageUpdated})

    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});

    })
}

module.exports = {
    prueba,
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnviewedMessages,
    viewMessages
}