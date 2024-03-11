const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  writeDate: {
    type: Date,
    default: Date.now
  },
  writer: { // 이 부분은 수정이 좀 필요할듯
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  insideSchool: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: true
  },
  address: String,
  carNumber: String,
  whenToGo: String,
  tag: String
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
