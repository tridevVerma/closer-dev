const mongoose = require('mongoose');

const freindSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    freindId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Freind = mongoose.model('Freind', freindSchema);

module.exports = Freind;