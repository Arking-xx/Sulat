const Blogpost = require('../models/blogpost.js');
const Like = require('../models/likes.js');

module.exports.toggleLike = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user._id;
    const post = await Blogpost.findOne({ slug });

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const existingLike = await Like.findOne({
      post: post._id,
      user: userId,
    });

    let isLiked;
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      await Blogpost.findByIdAndUpdate(post._id, {
        $inc: { likesCount: -1 },
      });
      isLiked = false;
    } else {
      // add like
      await Like.create({
        post: post._id,
        user: userId,
      });
      await Blogpost.findByIdAndUpdate(post._id, {
        $inc: { likesCount: 1 },
      });
      isLiked = true;
    }

    const updatedPost = await Blogpost.findById(post._id)
      .populate('author', 'username images')
      .lean();

    return res.json({
      post: {
        ...updatedPost,
        isLiked,
      },
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
