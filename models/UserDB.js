const mongoose = require('mongoose');
require('dotenv').config(); // 환경 변수를 로드하기 위해 dotenv 모듈 사용

const uriUser = process.env.USER_DB_URI; // User 데이터베이스의 URI
const userDb = mongoose.createConnection(uriUser, { useNewUrlParser: true, useUnifiedTopology: true }); // User DB에 연결

const User = require('./User')(userDb); // User 모델을 정의하는데 사용되는 스키마

// Token 스키마 정의
const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // User 모델의 ID를 참조
    required: true,
    ref: 'User'
  },
  token: {
    type: String, // 실제 토큰 문자열
    required: true
  },
// 만료 시간 필드 추가
    expiresIn: {
        type: Date,
        required: true
    }
  // 필요에 따라 만료 시간(expiration) 등의 추가 필드를 정의할 수 있음
});

// Token 모델 정의
const Token = userDb.model('tokens', tokenSchema); // 'tokens' 컬렉션에 대한 모델

module.exports = { userDb, User, Token }; // 모듈로 내보내기, 필요한 곳에서 이 모델들을 사용할 수 있음
