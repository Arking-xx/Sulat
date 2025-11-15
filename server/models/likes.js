const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Blogpost',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

likeSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
