const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../../../controllers/api/v1/posts_api.js');

router.get('/', postsController.getPosts);
router.delete('/:id', passport.authenticate('jwt', {session: false}), postsController.destroyPosts);

module.exports = router;