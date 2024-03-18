const mongoose = require('mongoose');

const connectUserDb = () => {
  const uri = 'mongodb://eozkvnf:vmfhwprxm12~@152.70.232.21:27017/User?authSource=admin';
  const userDb = mongoose.createConnection(uri, {useNewUrlParser : true, useUnifiedTopology : true});
  require('./User')(userDb);

  userDb.on('error', console.error.bind(console, 'User DB connection error:'));
  userDb.once('open', () => {
    console.log('Connected to User DB');
  });
  return userDb;
};

const connectPostDb = () => {
  const uri = 'mongodb://eozkvnf:vmfhwprxm12~@152.70.232.21:27017/Post?authSource=admin';
  const postDb = mongoose.createConnection(uri, {useNewUrlParser : true, useUnifiedTopology : true});
  require('./Post')(postDb);

  postDb.on('error', console.error.bind(console, 'Post DB connection error:'));
  postDb.once('open', () => {
    console.log('Connected to Post DB');
  });
  return postDb;
};

module.exports = { connectUserDb, connectPostDb };
