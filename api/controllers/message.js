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
        return res.status(200).send({message: "Envía los datos necesarios."})
    }

    var message = new Message();
    message.emmiter = req.user.sub;
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

    Message.find({'receiver': user}).populate('emmiter', 'name surname username image').paginate(page, itemsPerPage).exec().then((messages) => {
        if(!messages) return res.status(404).send({message: "No hay mensajes disponibles"});

        var total = messages.length;

        return res.status(200).send({
            messages,
            total,
            pages: Math.ceil(total/itemsPerPage)
        })
    }).catch(err => {
        if(err) return res.status(500).send({message: "Error en la petición"});

    })
}


function getEmmitedMessages(req, res){
    var user = req.user.sub;


    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 5;
    if(req.params.itemsPerPage){
        itemsPerPage = req.params.itemsPerPage
    }

    Message.find({'emmiter': user}).populate('emmiter', 'name surname username image').paginate(page, itemsPerPage).exec().then((messages) => {
        if(!messages) return res.status(404).send({message: "No hay mensajes disponibles"});

        var total = messages.length;

        return res.status(200).send({
            messages,
            total,
            pages: Math.ceil(total/itemsPerPage)
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
    getEmmitedMessages,
    getUnviewedMessages,
    viewMessages
}