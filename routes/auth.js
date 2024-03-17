const {User} = require('../models/User');

// 인증 처리하는 곳
let auth = (req,res,next) => {
   // 클라이언트 쿠케에서 토큰 가져옴.
   let token = req.cookies.x_auth;
   // 토큰 복호화 한 후 유저 찾기
   User.findByToken(token, (err,user)=>{
      if(err) throw err;
      if(!user) return res.json({isAuth : false, error : true});
      // 사용 가능하게 해줌
      req.token = token;
      req.user = user;
      next(); // 미들웨어에서 다음으로 넘어가기
   });
}

module.exports = {auth};