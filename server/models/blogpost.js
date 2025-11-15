const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ImageSchema, opts } = require('./user.js');

const blogPost = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    images: [ImageSchema],
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    ...opts,
  }
);

module.exports = mongoose.model('Blogpost', blogPost);
