const { User } = require('../models/UserDB'); // User 모델 가져오기

// 회원가입 처리 함수
exports.register = async (req, res) => {
  const { studID, password, userName, callNum } = req.body;

  try {
    // 동일한 학번을 가진 사용자가 이미 있는지 확인
    const existingUser = await User.findOne({ studID: studID });
    if (existingUser) {
      return res.status(400).json({ message: "이미 등록된 학번입니다." });
    }

    // 새 사용자 객체 생성
    const newUser = new User({
      studID,
      password, // 비밀번호는 User 모델의 pre save 미들웨어에서 해시됨
      userName,
      callNum,
      // 나머지 필드는 스키마의 기본값으로 설정됨
    });

    // 사용자 데이터베이스에 저장
    await newUser.save();

    // 회원가입 성공 응답
    res.status(201).json({ message: "회원가입 성공" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};
