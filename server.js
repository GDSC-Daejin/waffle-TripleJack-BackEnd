const express = require("express");
const methodOverride = require('method-override');
// const session = require('express-session');
const user_login = require('./controller/user_login');
const register = require('./controller/register');
const database = require('./models/database');

// Express 애플리케이션 초기화
const app = express();
const PORT = 4000;

// DB 연결
const userDb = database.connectUserDb();
const postDb = database.connectPostDb();


// 미들웨어 설정
app.use(express.static(__dirname + '/public')); // 정적 파일 제공
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱
app.use(methodOverride('_method')); // HTTP 메소드 오버라이드 지원

// app.use(session({ // 세션 설정
//     secret: 'QWERTY1234', // 세션 비밀키
//     resave: false, // 세션 재저장 여부
//     saveUninitialized: false, // 초기화되지 않은 세션 저장 여부
//     cookie: { maxAge: 60 * 60 * 1000 }, // 쿠키 유효 시간 (1시간)
// }));




// 로그인 상태 공유 미들웨어
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// ... 나머지 라우트 및 설정 ...

// 홈페이지 라우트
app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, './build/index.html')); // 홈페이지 파일 제공
    res.send("Hello");
});

app.get('/join',(req,res)=>{
    res.send('회원가입 창으로 가주세용'); //send는 바꿀 예정
})

//로그인 라우트
app.post('/login', user_login.login);  // 로그인 시 login 경로 사용

//access 토큰 재발급 라우트
app.get('/refresh', user_login.refresh); // 토큰 재발급 시 refresh 경로 사용





// Test 라우트 설정
app.get('/test', async (req, res) => {
    try {
        // User 모델과 Post 모델 로드
        const User = userDb.model('User');
        const Post = postDb.model('Post');

        // 임시 사용자 생성 및 저장
        const dummyUser = new User({
            userName: "홍길동",
            studID: "12345678",
            password: "password",
            callNumber: "010-1234-5678",
            emailCertified: true
        });
        await dummyUser.save();

        // 임시 게시글 생성 및 저장
        const dummyPost = new Post({
            writeDate: new Date(),
            writer: dummyUser._id,
            content: "임시 게시글 내용",
            address: "경기도-포천시-포천시청",
            carNumber: "12가3456",
            whenToGo: "2024-03-21",
            tag: "포천"
        });
        await dummyPost.save();

        res.send("Test data created successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating test data");
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
