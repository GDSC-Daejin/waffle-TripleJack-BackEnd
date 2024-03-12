// 채팅방 스키마

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title : { // 채팅방 제목
        type : String,
        required : true,
    },
    max : { // 최대 수용 인원.. 고민..
        type : Number,
        required : true,
        default : 2  
    },
    owner : { // 방장(운전자?)
        type : String,
        required : true,
    }
})

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;