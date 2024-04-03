const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authenticateTokenFromCookie = require('../middleware/authenticateToken');


// 유저 정보 조회 라우트에 JWT 인증 미들웨어 적용
router.get('/info', authenticateTokenFromCookie, userController.getUserInfo);
router.post('/driverOrderOk', userController.driverOrderOk);

module.exports = router;
