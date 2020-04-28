const multer = require('multer');
const DIR = './public/';
const uuid = require('uuid/v4');
// const mongoose          = require('mongoose').connection
// const db                = mongoose.connection;
const User              = require('../../../models/User.js');

require('dotenv').config();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid() + '-' + fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return false;
        }
    }
});

async function uploadPhoto(req, res) {
    const userID = res.locals.id;
    const pathImg = process.env.NODE_ENV !== 'production' ? `http://localhost:${process.env.SERVER_PORT}/${req.file.path}` : `https://hypertube.jv-g.fr/${req.file.path}`;
    const fsize = req.file.size;

    const file = Math.round((fsize / 1024));
    if (file >= 2048) {
        return res.status(400).json({});
    } else {
        try {
            let user = await User.findOne({_id: userID});
            if (user){
                user.img = pathImg;
                user.save();
                return res.status(200).json({img: pathImg})
            } else if (!user) throw new Error('User not find')


        } catch (err){
            return res.status(400).json({})
        }
    }
}


exports.uploadPhoto = uploadPhoto;
exports.storage = storage;
exports.upload = upload;
