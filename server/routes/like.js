const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likePost.js');
const { isAuthenticated } = require('../middleware/authMiddleware.js');

router.post('/post/:slug/like', isAuthenticated, likeController.toggleLike);

module.exports = router;
