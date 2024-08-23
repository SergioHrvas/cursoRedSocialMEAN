'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');


api.get('/home', UserController.home);
api.get('/pruebas', mdAuth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', mdAuth.ensureAuth, UserController.getUser)
api.get('/users/:page/:itemsPerPage', mdAuth.ensureAuth, UserController.getUsers)

module.exports = api;