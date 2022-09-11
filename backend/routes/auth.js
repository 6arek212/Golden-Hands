const router = require('express').Router()
const checkFields = require('../middleware/check_fields')
const { login, signup } = require('../controller/authController')



router.post('/login', checkFields('body',['phone', 'password']), login)

router.post('/signup', checkFields('body',['firstName', 'lastName', 'phone', 'password']), signup)

router.post('/refresh_token', () => {

})


module.exports = router