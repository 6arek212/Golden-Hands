const router = require('express').Router()
const checkFields = require('../middleware/check_fields')
const { login, signup } = require('../controller/authContoller')



router.post('/login', checkFields(['phone', 'password']), login)

router.post('/signup', checkFields(['firstName', 'lastName', 'phone', 'password']), signup)

router.post('/refresh_token', () => {

})


module.exports = router