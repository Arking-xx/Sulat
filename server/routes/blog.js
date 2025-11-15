const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogpost.js');
const { blogPostStorage } = require('../cloudinary/index.js');
const multer = require('multer');
const upload = multer({ storage: blogPostStorage });
const { isAuthenticated } = require('../middleware/authMiddleware.js');

router.get('/posts', blogController.getAllPost);
router.post('/post', isAuthenticated, upload.single('image'), blogController.createPost);
router.get('/posts/me', blogController.getCurrentLogUser);
router.put(
  '/post/update/:slug',
  isAuthenticated,
  upload.single('image'),
  blogController.updatePost
);

router.get('/search', blogController.searchTitle);
router
  .route('/post/:slug')
  .get(blogController.singlePost)
  .delete(isAuthenticated, blogController.deletePost);

module.exports = router;
