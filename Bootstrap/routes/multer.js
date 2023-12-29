const multer = require("multer"); // uploading image
const { v4: uuidv4 } = require('uuid'); // unique id
const path = require('path')// for taking out extension

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        const uniquename = uuidv4();
        cb(null, uniquename + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage });

module.exports = upload;