const express = require("express"); // Express 프레임워크
const methodOverride = require('method-override'); // HTTP 메소드 오버라이드 지원
const session = require('express-session'); // 세션 관리
const passport = require('passport'); // 사용자 인증
const LocalStrategy = require('passport-local').Strategy; // Passport 로컬 전략
const bcrypt = require('bcrypt'); // 비밀번호 해싱
const MongoStore = require('connect-mongo'); // 세션 데이터를 MongoDB에 저장
const mongoose = require('mongoose'); // MongoDB ODM

const { User } = require('./models/User'); // Mongoose 모델

const connect = require('./models'); // DB연결 및 스키마 가져오기

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// socket.io에 서버 정보 넘겨주고 구동
const SocketIO = require('socket.io');

//서버 연결, path는 프론트와 일치시켜야함
const io = SocketIO(server, {path : '/socket.io'})

// Express 애플리케이션 초기화
const app = express();
const PORT = 4000; // 서버 포트 번호
connect(); // DB connect

// MongoDB URL
const mongoDbUrl = 'mongodb://eozkvnf:mnbvcxz098!@152.70.232.21:27017/carpool?authSource=user';

// MongoDB 연결 및 서버 시작
mongoose.connect(mongoDbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Mongoose를 통한 MongoDB 연결 성공');
  app.listen(PORT, () => {
    console.log(`Http://localhost:${PORT} 에서 서버 실행중`);
  });
})
.catch((err) => {
  console.log('Mongoose 연결 실패:', err);
});

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
    store: MongoStore.create({ mongoUrl: mongoDbUrl, dbName: 'user' }) // 세션 저장소 설정
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
    res.locals.user = req.user; // 현재 로그인한 사용자 정보 전달
    next();
});

// 사용자 등록 라우트
app.post("/src/register", (req, res) => {
    const user = new User(req.body); // 요청 데이터로 새 사용자 생성
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

// 로그인 처리 라우트
app.post("/src/login", (req, res) => {
    User.findOne({ studentID: req.body.studentID }, (err, user) => {
        if (!user) {
            return res.json({ loginSuccess: false, message: "학번에 해당하는 유저가 없습니다." });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });
            }
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, studentID: studentID });
            });
        });
    });
});

// 홈페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html')); // 홈페이지 파일 제공
});

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);


