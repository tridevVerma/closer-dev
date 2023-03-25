const User = require('../../../models/User');
const jwt = require('jsonwebtoken');

module.exports.createSession = async (req, res) => {
    try {
        const user = await User.findOne({email : req.body.email});
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "Invalid email or password"
            })
        }

        return res.status(200).json({
            message: "Sign in successfull, Here is your token, please keep it safe!!",
            data: {
                token: jwt.sign(user.toJSON(), 'closer', {expiresIn : 100000})
            }
        })
    } catch (err) {
        console.log("******", err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    } 
}
