const express = require('express');
const homeController = require('../controllers/home.js');
const router = express.Router();

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/api', require('./api/index.js'));
module.exports = router;