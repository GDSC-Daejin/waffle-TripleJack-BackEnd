const mongoose = require('mongoose');
const cron = require('node-cron'); // node-cron 라이브러리를 사용해 정기적인 작업을 스케줄링
require('dotenv').config(); // 환경 변수 사용을 위한 dotenv

const uriPost = process.env.POST_DB_URI; // Post 데이터베이스의 URI
const postDb = mongoose.createConnection(uriPost, { useNewUrlParser: true, useUnifiedTopology: true }); // Post DB 연결

const formatDate = require('./utils/dataUtils'); // 날짜를 'YY-MM-DD' 형식으로 포매팅하는 함수
const postSchema = require('./models/Post'); // Post 스키마 정의

// 특정 날짜에 대한 Post 모델을 반환하는 함수
const getPostModelByDate = (date) => {
  const formattedDate = formatDate(date); // 입력받은 날짜를 'YY-MM-DD' 형식으로 포매팅
  return postDb.model(formattedDate, postSchema, formattedDate); // 포매팅된 날짜를 이름으로 하는 Post 모델 반환
};

// 매일 자정에 실행되어 향후 7일간의 컬렉션을 생성하는 cron 작업
cron.schedule('0 0 * * *', () => { // 매일 자정에 실행
  createWeeklyCollections(new Date()); // 현재 날짜부터 일주일치 컬렉션 생성
});

// 특정 날짜로부터 일주일간의 날짜별 컬렉션을 생성하는 함수
const createWeeklyCollections = (startDate) => { // 수정 필요 dataUtils 에 날짜 값을 넣고 돌려야함 ㅠㅠ
  const oneDay = 24 * 60 * 60 * 1000; // 하루의 밀리초 수
  const start = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const date = new Date(start.getTime() + (i * oneDay)); // 시작 날짜부터 7일간 날짜 계산
    getPostModelByDate(date); // 각 날짜에 대한 Post 모델 생성
  }
};

module.exports = { postDb, getPostModelByDate }; // 모듈로 내보내기
