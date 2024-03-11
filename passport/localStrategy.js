const passport = require("passport")

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField : 'studentID',
        passwordField : 'password',
    }, async (studentID, password, done) => {
        try {
            const exUser = await User.findOne({where : {studentID}});
            if(exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if(result) {
                    done(null,user);
                } else {
                    done(null,false, {message : "비밀번호가 일치하지 않습니다."});
                }
            } else {
                done(null, false, {message : '가입되지 않은 회원입니다.'});
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    }))
}