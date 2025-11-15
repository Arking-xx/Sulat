if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const cors = require('cors');
const User = require('./models/user.js');
const ExpressError = require('./utils/ExpressError.js');
const { frontendUrl } = require('./config.js');
const app = express();

// Router directory
const userRoutes = require('./routes/user.js');
const blogRoutes = require('./routes/blog.js');
const likeRoutes = require('./routes/like.js');

function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on('connected', () => {
      console.log('MongoDB successfully connected');
    });
  } catch (error) {
    console.log('failed to connect to database', error);
  }
}
connectDB();

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(express.json());

const secretkey = process.env.SECRET_KEY;
const sessionConfig = {
  secret: secretkey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        //for username
        const baseUsername = profile.emails[0].value.split('@')[0];
        let username = baseUsername;
        let counter = 1;

        while (await User.findOne({ username })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        //saving to db
        user = new User({
          username: username,
          email: profile.emails[0].value,
          googleId: profile.id,
          about: '',
          images: [
            {
              url:
                profile.photos && profile.photos[0]
                  ? profile.photos[0].value
                  : process.env.DEFAULT_IMAGE,
              filename: 'google-profile-pic',
            },
          ],
        });

        await user.save();
        done(null, user);
      } catch (error) {
        // done(error, null);
        console.log(error.message);
      }
    }
  )
);

passport.deserializeUser(User.deserializeUser());
passport.serializeUser(User.serializeUser());

// users routes
app.use('/api', userRoutes);
// blog routes
app.use('/api', blogRoutes);
//like routes
app.use('/api', likeRoutes);

app.use('/*splat', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  const message = err.message || 'Something Went Wrong!';
  res.status(statusCode).json({ success: false, error: message });
});

module.exports = app;
