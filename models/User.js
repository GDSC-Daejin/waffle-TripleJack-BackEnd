const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User 스키마 정의 함수
module.exports = function(dbConnection) {
    // User 스키마 정의
    const userSchema = new mongoose.Schema({
        // 사용자 이름
        userName: {
            type: String,
            required: true
        },
        // 사용자 학번 (고유하고 최대 8자리)
        studID: {
            type: String,
            required: true,
            unique: true,
            maxlength: 8
        },
        // 사용자 비밀번호 (최소 8자리)
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        // 사용자 전화번호
        callNum: {
            type: String,
            required: true
        },
        // 이메일 인증 여부 (기본값 true)
        emailCertified: {
            type: Boolean,
            default: true
        },
        // 사용자가 신청한 게시물 목록
        allReady: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
            default: []
        },
        // 사용자가 승인된 게시물 목록
        allOk: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
            default: []
        },
        // 사용자가 작성한 게시물 목록
        posts: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
            default: []
        }
    });

    // 비밀번호 해싱 미들웨어 (사용자 저장 전 실행)
    userSchema.pre('save', function(next) {
        const user = this;

        // 비밀번호 변경 시에만 해싱
        if (!user.isModified('password')) return next();

        // Salt 생성 및 비밀번호 해싱
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash; // 해시된 비밀번호 저장
                next();
            });
        });
    });

    // 비밀번호 비교 메소드
    userSchema.methods.comparePassword = function(candidatePassword, callback) {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) return callback(err);
            callback(null, isMatch);
        });
    };

    // dbConnection을 사용하여 User 모델 생성 및 반환
    return dbConnection.model('User', userSchema, 'user');
};
