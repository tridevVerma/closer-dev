const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users')
const ordersController = require('../controllers/orders');

router.get('/profile', usersController.profile);
router.get('/orders', ordersController.orders);
router.get('/signup', usersController.signup);
router.get('/login', usersController.login);
router.post('/create', usersController.create);
router.post('/create-session', usersController.createSession);
router.get('/profile/:id', usersController.logout); // params
// router.get('/profile/logout', usersController.logout); // query

module.exports = router;