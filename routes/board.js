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

// 게시물 생성 라우트
router.post('/create', isLoggedIn, async (req, res, next) => {
    try {
        // req.body에서 게시물 데이터 추출
        const { content, address, carNumber, whenToGo, tag } = req.body;
        
        // 새 게시물 생성
        await Post.create({ 
            writer: req.user._id, // 로그인한 사용자의 ID
            content,
            address,
            carNumber,
            whenToGo,
            tag,
            insideSchool: req.body.insideSchool === 'on' // 체크박스 값 처리
        });

        res.redirect('/posts'); // 게시물 목록 페이지로 리다이렉트
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 기타 게시물 관련 라우트 (수정, 삭제 등) 구현 가능

module.exports = router;
