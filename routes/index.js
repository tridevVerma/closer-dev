const express = require('express');
const homeController = require('../controllers/home.js');
const router = express.Router();

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/products', require('./products'));

module.exports = router;