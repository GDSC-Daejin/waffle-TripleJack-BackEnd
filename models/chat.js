// 채팅 스키마

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    room : { // 채팅방 아이디
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Room'
    }, 
    user : {
        type : String,
        required : true,
    },
    chat : String,
    createdAt : { // 채팅 시간
        type : Date,
        default : Date.now,
    },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;