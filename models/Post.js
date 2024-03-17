const mongoose = require('mongoose');

module.exports = (connection) => {
  // Post 스키마 정의
  const postSchema = new mongoose.Schema({
    // 게시물 작성 날짜, 기본값은 현재 시간
    writeDate: {
      type: Date,
      default: Date.now
    },
    // 작성자 ID, User 스키마를 참조
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // 학교 안에 있는지 확인 여부, 기본값은 false
    insideSchool: {
      type: Boolean,
      default: false
    },
    // 게시물 내용, 필수 항목
    content: {
      type: String,
      required: true
    },
    // 주소
    address: String,
    // 차량 번호
    carNumber: String,
    // 언제 갈 것인지
    whenToGo: String,
    // 태그
    tag: String
  });

  // 해당 데이터베이스 연결을 사용하여 Post 모델 생성
  const Post = connection.model('Post', postSchema);
  return Post;
};
