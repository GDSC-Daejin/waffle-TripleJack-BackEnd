const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (connection) => {
  // User 스키마 정의
  const userSchema = new mongoose.Schema({
    // 사용자 이름, 최대 길이 50, 필수 입력
    userName: {
      type: String,
      maxlength: 50,
      required: true
    },
    // 학번, 최대 길이 8, 고유 값, 필수 입력
    studID: {
      type: String,
      maxlength: 8,
      required: true,
      unique: true
    },
    // 비밀번호, 최소 길이 8, 필수 입력
    password: {
      type: String,
      minlength: 8,
      required: true
    },
    // 연락처, 필수 입력
    callNumber: {
      type: String,
      required: true
    },
    // 이메일 인증 여부, 기본값은 true (아직 인증 로직 안만듦)
    emailCertified: {
      type: Boolean,
      default: true
    },
  });

  // 사용자 저장 전 비밀번호 자동 해싱 미들웨어
  userSchema.pre('save', function(next) {
    const user = this;

    // 비밀번호 변경 시에만 해싱
    if (user.isModified('password')) {
      // Salt 생성 및 비밀번호 해싱
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
          user.password = hash; // 해시된 비밀번호 저장
          next();
        });
      });
    } else {
      next();
    }
  });

  // 사용자 제공 비밀번호와 해시된 비밀번호 비교 메소드
  userSchema.methods.comparePassword = function(plainPassword, callback) {
    // 입력된 비밀번호와 저장된 해시 비밀번호 비교
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
    });
  };

  // User 모델 정의 및 해당 DB 연결에 모델 연결
  const User = connection.model('User', userSchema);
  return User;
};
