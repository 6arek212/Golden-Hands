const path = require('path')
const multer = require('multer')
const { requireAuth } = require('../middleware/check-auth')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp')
    },
    filename: (req, file, cb) => {
        //_${new Date().toISOString()}
        console.log('file name', `${req.user}${path.extname(file.originalname)}`);
        cb(null, `${req.user}${path.extname(file.originalname)}`)
    }
})


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        console.log('image type', file.mimetype);
        return cb(null, true)
    }
    cb(null, true)
}

const fileLimits = {
    fileSize: 1024 * 1024 * 20
}


const upload = multer({
    storage: multer.memoryStorage(),
    limits: fileLimits,
    fileFilter: fileFilter
})

module.exports = upload