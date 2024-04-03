// authenticateToken.js
require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.ACCESS_TOKEN_SECRET;

const authenticateTokenFromCookie = (req, res, next) => {
    // 쿠키에서 토큰 추출
    const token = req.cookies['accessToken']; // 적절한 쿠키 이름으로 변경
    if (!token) {
        return res.sendStatus(401); // 토큰이 없으면 401 에러 반환
    }
    console.log("live-1")
    // JWT 토큰 검증
    jwt.verify(token, JWT_KEY, (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err);
            return res.sendStatus(403);
        }
        console.log("live-2")
        // 검증 성공, 사용자 정보 req 객체에 추가
        req.user = decoded;
        next(); // 다음 미들웨어로 이동
    });
};

module.exports = authenticateTokenFromCookie;

