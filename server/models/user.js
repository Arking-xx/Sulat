const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    about: {
      type: String,
      maxLength: 200,
      default: '',
    },

    images: {
      type: [ImageSchema],
      default: [
        {
          url: process.env.DEFAULT_IMAGE,
          filename: process.env.CLOUDINARY_FILENAME,
        },
      ],
    },
    googleId: {
      type: String,
      sparse: true,
    },
  },
  opts
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'username',
  usernameUnique: true,
  usernameLowerCase: true,
});
module.exports = mongoose.model('User', userSchema);
module.exports.ImageSchema = ImageSchema;
module.exports.opts = opts;
