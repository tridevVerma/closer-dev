const env = require('../../../config/environment');
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');

module.exports.createSession = async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({email : req.body.email});

        // If user don't exist or password and confirm password didn't match --> invalid email or password
        if(!user || user.password != req.body.password){
            return res.status(422).json({
                message: "Invalid email or password"
            })
        }

        // Generate token and send back
        return res.status(200).json({
            message: "Sign in successfully, Here is your token, please keep it safe!!",
            data: {
                token: jwt.sign(user.toJSON(), env.jwt_key, {expiresIn : 100000})
            }
        })
    } catch (err) {
        console.log("******", err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    } 
}
