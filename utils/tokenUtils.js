//토큰 관련 로직
require('dotenv').config(); //dotenc import
const getConnection = require('../models/database');
const jwt = require('jsonwebtoken'); //jwt import
const JWT_KEY = process.env.ACCESS_TOKEN_SECRET // SECRET_KEY import

//accessToken 발급 함수
exports.makeAccessToken = (Object) => {
    const token = jwt.sign(
        Object,
        JWT_KEY,
        {expiresIn : "1h"} //accessToken 만료기간 1시간
    );
    console.log(token);
    return token;
};

//refreshToken 발급 함수
exports.makeRefreshToken = () => {
    const refreshToken = jwt.sign(
        {},
        JWT_KEY,
        {
            algorithm : "HS256",
            expiresIn :  "7d" // refreshToken 만료기간 1주일
        }
    );
    console.log(refreshToken);
    return refreshToken;
};

// refresh token 유효성 검사
exports.refreshVerify = async(token, studID) => {
    try {
        await getConnection.connectUserDb.connect(); // mongodb 연결
        
        const db = getConnection.connectUserDb.db('User'); // 데이터베이스 선택
        const collection = db.collection('User'); // 컬렉션 선택

        //DB에서 refreshToken 조회
        const result = await collection.findOne('User');
        // 조회한 refreshToken과 받은 token이 일치하는지 확인
        if(token===result.token) {
            try{
                jwt.verify(token,JWT_KEY); // refresh 검증
                return true;
            }
            catch(err) {
                return false; //refreshToken 검증 에러
            }
        } else {
            return false; // token 불일치
        } 
    } catch(err) {
        console.log(err) // DB에러
        return false;
    } finally {
        await getConnection.connectUserDb.close(); // DB 연결 닫기
    }
};

//access token 유효성 검사
exports.verify = (token) => {
    try {
        const decoded = jwt.verify(token,JWT_KEY);
        return {
            ok : true,
            id : decoded.id
        };
    } catch (errer) {
        return {
            ok : false,
            message : error.message,
        };
    }
};