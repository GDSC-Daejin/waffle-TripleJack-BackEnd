// 유저 로그인

require('dotenv').config();
const {connectUserDb} = require('../models/database');
const TokenUtils = require('../utils/tokenUtils');
const jwt = require('jsonwebtoken');

async function insertToken(userId, refreshToken, db) {
  const tokenCollection = db.collection('tokens') // token 컬렉션 선택
  const tokenDocument = {
    userId : userId,
    token : refreshToken
  };
  return await tokenCollection.insertOne(tokenDocument);
}

exports.login = async(req,res) => {
  const {studID, password} = req.body;

  //DB 연결
  const db = await connectUserDb();

  // studID로 사용자 찾기
  const user = await findeUserByStudID(studID,db);

  // user가 없는 경우
  if(!user) {
    return res.status(401).send('학번이 일치하지 않습니다')
  }
  //비밀번호가 일치하지 않는 경우
  if(password !== user.password) {
    return res.status(401).send('비밀번호가 일치하지 않습니다.')
  }

  //studID, password 같을 경우 토큰 발급
  const accessToken = TokenUtils.makeAccessToken({id : studID});
  const refreshToken = TokenUtils.makeRefreshToken();

  //refreshToken, id DB에 저장
  const result_insert = await insertToken(studID,refreshToken,db);

  if(result_insert.state === false) return res.status(401).send("DB에 저장 실패")

  return res.status(200).send({studID,accessToken,refreshToken})

};

const successResponse = (code,data) => {
  return({
    code : code,
    data : data,
  })
}

const failResponse = (code,message) => {
  return({
    code : code,
    message : message,
  })
}

exports.refresh = async(req,res) => {
  // access, refresh token이 헤더에 담겨 온 경우
  if(req.headers["authorization"] && req.headers["refresh"]) {
    const accessToken = req.headers["authorization"].split(" ")[1];
    const refreshToken = req.headers["refresh"];

    // access token 검증 -> expired여야 함.
    const authResult = TokenUtils.verify(accessToken);

    // access token 디코딩 studID를 가져옴.
    const decoded = jwt.decode(accessToken);

    // 디코딩 결과가 없으면 권한 없음 응답
    if(!decoded) {
      res.status(401).send(failResponse(401,"권한이 없습니다."));
    }
    // access token 만료 시
    if(authResult.ok === false && authResult.message === "jwt expired") {
      // acceess token 만료, refresh token 만료 경우 -> 다시 로그인
      const refreshResult = await TokenUtils.refreshVerify(refreshToken,decoded.id);
      if(refreshResult === false) {
        res.status(401).send(failResponse(401,"다시 로그인 해주세요."))
      }
      else {
        // access token 만료 refresh token 만료 x -> 새로운 access token 발급
        const newAccessToken = TokenUtils.makeAccessToken({id:decoded.id});

        res.status(200).send(successResponse(
          200,{
            accessToken : newAccessToken,
            refreshToken,
          }
        ));
      }
    } else {
      // access token 만료 x-> refresh 할 필요 x
      res.status(400).send(failResponse(400,"Access token 만료되지 않음"));
    }
  } else {
    // access token 또는 refresh token이 헤더에 없는 경우
    res.status(401).send(failResponse(400,"Refresh token 필요함. Access token,Refresh token 필요"));
  }
}



