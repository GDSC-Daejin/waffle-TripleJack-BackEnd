/* 유저 모델 스키마 가져오기
body parser 이용하여 json 형식으로 요청 body를 가져오고 유저 인스턴스 생성
로그인, 로그아웃 기능 구현 
*/
const express = require("express")
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());

const {User} = require("../models/User"); // 모델 스키마 가져오기
const {auth} = require("../routes/auth"); // 인증 처리 가져오기

const register = () => {
  app.post("/users/register", (req,res)=> {
  // 회원 가입 할 때 필요한 정보를 client에서 가져오고 데이터베이스에 넣기
  const user = new User(req.body); // body parser 이용 json 형식으로 정보 가져옴

  user.save((err,userInfo)=> {
    // 디비에서 오는 메소드
    if (err) return res.json({success : false, err});
    return res.status(200).json({ // status 200 -> 성공 
      success : true,
    });
  });
});
}

const login = () => {
// 로그인 기능 구현
app.post("/users/login",(req,res)=>{
  // 요청된 학번을 DB에 있는지 찾기
  User.findOne(
    {
      studID : req.body.studID,
    },
    (err,user) => {
      if (!user) {
        return res.json({
          loginSuccess : false,
          message : "해당 학번에 일치하는 사용자가 없습니다.",
        });
      }
      // 요청된 학번이 DB에 있다면 password가 맞는지 확인
      user.generateToken((err,user)=>{
        if (err) return res.status(400).send(err);
        // 토큰 저장
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess : true, userId : user._id});
      })
    }
  )
})
}

const logout = () => {
//로그아웃 기능
// user의 id에 해당하는 token 없애기
app.get("/users/logout", auth, (req,res)=> {
  User.findOneAndUpdate({_id : req.user._id}, {token : ""}, (err,user)=>{
    if(err) return res.json({success : false, err});
    return res.status(200).send({success : true});
  })
})
}


module.exports = {register,login, logout};

