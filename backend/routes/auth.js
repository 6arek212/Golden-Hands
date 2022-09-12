const router = require('express').Router()
const checkFields = require('../middleware/check_fields')
const { sendAuthVerification, verifyAndSignup , verifyAndLogin , verifyPhone } = require('../controller/authController')



router.post('/send-auth-verification', checkFields('body', ['phone']), sendAuthVerification)

router.post('/signup-verify-phone', checkFields('body', ['firstName', 'lastName', 'phone', 'verifyId', 'code']), verifyAndSignup)

router.post('/login-verify-phone', checkFields('body', ['phone', 'verifyId', 'code']), verifyAndLogin)

router.post('/verify-phone', checkFields('body', ['verifyId', 'code']), verifyPhone)


router.post('/refresh_token', () => {

})

module.exports = router