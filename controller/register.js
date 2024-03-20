const getConnection = require('../models/database');
const bcrypt = require('bcrypt');


exports.register = (req,res) => {
    const db = getConnection.connectUserDb.connect();

    const user = new User(req.body);

    user.save((err,userInfo) => {
        if(err) return res.json({success : false, err});
        return res.status(200).json({
            success : true
        })
    })

    // 사용자 저장 전 비밀번호 자동 해싱 미들웨어
    userSchema.pre('save', function(next) {
        const user = this;
        
        // 비밀번호 변경 시에만 해싱
        if (user.isModified('password')) {
            // Salt 생성 및 비밀번호 해싱
            bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash; // 해시된 비밀번호 저장
                next();
            });
            });
        } else {
            next();
        }
        });
    
    // 사용자 제공 비밀번호와 해시된 비밀번호 비교 메소드
    userSchema.methods.comparePassword = function(plainPassword, callback) {
    // 입력된 비밀번호와 저장된 해시 비밀번호 비교
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
    };
}