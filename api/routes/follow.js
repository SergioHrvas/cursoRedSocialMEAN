'use strict'

var express = require('express');
var FollowController = require('../controllers/follow');

var api = express.Router();

var mdAuth = require('../middlewares/authenticated');


//var multipart = require('connect-multiparty');
//var mdUpload = multipart({uploadDir: './uploads/users'})

api.get('/pruebas-follow', mdAuth.ensureAuth, FollowController.prueba);
api.post('/follow', mdAuth.ensureAuth, FollowController.followUser);
api.delete('/unfollow/:id', mdAuth.ensureAuth, FollowController.unfollowUser);
api.get('/get-following-users/:id?/:page?/:itemsPerPage?', mdAuth.ensureAuth, FollowController.getFollowingUsers);
api.get('/get-followed-users/:id?/:page?/:itemsPerPage?', mdAuth.ensureAuth, FollowController.getFollowers);
api.get('/get-my-follows/:followed?', mdAuth.ensureAuth, FollowController.getMyFollows);

module.exports = api;