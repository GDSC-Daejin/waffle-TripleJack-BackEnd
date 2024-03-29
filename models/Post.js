const mongoose = require('mongoose');
const formatDate = require('./dateUtils');

const today = new Date();

module.exports = (connection) => {
  // Post 스키마 정의
  const postSchema = new mongoose.Schema({
    // 작성자 ID, User 스키마를 참조
    date: {
      type: String,
      default: () => formatDate(new Date()) // 기본값으로 오늘 날짜의 포맷된 문자열 사용
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // 학교 안에 있는지 확인 여부, 기본값은 false
    schoolState: {
      type: Boolean,
      default: false
    },
    // 게시물 내용, 필수 항목
    content: {
      type: String,
      required: true
    },
    // 출발주소
    startAddress: {
      type : String,
      required : true
    },
    // 도착주소
    endAddress: {
      type : String,
      required : true
    },
    // 차량 번호
    carNum: String,
    // 언제 갈 것인지
    goTime: String,
    //신청한 유저
    thisReady : String,
    //확정된 유저
    thisOk: String,
    // 태그
    tag: String
  });

  // 해당 데이터베이스 연결을 사용하여 Post 모델 생성
  const Post = connection.model('Post', postSchema);
  return Post;
};
