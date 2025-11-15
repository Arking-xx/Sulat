const User = require('../models/user.js');
const Blogpost = require('../models/blogpost.js');
const Like = require('../models/likes.js');
const { cloudinary } = require('../cloudinary');
const { frontendUrl } = require('../config.js');
const passport = require('passport');

// initiate Google OAuth
module.exports.InitializeGoogle = async (req, res, next) => {
  // store url session  so the frontend knows where to land after successful authen
  if (req.query.return_url) {
    req.session.returnUrl = req.query.return_url;
  }
  next(); // middleware for passport authentication (pass)
};

// for google oauth
module.exports.googleCallbackCustoms = async (req, res, next) => {
  //WHY: use passport authenticate as middleware to handle Oauth callback
  // process the authorization code from Google and exchange it for user profile
  passport.authenticate('google', { session: true }, async (err, user, info) => {
    try {
      console.log('Google callback - auth result ', { err, user: user ? user.email : 'no user' });

      if (err) {
        console.log('Google auth error', err);
        return res.redirect(`${frontendUrl}/signin`);
      }
      if (!user) {
        return res.redirect(`${frontendUrl}/signin?error=auth_failed`);
      }

      // Manually log in the user
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.log('Login error:', loginErr);
          return res.redirect(`${frontendUrl}/signin?error=signin_failed`);
        }
        // use to stored return url to /posts
        const returnUrl = req.session.returnUrl || `${frontendUrl}/posts`;
        delete req.session.returnUrl; // to prevent reuse

        // the frontend will detect the session and update auth state
        res.redirect(returnUrl);
      });
    } catch (error) {
      console.log('Callback error', error);
      res.redirect(`${frontendUrl}/signin?error=server_error`);
    }
  })(req, res, next); // immediately invoke the passport middleware with the current request
};

// check if the username is available to prevent duplication
module.exports.checkUsernameAvaibility = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      //early return if user don't provide username
      return res.status(400).json({ error: 'Username is required' });
    }
    const existingUser = await User.findOne({ username });
    res.json({
      isTaken: !!existingUser,
      available: !existingUser,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Failed to check username availability' });
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username: username.toLowerCase(), about: '' });

    const registeredUser = await User.register(user, password);

    // direct login after the registration of account
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      res.json({
        id: registeredUser._id,
        username,
        images: registeredUser.images,
      });
    });
  } catch (err) {
    console.log(err.message);

    if (err.name === 'UserExistingError') {
      return res.status(400).json({ success: false, error: 'Username already taken' });
    }
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Email already exist' });
    }
    res.status(400).json({ message: 'failed to create user.', error: err.message });
  }
};

module.exports.userUpdate = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (req.body.username) {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ success: false, error: 'Username is already taken' });
      }
      user.username = req.body.username;
    }

    if (req.body.about) {
      user.about = req.body.about;
    }

    if (req.file) {
      // Delete old image if needed
      if (user.images[0]?.filename && !user.images[0].filename.includes('default')) {
        await cloudinary.uploader.destroy(user.images[0].filename);
      }

      user.images = [
        {
          url: req.file.path,
          filename: req.file.filename,
        },
      ];
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      about: user.about,
      images: user.images,
    });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(400).json({ message: 'Failed to update user.', error: error.message });
  }
};

module.exports.loginSuccess = (req, res) => {
  try {
    res.json({
      id: req.user._id,
      username: req.user.username,
      images: req.user.images,
    });
  } catch (error) {
    return res.status(401).json({ error: 'failed to login' });
  }
};

module.exports.userAuthenticate = (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      username: req.user.username,
      about: req.user.about,
      images: req.user.images,
    });
  } else {
    // destroy the session after the logout
    res.status(401).json({
      message: 'Not authenticated',
    });
  }
};

module.exports.visitUser = async (req, res, next) => {
  try {
    const { id: userProfile } = req.params;
    const findUser = await User.findById(userProfile).select('-password');
    const currentUserId = req.user._id;

    const userPosts = await Blogpost.find({ author: userProfile })
      .populate('author', 'username images')
      .sort({ createdAt: -1 })
      .lean();

    let likePostIds = new Set();
    if (currentUserId) {
      const currentUserLikes = await Like.find({ user: currentUserId }).select('post');
      likePostIds = new Set(
        currentUserLikes.filter((like) => like.post).map((like) => like.post.toString())
      );
    }

    const postWithLikes = userPosts.map((post) => ({
      ...post,
      isLiked: likePostIds.has(post._id.toString()),
    }));

    res.json({
      user: findUser,
      posts: postWithLikes,
    });
  } catch (error) {
    console.log('cannot find user');
    res.status(404).json({ success: false, error: 'Cannot find user' });
  }
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      //early return if the user the failed to logout
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};
