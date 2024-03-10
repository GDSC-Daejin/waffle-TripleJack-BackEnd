const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');

const app = express(); // express 앱 생성
const PORT = 4000; // 서버 포트 번호

let db; // 데이터베이스 변수 선언

// MongoDB 연결 설정
const url = 'mongodb://eozkvnf:mnbvcxz098!@152.70.232.21:27017/carpool?directConnection=true&serverSelectionTimeoutMS=2000&authSource=user&appName=mongosh+2.1.4';
new MongoClient(url).connect().then((client)=>{
    console.log('DB연결성공')
    db = client.db('carpool')
    app.listen(PORT, () => {
        console.log(`Http://localhost:${PORT} 에서 서버 실행중 DB`)
    })
}).catch((err)=>{
    console.log(err)
})

app.use(express.static(__dirname + '/public'));
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'QWERTY1234',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 쿠키 유효시간 설정 (현 1시간)
    store: MongoStore.create({ mongoUrl: url, dbName: 'user' })
}));
app.use(passport.initialize());
app.use(passport.session());



// Passport 로컬 전략 설정
passport.use(new LocalStrategy(async (username, password, done) => {
    let result = await db.collection('User').findOne({ username : username})
    if (!result) {
      return done(null, false, { message: '아이디 DB에 없음' })
    }
    if (await bcrypt.compare(password, result.password)) {
      return done(null, result)
    } else {
      return done(null, false, { message: '비번불일치' });
    }
}));

/* 키 발행 */
passport.serializeUser((user, done) => {
    process.nextTick(() => {
      done(null, { id: user._id, username: user.username })
    })
})

/* 키 해독 */
passport.deserializeUser( async (user, done) => {
    let result = await db.collection('User').findOne({_id : new ObjectId(user.id) })
    delete result.password
    process.nextTick(() => {
      return done(null, result)
    })
})

//로그인 관련 파일 불러오기 허용 같은거
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});



// 라우팅 설정

//get은 서버 데이터를 달라고 할때 사용
//Post는 데이터를 보내고 싶을때
//Update는 보낸 데이터 수정할때
/* 
app.get('/???', (req,res)=>{
    작업물
})

*/

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'/build/index.html'))
})










// 기존 코드 불러오고 아직 수정 전임
app.post('/register', async (req, res) => {
    try { //return 안 쓰면 코드 아래도 다 들어가더라 ;;
        if (req.body.username == '') {
            res.send("<script>alert('아이디를 입력하시지 않았습니다');location.href='/register';</script>");
            return; 
        }
        let existingUser = await db.collection('user').findOne({ username: req.body.username });
        if (existingUser) {
            res.send("<script>alert('이미 존재하는 사용자 이름입니다');location.href='/register';</script>");
            return;
        }
        if (req.body.email == '') {
            res.send("<script>alert('이메일을 입력하시지 않았습니다');location.href='/register';</script>");
            return;
        }
        if (req.body.password == '') {
            res.send("<script>alert('비밀번호를 입력하시지 않았습니다');location.href='/register';</script>");
            return;
        }
        // 비밀번호 해싱
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        // 사용자 정보 저장
        await db.collection('User').insertOne({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
  
      res.redirect('/');
    } catch (e) {
      console.log(e);
      res.status(500).send('서버 에러남 (회원가입 에러).');
    }
});