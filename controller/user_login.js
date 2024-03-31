// 유저 로그인
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Token } = require('../models/UserDB'); // User와 Token 모델 가져오기
const tokenUtils = require('../utils/tokenUtils'); // 토큰 관련 유틸리티 함수



exports.login = async (req, res) => {
  const { studID, password } = req.body;

  try {
    // studID를 이용해 사용자 찾기
    const user = await User.findOne({ studID: studID });
    if (!user) {
      // 사용자가 없는 경우 오류 응답
      return res.status(401).json({ message: "등록되지 않은 유저입니다." });
    }

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // 비밀번호가 일치하지 않는 경우
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    // 사용자 인증 성공 시, JWT 토큰 생성
    const accessToken = tokenUtils.makeAccessToken({ id: user._id });

    // 리프레쉬 토큰 생성 및 저장
    const refreshToken = tokenUtils.makeRefreshToken();
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + 7); // 만료 기간을 7일로 설정
    await new Token({
      userId: user._id,
      token: refreshToken,
      expiresIn: expiresIn
    }).save();

    // 생성된 토큰 응답으로 반환
    return res.status(200).json({ accessToken, refreshToken });

  } catch (error) {
    // 서버 오류 처리
    console.error(error);
    return res.status(500).json({ message: "서버 에러" });
  }
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



