const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },

    // This defines the object id of the liked object
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },

    // This field is used to define the type of the liked object since this is a dynamic reference
    onModel:{
        type: String,
        enum:['Post', 'Comment'],
        required: true
    }
}, {
    timestamps: true
});

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;