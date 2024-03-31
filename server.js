const express = require("express");
const methodOverride = require('method-override');

// 컨트롤러 및 데이터베이스 모듈 가져오기
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { userDb } = require('./models/UserDB');
const { postDb } = require('./models/PostDB');

// Express 애플리케이션 초기화
const app = express();
const PORT = 4000;

// 미들웨어 설정
app.use(express.json()); // JSON 요청 본문 처리
app.use(methodOverride()); // HTTP 메소드 오버라이드

// 라우트 설정
app.use('/user', userRoutes);
app.use('/post', postRoutes);

// DB 연결 확인 (UserDB와 PostDB)
userDb.on('error', console.error.bind(console, 'MongoDB 연결 에러:'));
postDb.on('error', console.error.bind(console, 'MongoDB 연결 에러:'));

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
