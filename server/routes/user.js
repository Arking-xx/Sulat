const express = require('express');
const router = express.Router();
const usersControllers = require('../controllers/user.js');
const passport = require('passport');
const multer = require('multer');
const { profilePicStorage } = require('../cloudinary/index.js');
const upload = multer({ storage: profilePicStorage });
const { frontendUrl } = require('../config.js');

const { checkValidation, validationLogin } = require('../middleware/usersMiddleware.js');
const { isAuthenticated } = require('../middleware/authMiddleware.js');

router.get('/auth/check-session', (req, res) => {
  res.json({ session: req.session, user: req.user });
});

router.get(
  '/auth/google',
  usersControllers.InitializeGoogle,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${frontendUrl}/signin?error=auth_failed`,
    successRedirect: `${frontendUrl}/posts`,
    session: true,
  }),
  usersControllers.googleCallbackCustoms
);

router
  .route('/users')
  .get(usersControllers.checkUsernameAvaibility)
  .post(usersControllers.createUser);

router.put('/user/update', isAuthenticated, upload.single('image'), usersControllers.userUpdate);
router.get('/profile/user/:id', isAuthenticated, usersControllers.visitUser);

router.post('/auth/login', validationLogin, checkValidation, (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: info?.message || 'Invalid username or password' });
    }

    req.login(user, (error) => {
      if (error) return next(error);
      res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
        },
      });
    });
  })(req, res, next);
});

router.post('/auth/logout', usersControllers.logout);
router.get('/auth/me', usersControllers.userAuthenticate);

module.exports = router;
