const User = require('../models/User');
const Freind = require('../models/Freind');

module.exports.add = async(req, res) => {

    let fromUserId = req.user.id, toUserId = req.params.id;

    if(fromUserId == toUserId){
        return res.status(400).json({message: "me and freind can't be same"})
    }
    else{
        await Freind.create({
            userId: fromUserId,
            freindId: toUserId
        });

        const fromUser = await User.findById(fromUserId);
        fromUser.freinds.push(toUserId);
        fromUser.save();
        const toUser = await User.findById(toUserId);
        toUser.freinds.push(fromUserId);
        toUser.save();

        return res.status(200).json({
            message: "freind successfully added",
            newFreind: toUser.name,
            id: toUser.id
        });
    }
    
}

module.exports.remove = async (req, res) => {
    let fromUserId = req.user.id, toUserId = req.params.id;

    if(fromUserId == toUserId){
        return res.status(400).json({message: "me and freind can't be same"})
    }
    else{
        await Freind.deleteOne({
            userId: fromUserId,
            freindId: toUserId
        });

        const fromUser = await User.findById(fromUserId);
        fromUser.freinds.pull(toUserId);
        fromUser.save();
        const toUser = await User.findById(toUserId);
        toUser.freinds.pull(fromUserId);
        toUser.save();

        return res.status(200).json({
            message: "freind successfully removed",
            freind: toUser.name,
            id: toUser.id
        });
    }
    
}