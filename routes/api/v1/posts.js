const express = require('express');
const router = express.Router();
const postsController = require('../../../controllers/api/v1/posts_api.js');

router.get('/', postsController.posts_api);

module.exports = router;