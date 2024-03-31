const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  studID: {
    type: String,
    required: true,
    unique: true,
    maxlength: 8
  },
  password: {
    type: String,
    required: true,
    minlength: 8 // 비밀번호 최소 길이 8자리
  },
  callNum: {
    type: String,
    required: true
  },
  emailCertified: {
    type: Boolean,
    default: true
  },
  allReady: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // 신청한 게시글의 ObjectId 배열
    default: []
  },
  allOk: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // 승인된 게시글의 ObjectId 배열
    default: []
  },
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // 작성한 게시글의 ObjectId 배열
    default: []
  }
});

// 비밀번호를 암호화하는 미들웨어
userSchema.pre('save', function(next) {
  // 비밀번호 필드가 변경되었는지 확인
  if (!this.isModified('password')) return next();

  // 솔트 생성 및 비밀번호 해시
  bcrypt.genSalt(10, (err, salt) => { // 솔트 생성, 여기서 10은 솔트의 복잡도
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => { // 비밀번호 해시
      if (err) return next(err);
      this.password = hash; // 생성된 해시로 비밀번호 변경
      next(); // 저장 과정 계속 진행
    });
  });
});

module.exports = mongoose.model('User', userSchema);
