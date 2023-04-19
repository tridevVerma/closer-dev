const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// *********** Relative path to upload folder which will store avatars **********
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        },
        freinds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },

    {
        timestamps: true
    }
);

const storage = multer.diskStorage({
    // *********** Provide full destination to store avatar **********
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },

    // *********** Generate different names for avatar images files **********
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
  
// static methods / variables in mongoose
userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar'); 
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);
module.exports = User;

