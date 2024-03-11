const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // 비밀번호 암호화에 사용될 bcrypt 라이브러리
const saltRounds = 10; // bcrypt 해싱에 사용될 salt 길이

// User 스키마 정의
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    maxlength: 50,
    required: true  // 필수 항목
  },
  studID: {
    type: String,
    maxlength: 8,
    required: true,
    unique: true  // 학번은 고유해야 함
  },
  password: {
    type: String,
    minlength: 8,
    required: true  // 비밀번호 필수, 최소 길이 제한
  },
  callNumber: {
    type: String,
    required: true  // 연락처 필수
  },
  emailCertified: {
    type: Boolean,
    default: false  // 이메일 인증 여부, 기본값은 false
  }
});

// 사용자가 저장되기 전에 비밀번호를 자동으로 해싱
userSchema.pre('save', function(next) {
    const user = this;

    // 비밀번호가 변경되었을 때만 해싱
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash; // 해시된 비밀번호로 변경
                next();
            });
        });
    } else {
        next();
    }
});

// 사용자 제공 비밀번호와 해시된 비밀번호 비교 메소드
userSchema.methods.comparePassword = function(plainPassword, callback) {
    const user = this;

    // 데이터베이스에 저장된 해시와 비교
    bcrypt.compare(plainPassword, user.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// User 모델 정의 및 내보내기
const User = mongoose.model('User', userSchema);
module.exports = User;
