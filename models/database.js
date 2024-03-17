const mongoose = require('mongoose');
require('dotenv').config();

const connectUserDb = () => {
  const uri = process.env.USER_DB_URI; // 환경 변수 사용
  const userDb = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  require('./User')(userDb); // User 모델 할당

  userDb.on('error', console.error.bind(console, 'User DB connection error:'));
  userDb.once('open', () => {
    console.log('Connected to User DB');
  });

  return userDb;
};

const connectPostDb = () => {
  const uri = process.env.POST_DB_URI; // 환경 변수 사용
  const postDb = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  require('./Post')(postDb); // Post 모델 할당

  postDb.on('error', console.error.bind(console, 'Post DB connection error:'));
  postDb.once('open', () => {
    console.log('Connected to Post DB');
  });

  return postDb;
};

module.exports = { connectUserDb, connectPostDb };
