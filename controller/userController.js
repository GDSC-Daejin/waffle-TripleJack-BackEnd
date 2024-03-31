const { User } = require('../models/UserDB');
const { Post } = require('../models/PostDB');

exports.getUserInfo = async (req, res) => {
    try {
        // JWT 토큰에서 사용자 ID 추출
        const userId = req.user.id; 

        // 데이터베이스에서 사용자 정보 조회 및 관련 문서 채우기
        const user = await User.findById(userId)
            .populate({
                path: 'posts', 
                populate: {
                    path: 'thisReady',
                    model: 'User' // 'thisReady' 필드에서 참조하는 모델 명시
                }
            })
            .populate('allReady')
            .populate('allOk');

        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        // 필요한 사용자 정보만 응답으로 반환
        res.json({ 
            userName: user.userName, 
            studID: user.studID, 
            callNum: user.callNum, 
            allReady: user.allReady,
            allOk: user.allOk,
            posts: user.posts
        });
    } catch (error) {
        res.status(500).json({ message: "서버 오류" });
    }
};

exports.driverOrderOk = async (req, res) => {
    try {
        const { postId, userId } = req.body;

        // 게시물 조회
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        // thisReady에서 userId 제거
        const index = post.thisReady.indexOf(userId);
        if (index > -1) {
            post.thisReady.splice(index, 1);
        } else {
            return res.status(404).json({ message: "해당 사용자는 이 게시물에 신청하지 않았습니다." });
        }

        // thisOk에 userId 추가
        if (!post.thisOk.includes(userId)) {
            post.thisOk.push(userId);
        }

        // 게시물 업데이트
        await post.save();

        res.status(200).json({ message: "탑승자 승인 완료" });
    } catch (error) {
        res.status(500).json({ message: "서버 오류" });
    }
};
