'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var mdUpload = multipart({uploadDir: './uploads/publications'})

api.get('/pruebas-publication', mdAuth.ensureAuth, PublicationController.prueba);
api.post('/publication', mdAuth.ensureAuth, PublicationController.savePublication);
api.get('/get-publications/:page/:itemsPerPage?', mdAuth.ensureAuth, PublicationController.getPublications);
api.get('/get-publications-user/:id/:page?/:itemsPerPage?', mdAuth.ensureAuth, PublicationController.getPublicationsUser);
api.get('/publication/:id', mdAuth.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', mdAuth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id', [mdAuth.ensureAuth, mdUpload], PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

module.exports = api;