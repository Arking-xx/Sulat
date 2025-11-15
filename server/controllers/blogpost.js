const slugify = require('slugify');
const Blogpost = require('../models/blogpost.js');
const Like = require('../models/likes.js');
const { cloudinary } = require('../cloudinary');

module.exports.searchTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Search tittle is required',
      });
    }

    const blogpost = await Blogpost.find({
      title: { $regex: title, $options: 'i' },
    }).populate('author', 'username');

    res.json({
      blogpost,
    });
  } catch (error) {
    res.json({ error: error.message });
    console.log('Error', error.message);
  }
};

module.exports.getAllPost = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Blogpost.countDocuments();

    const allPost = await Blogpost.find()
      .populate('author', 'username images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    let likedPostIds = new Set();
    if (userId) {
      const userLikes = await Like.find({ user: userId }).select('post');
      likedPostIds = new Set(
        userLikes.filter((like) => like.post).map((like) => like.post.toString())
      );
    }

    const postWithLikeStatus = allPost.map((post) => ({
      ...post,
      isLiked: likedPostIds.has(post._id.toString()),
    }));

    res.json({
      posts: postWithLikeStatus,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      postsPerPage: limit,
      hasNextPage: page * limit < totalPosts,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.log('Get all post error', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports.singlePost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user?._id;
    const singlePost = await Blogpost.findOne({ slug })
      .populate('author', 'username email images')
      .lean();

    if (!singlePost) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    let isLiked = false;
    if (userId) {
      const like = await Like.findOne({
        post: singlePost._id,
        user: userId,
      });
      isLiked = !!like;
    }

    const postWithLikeStatus = {
      ...singlePost,
      isLiked,
    };

    res.json({ post: postWithLikeStatus });
  } catch (error) {
    console.log('fetch single_ post is error', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    console.log('req.file:', req.file); // Should show Cloudinary file info
    console.log('req.body:', req.body); // Should show title, content

    let slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    let uniqueSlug = slug;
    let counter = 1;

    while (await Blogpost.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    let postImages = [];
    if (req.file) {
      postImages = [
        {
          url: req.file.path,
          filename: req.file.filename,
        },
      ];
    }

    const newPost = new Blogpost({
      title,
      slug: uniqueSlug,
      content,
      author: req.user._id,
      images: postImages,
    });

    await newPost.save();

    await newPost.populate('author', 'username images');

    res.json({ newPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.getCurrentLogUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }
    const userId = req.user._id;

    const userPosts = await Blogpost.find({ author: userId })
      .populate('author', 'username images')
      .sort({ createdAt: -1 })
      .lean();

    let likedPostIds = new Set();
    if (userId) {
      const userLikes = await Like.find({ user: userId }).select('post');
      likedPostIds = new Set(
        userLikes.filter((like) => like.post).map((like) => like.post.toString())
      );
    }

    const postWithLikeStatus = userPosts.map((post) => ({
      ...post,
      isLiked: likedPostIds.has(post._id.toString()),
    }));

    res.json({
      ownPost: postWithLikeStatus,
    });
  } catch (error) {
    console.log('Get user posts error', error);
    res.status(500).json({
      error: 'failed to fetch posts',
    });
  }
};

module.exports.updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Blogpost.findOne({ slug });

    console.log('Post author:', post.author.toString());
    console.log('Current user:', req.user._id.toString());
    console.log('Match:', post.author.toString() === req.user._id.toString());

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not your own post' });
    }

    if (req.file) {
      if (post.images[0]?.filename) {
        await cloudinary.uploader.destroy(post.images[0].filename);
      }
      post.images = [
        {
          url: req.file.path,
          filename: req.file.filename,
        },
      ];
    }

    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;

    await post.save();

    res.json({ updatedPost: post });
  } catch (error) {
    res.json({ error: 'Cannot update your post' });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    const post = await Blogpost.findOne({ slug });

    if (post.author.toString() !== userId.toString()) {
      res.status(403).json({ success: false, error: 'Not your own post' });
    }

    if (post.images && post.images.length > 0) {
      for (const img of post.images) {
        if (img.filename) {
          await cloudinary.uploader.destroy(img.filename);
        }
      }
    }

    await post.deleteOne();
    res.json({ deletedPost: post });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
