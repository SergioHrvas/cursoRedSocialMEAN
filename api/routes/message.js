'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.get('/prueba-message', mdAuth.ensureAuth, MessageController.prueba)
api.post('/message', mdAuth.ensureAuth, MessageController.saveMessage)
api.get('/my-messages/:page?/:itemsPerPage?', mdAuth.ensureAuth, MessageController.getReceivedMessages)
api.get('/messages/:page?/:itemsPerPage?', mdAuth.ensureAuth, MessageController.getEmittedMessages)
api.get('/unviewed-messages', mdAuth.ensureAuth, MessageController.getUnviewedMessages)
api.put('/view-messages', mdAuth.ensureAuth, MessageController.viewMessages)

module.exports = api;