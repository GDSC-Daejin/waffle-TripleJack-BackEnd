const express = require('express');
const Post = require('../models/Post'); // 게시물 모델

const router = express.Router();



// 게시물 목록 조회 라우트
router.get('/ViewPost', async (req, res, next) => {
    try {
        // 모든 게시물을 조회하여 반환
        const posts = await Post.find({}).populate('writer');
        res.json(posts);
    } catch (error) {
        console.error(error);
        next(error); // 에러 처리 미들웨어로 이동
    }
});


// 기타 게시물 관련 라우트 (수정, 삭제 등) 구현 가능

module.exports = router;
