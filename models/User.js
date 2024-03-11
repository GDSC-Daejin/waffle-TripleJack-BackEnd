// User 스키마

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userName : {
        type : String,
        maxlength : 50,
    },
    studentID : {
        type : String,
        maxlength : 8,
    },
    password : { 
        type : String,
        minlength : 8
    },
    account : {
        type : String,
        maxlength : 14,
    },
    role : {
        // 관리자와 유저 구분
        type : Number,
        default : 0, // 0은 유저, 1은 관리자
    },
    image : String,
    token : {
        type : String,
    },
    tokenExp : {
        type : Number,
    },
})

const User = mongoose.model("User", UserSchema); // 스키마 모델로 감쌈

const bcrypt = require('bcrypt'); // 비밀번호 암호화
const saltRounds = 10; // salt 몇 글자로 할지

// save하기 전에 비밀번호 암호화 시킴.
UserSchema.pre("save", function(next) {
    const user = this;
    // 비밀번호를 바꿀 때만 암호화 시킨다.
    if(user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function(err,salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function(err,hash) {
                if (err) return next (err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

// 비밀번호를 비교하는 메소드
UserSchema.methods.comparePassword = function(plainPassword, cb) {
    const user = this;
    // plainPassword를 암호화해서 db에 있는 비밀번호와 비교
    bcrypt.compare(plainPassword, user.password, function(err,isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

// 토큰 생성 메소드
const jwt = require('jsonwebtoken'); // 토큰 생성하기

UserSchema.methods.generateToken = function(cb) {
    const user = this;
    //jsonwebtoken을 이용해서 token을 생성하기
    const token = jwt.sign(studentID.toHexString(), "secretToken");
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

module.exports = {User}; // 다른 곳에서도 사용 가능하게 export