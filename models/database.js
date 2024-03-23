const mongoose = require('mongoose');
require('dotenv').config();

const uriUser = process.env.USER_DB_URI;
const uriPost = process.env.POST_DB_URI;


const connectUserDb = () => {
  const userDb = mongoose.createConnection(uriUser, {useNewUrlParser : true, useUnifiedTopology : true});
  require('./User')(userDb);

  userDb.on('error', console.error.bind(console, 'User DB connection error:'));
  userDb.once('open', () => {
    console.log('Connected to User DB');
  });
  return userDb;
};

const connectPostDb = () => {
  const postDb = mongoose.createConnection(uriPost, {useNewUrlParser : true, useUnifiedTopology : true});
  require('./Post')(postDb);

  postDb.on('error', console.error.bind(console, 'Post DB connection error:'));
  postDb.once('open', () => {
    console.log('Connected to Post DB');
  });
  return postDb;
};

module.exports = { connectUserDb, connectPostDb };
