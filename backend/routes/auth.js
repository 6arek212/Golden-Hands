const router = require('express').Router()
const checkFields = require('../middleware/check_fields')
const { attachUserInfo } = require('../middleware/check-auth')
const { sendAuthVerification, verifyAndSignup, verifyAndLogin, refreshToken, verifyAndUpdatePhone } = require('../controller/authController')
const { requireAuth } = require('../middleware/check-auth')


router.post('/send-auth-verification', attachUserInfo, checkFields('body', ['phone']), sendAuthVerification)

router.post('/signup-verify-phone', checkFields('body', ['firstName', 'lastName', 'birthDate', 'phone', 'verifyId', 'code']), verifyAndSignup)

router.post('/login-verify-phone', checkFields('body', ['phone', 'verifyId', 'code']), verifyAndLogin)

router.post('/refresh-token', checkFields('body', ['refreshToken']), refreshToken)

router.patch('/verify-update-phone', requireAuth, checkFields('body', ['phone', 'verifyId', 'code', 'userId']), verifyAndUpdatePhone)


module.exports = router


