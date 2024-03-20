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
    callNum: {
      type: String,
      required: true
    },
    allReady : String,
    allOk : String
    // 이메일 인증 여부, 기본값은 true (아직 인증 로직 안만듦)
    // emailCertified: {
    //   type: Boolean,
    //   default: true
    // }
  });
  // User 모델 정의 및 해당 DB 연결에 모델 연결
  const User = connection.model('User', userSchema);
  return User;
};
