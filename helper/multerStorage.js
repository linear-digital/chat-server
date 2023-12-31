const multer = require('multer')
const path = require('path')
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/chat')
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + (file.originalname));
    }
});
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const upload2 = multer({ storage: storage2 });

module.exports = { upload, upload2 }