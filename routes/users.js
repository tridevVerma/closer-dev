const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users')
const ordersController = require('../controllers/orders');
const postsController = require('../controllers/posts');
const commentsController = require('../controllers/comments');
const likesController = require('../controllers/likes');

router.get('/view_profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/profile-update/:id', passport.checkAuthentication, usersController.updateProfile);
router.get('/orders', ordersController.orders);
router.get('/signup', usersController.signup);
router.get('/login', usersController.login);
router.post('/create', usersController.create);
router.get('/profile/:id', usersController.destroySession);

router.post('/posts/create', passport.checkAuthentication, postsController.createPost);
router.get('/posts/destroy/:id', passport.checkAuthentication, postsController.destroyPost);

router.post('/comments/create', passport.checkAuthentication, commentsController.createComment);
router.get('/comments/destroy/:id', passport.checkAuthentication, commentsController.destroyComment);

// Likes routing

router.get('/like', passport.checkAuthentication, likesController.like);

router.get('/reset-pwd', usersController.view_Reset);
router.post('/reset-pwd', usersController.createToken);
router.post('/reset-pwd/:id/:token', usersController.resetPwd);
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/login'},
),usersController.createSession);

router.get('/auth/google', passport.authenticate('google', {scope : ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/login'}), usersController.createSession);

module.exports = router;