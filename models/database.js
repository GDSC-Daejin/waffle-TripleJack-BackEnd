// Database 연결 코드
//mongoose 와 monogdb 연결함

const mongoose = require('mongoose');

const {MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.env; // env 파일 만들어서 ID,PASSWORD 보호
const mongoDbUrl = 'mongodb://eozkvnf:mnbvcxz098!@152.70.232.21:27017/carpool?authSource=user'; // 아이디, 비번 부분 ${} 형태로 바꿀 것

module.exports = () => {
  const connect = () => {
    if (NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    mongoose.connect(mongoDbUrl, {
      dbName : 'carpool',
    }, (error) => {
      if(error) {
        console.log('mongodb 연결 에러', error);
      } else {
        console.log('mongodb 연결 성공');
      }
    });
  };
  connect();
  
  mongoose.connection.on('error', (error) => {
    console.error('mongodb 연결 에러', error);
  });
  mongoose.connection.on('disconected', ()=>{
    console.error('mongodb 연결이 끊겼습니다. 연결을 재시도 합니다.');
    connect();
  })

  require('./User');
  require('./Post');
  require('./chat');
  require('./room');
};