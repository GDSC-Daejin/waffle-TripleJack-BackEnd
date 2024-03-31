const { Post } = require('../models/PostDB');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { PostSchema } = require('../models/Post'); // Post 스키마 가져오기

exports.getPostsByDay = async (req, res) => {
    try {
        const { date } = req.query; // "YY-MM-DD" 형식의 날짜

        // 날짜에 해당하는 게시물 조회
        const posts = await Post.find({ date }).exec();

        if (!posts) {
            return res.status(404).json({ message: "해당 날짜의 게시물을 찾을 수 없습니다." });
        }

        // 조회된 게시물 반환
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "서버 오류" });
    }
};

exports.userReady = async (req, res) => {
    try {
        const { postId } = req.body; // 게시물 ID
        const token = req.headers.authorization.split(' ')[1]; // "Bearer TOKEN" 형식 가정
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // 사용자 ID 추출

        // 게시물 조회 및 업데이트
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        // 중복 신청 방지
        if (!post.thisReady.includes(userId)) {
            post.thisReady.push(userId);
            await post.save();
        }

        res.status(200).json({ message: "게시물 신청 완료" });
    } catch (error) {
        res.status(500).json({ message: "서버 오류" });
    }
};

exports.insertPost = async (req, res) => {
    try {
        const { carNum, dep, des, recruit, schoolState, selectDate, goTime } = req.body;
        const userId = req.user.id; // JWT 인증을 통해 얻은 사용자 ID
        const collectionName = `posts_${selectDate}`;

        // 동적으로 컬렉션 이름을 가진 모델 생성
        const PostModel = mongoose.model(collectionName, PostSchema, collectionName);

        // 새 게시물 인스턴스 생성
        const newPost = new PostModel({
            carNum,
            startAddress: dep,
            endAddress: des,
            recruit,
            schoolState,
            goTime,
            writer: userId // 게시글 작성자 ID 추가
            // 기타 필드...
        });

        // 데이터베이스에 저장
        await newPost.save();

        res.status(201).json({ message: "게시글이 성공적으로 생성되었습니다.", postId: newPost._id });
    } catch (error) {
        res.status(500).json({ message: "서버 오류" });
    }
};