const express = require('express');
const router = express.Router();
const postController = require('../controller/postController');

// 특정 날짜의 게시글 조회 라우트
router.get('/selectDay', postController.getPostsByDay);
router.post('/userReady', postController.userReady);
router.post('/insert', postController.insertPost);

module.exports = router;
