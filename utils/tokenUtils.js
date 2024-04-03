require('dotenv').config(); // dotenv import
const { userDb } = require('../models/UserDB'); // UserDB에서 연결 정보 가져오기
const jwt = require('jsonwebtoken'); // jwt import
const JWT_KEY = process.env.ACCESS_TOKEN_SECRET; // SECRET_KEY import

// accessToken 발급 함수
exports.makeAccessToken = (user) => {
    const token = jwt.sign(
        { id: user.id.toString('hex') },
        JWT_KEY,
        { expiresIn: "1h" } // accessToken 만료기간 1시간
    );
    
    console.log(`accessToken : ${token}`);
    return token;
};

// refreshToken 발급 함수
exports.makeRefreshToken = () => {
    const refreshToken = jwt.sign(
        {},
        JWT_KEY,
        {
            algorithm: "HS256",
            expiresIn: "7d" // refreshToken 만료기간 1주일
        }
    );
    console.log(`refreshToken : ${refreshToken}`);
    return refreshToken;
};

// refresh token 유효성 검사
exports.refreshVerify = async (token, studID) => {
    try {
        // MongoDB 연결 및 컬렉션 선택
        const collection = userDb.collection('user'); // 'users' 컬렉션 사용

        // DB에서 refreshToken 조회
        const result = await collection.findOne({ userId: studID });
        if (token === result.token) {
            try {
                jwt.verify(token, JWT_KEY); // refresh 검증
                return true;
            } catch (err) {
                return false; // refreshToken 검증 에러
            }
        } else {
            return false; // token 불일치
        }
    } catch (err) {
        console.log(err); // DB 에러
        return false;
    }
};

// access token 유효성 검사
exports.verify = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        return {
            ok: true,
            id: decoded.id
        };
    } catch (error) {
        return {
            ok: false,
            message: error.message
        };
    }
};
