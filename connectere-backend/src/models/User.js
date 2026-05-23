const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        default: "",
    },

    bio: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "Online"
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);