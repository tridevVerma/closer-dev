const mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300,
    },
});

const Token = mongoose.model('tokenSchema', tokenSchema);
module.exports = Token;