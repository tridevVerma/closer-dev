const express = require('express');
const router = express.Router();
const description = require('../controllers/description');

router.get('/desc', description.desc);

module.exports = router;