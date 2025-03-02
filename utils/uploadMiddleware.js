const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let hrs = new Date().getHours()
        let mins = new Date().getMinutes()
        let sec = new Date().getSeconds()
        cb(null, file.originalname.split(".")[0] + "-" + hrs + "-" + mins + "-" + sec + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20,
    }
})

module.exports = { upload }