const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');
const authenticateToken = require('../middleware/authenticateToken');

// 특정 날짜의 게시글 조회 라우트
router.get('/selectDay', postController.getPostsByDay);
router.post('/userReady', postController.userReady);
router.post('/insert', authenticateToken, postController.insertPost);

module.exports = router;
