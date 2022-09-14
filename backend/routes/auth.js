const router = require('express').Router()
const checkFields = require('../middleware/check_fields')
const { sendAuthVerification, verifyAndSignup, verifyAndLogin, verifyPhone, refreshToken } = require('../controller/authController')
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imgs')
    },
    filename: (req, file, cb) => {
        console.log(file);
        const id = mongoose.Types.ObjectId();
        cb(null, new Date().toISOString() + id + path.extname(file.originalname))
    }
})



const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        return cb(null, true)
    }
    cb(null, false)
}

const fileLimits = {
    fileSize: 1024 * 1024 * 5
}


const upload = multer({
    storage: storage,
    limits: fileLimits,
    fileFilter: fileFilter
})


router.post('/send-auth-verification', checkFields('body', ['phone']), sendAuthVerification)

router.post('/signup-verify-phone', upload.single('image'), verifyAndSignup)

router.post('/login-verify-phone', checkFields('body', ['phone', 'verifyId', 'code']), verifyAndLogin)

router.post('/verify-phone', checkFields('body', ['verifyId', 'code']), verifyPhone)


router.post('/refresh-token', refreshToken)

module.exports = router




// checkFields('fields', ['firstName', 'lastName', 'phone', 'verifyId', 'code']),