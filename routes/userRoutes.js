const express = require('express');
const router = express.Router();
const User = require('../models/User');
const tokenUtils = require('../utils/tokenUtils'); // 가정한 경로, 실제 경로에 맞게 수정해주세요.

// 사용자 정보 조회 로직
router.get('/info', async (req, res) => {
  // 요청 헤더에서 토큰 추출
  const token = req.headers.authorization?.split(" ")[1];

  // 토큰이 없다면 에러 메시지 반환
  if (!token) {
    return res.status(401).json({ message: "토큰이 필요합니다." });
  }

  // 토큰 유효성 검사
  const tokenVerification = tokenUtils.verify(token);
  if (!tokenVerification.ok) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }

  // 토큰에서 사용자 ID 추출
  const userId = tokenVerification.id;

  try {
    // 사용자 ID로 사용자 정보 조회
    const user = await User.findById(userId);

    // 사용자 정보가 없다면 에러 메시지 반환
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 사용자 정보 반환 (비밀번호 제외)
    res.json({
      userName: user.userName,
      studID: user.studID,
      callNum: user.callNum,
      emailCertified: user.emailCertified,
      // 추가적으로 반환하고 싶은 정보들...
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

module.exports = router;
