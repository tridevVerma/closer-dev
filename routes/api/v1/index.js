const express = require('express');
const router = express.Router();

// router.use('/posts', (req, res) => {
//     return res.json({
//         data: {posts: 'list of posts', query: req.query},
//         success: true
//     }); 
// });

router.use('/posts', require('./posts.js'));
router.use('/users', require('./users.js'));

module.exports = router;