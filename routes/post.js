const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const postController = require('../controllers/post');
const apiController = require('../controllers/api');


router.get('/posts', postController.getPosts);
router.post('/posts', postController.postPosts);
router.delete('/posts/:postId', postController.deletePost);
router.put('/posts/:postId', postController.putPost);

module.exports = router;