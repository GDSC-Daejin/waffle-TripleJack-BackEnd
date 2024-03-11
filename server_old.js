const express = require("express");
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');


const app = express(); // express 앱 생성
const PORT = 4000; // 서버 포트 번호

const {User} = require('./models/User'); // 모델 스키마 가져오기

const mongoose = require('mongoose');
const mongoDbUrl = 'mongodb://eozkvnf:mnbvcxz098!@152.70.232.21:27017/carpool?authSource=user';

// MongoDB 연결 설정
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









app.use(express.static(__dirname + '/public'));
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'QWERTY1234',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 쿠키 유효시간 설정 (현 1시간)
    store: MongoStore.create({ mongoUrl: mongoDbUrl, dbName: 'user' })
}));
app.use(passport.initialize());
app.use(passport.session());



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

/* 키 발행 */
passport.serializeUser((user, done) => {
    process.nextTick(() => {
      done(null, { id: user._id, username: user.username })
    })
})

/* 키 해독 */
passport.deserializeUser(async (user, done) => {
    try {
        let result = await User.findById(user.id);
        delete result.password;
        return done(null, result);
    } catch (error) {
        return done(error);
    }
});


//로그인 관련 파일 불러오기 허용 같은거
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});



// 라우팅 설정
app.post("/src/register", (req,res)=>{
    const user = new User(req.body);

    user.save((err, userInfo) => {
        // 몽고디비에서 오는 메소드
        if(err) return res.json({success : false, err});
        return res.status(200).json({
            success : true,
        })
    })
})

app.post("/src/login", (req,res)=>{
    //요청된 학번을 데이터베이스에 있는지 찾는다.
    User.findOne(
        {
            studentID : req.body.studentID,
        },
        (err,user) => {
            if(!user) {
                return res.json({
                    loginSuccess : false,
                    message : "학번에 해당하는 유저가 없습니다.",
                });
            }
            // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
            user.comparePassword(req.body.password, (err,isMatch)=>{
                if(!isMatch) {
                    return res.json({
                        loginSuccess : false,
                        message : "비밀번호가 틀렸습니다.",
                    });
                }
                // 비밀번호까지 맞다면 토큰 생성
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    // 쿠키, 로컬스트리지, 세션 등에 토근 저장함.
                    res
                        .cookie("x_auth", user.token)
                        .status(200)
                        .json({loginSuccess : trun , studentID : studentID});
                })
            })
        }
    )
})


//get은 서버 데이터를 달라고 할때 사용
//Post는 데이터를 보내고 싶을때
//Update는 보낸 데이터 수정할때
/* 
app.get('/???', (req,res)=>{
    작업물
})

*/

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'./build/index.html'))
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