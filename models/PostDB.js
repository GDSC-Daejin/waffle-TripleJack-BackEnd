const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

const uriPost = process.env.POST_DB_URI;
const postDb = mongoose.createConnection(uriPost);

const addDaysAndGetFormattedDate = require('./dataUtils'); 
const postSchema = require('./Post'); 

// 특정 날짜에 대한 Post 모델을 반환하는 함수
const getPostModelByDate = (daysToAdd) => {
  const formattedDate = addDaysAndGetFormattedDate(daysToAdd);
  return postDb.model(formattedDate, postSchema, formattedDate);
};

// 매일 자정에 향후 7일간의 컬렉션 생성
cron.schedule('0 0 * * *', () => {
  for (let i = 0; i < 7; i++) {
    getPostModelByDate(i); // 오늘을 포함한 7일간의 컬렉션 생성
  }
});

module.exports = { postDb, getPostModelByDate };
