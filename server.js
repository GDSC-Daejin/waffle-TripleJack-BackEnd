const express = require("express");
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');


const { User } = require('./models/User'); // Mongoose 모델

const connect = require('./models'); // DB연결 및 스키마 가져오기

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Express 애플리케이션 초기화
const app = express();
const PORT = 4000;

// DB 연결
const userDb = connectUserDb();
const postDb = connectPostDb();

// 미들웨어 설정
app.use(express.static(__dirname + '/public')); // 정적 파일 제공
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱
app.use(methodOverride('_method')); // HTTP 메소드 오버라이드 지원
app.use(session({ // 세션 설정
    secret: 'QWERTY1234', // 세션 비밀키
    resave: false, // 세션 재저장 여부
    saveUninitialized: false, // 초기화되지 않은 세션 저장 여부
    cookie: { maxAge: 60 * 60 * 1000 }, // 쿠키 유효 시간 (1시간)
}));
app.use(passport.initialize()); // Passport 초기화
app.use(passport.session()); // Passport 세션 사용

// Passport 로컬 전략 설정
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        let user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: '아이디 DB에 없음' });
        }
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: '비번불일치' });
        }
    } catch (error) {
        return done(error);
    }
}));

// Passport 시리얼라이즈 & 디시리얼라이즈
passport.serializeUser((user, done) => {
    process.nextTick(() => {
      done(null, { id: user._id, username: user.username });
    });
});
passport.deserializeUser(async (user, done) => {
    try {
        let result = await User.findById(user.id);
        delete result.password; // 비밀번호 제거
        return done(null, result);
    } catch (error) {
        return done(error);
    }
});






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
