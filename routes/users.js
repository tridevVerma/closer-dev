const express = require('express');
const passport = require('passport');
const router = express.Router();

const usersController = require('../controllers/users')
const ordersController = require('../controllers/orders');

router.get('/profile', passport.checkAuthentication, usersController.profile);
router.get('/orders', ordersController.orders);
router.get('/signup', usersController.signup);
router.get('/login', usersController.login);
router.post('/create', usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/login'},
),usersController.createSession);

module.exports = router;