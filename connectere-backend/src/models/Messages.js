const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    text: {
        type: String,
        required: true, 
    },
    time: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    image:{
        type: String,
    }
});

module.exports = mongoose.model('Message', messageSchema);