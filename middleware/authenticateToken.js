const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // "Bearer TOKEN" 형식 가정
    if (!token) return res.sendStatus(401); // 토큰 없음

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // 토큰 무효
        req.user = user; // 사용자 정보 req 객체에 추가
        next();
    });
};

module.exports = authenticateToken;
