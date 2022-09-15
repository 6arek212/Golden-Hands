const router = require('express').Router()
const checkFields = require('../middleware/check_fields')
const { sendAuthVerification, verifyAndSignup, verifyAndLogin, verifyPhone, refreshToken, uploadFile } = require('../controller/authController')
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')
const { requireAuth } = require('../middleware/check-auth')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp')
    },
    filename: (req, file, cb) => {
        //_${new Date().toISOString()}
        cb(null, `${req.user}${path.extname(file.originalname)}`)
    }
})



const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
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


router.post('/upload-image', requireAuth, upload.single('image'), uploadFile)

router.post('/send-auth-verification', checkFields('body', ['phone']), sendAuthVerification)

router.post('/signup-verify-phone', checkFields('body', ['firstName', 'lastName', 'phone', 'verifyId', 'code']), verifyAndSignup)

router.post('/login-verify-phone', checkFields('body', ['phone', 'verifyId', 'code']), verifyAndLogin)

router.post('/verify-phone', checkFields('body', ['verifyId', 'code']), verifyPhone)


router.post('/refresh-token', refreshToken)

module.exports = router




// checkFields('fields', ['firstName', 'lastName', 'phone', 'verifyId', 'code']),