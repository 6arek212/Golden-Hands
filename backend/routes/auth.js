const router = require('express').Router()
const checkFields = require('../middleware/check_fields')
const { attachUserInfo } = require('../middleware/check-auth')
const { sendAuthVerification, verifyAndSignup, verifyAndLogin, verifyPhone, refreshToken, uploadFile } = require('../controller/authController')


router.post('/send-auth-verification', attachUserInfo, checkFields('body', ['phone']), sendAuthVerification)

router.post('/signup-verify-phone', checkFields('body', ['firstName', 'lastName', 'birthDate', 'phone', 'verifyId', 'code']), verifyAndSignup)

router.post('/login-verify-phone', checkFields('body', ['phone', 'verifyId', 'code']), verifyAndLogin)

router.post('/verify-phone', checkFields('body', ['verifyId', 'code']), verifyPhone)


router.post('/refresh-token', checkFields('body', ['refreshToken']), refreshToken)

module.exports = router


