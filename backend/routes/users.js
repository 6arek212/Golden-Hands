const router = require('express').Router()
const { getUsers , getUser , deleteUser , updateUser } = require('../controller/usersContoller')
const { requireAuth, requireWorkerAuth } = require('../middleware/check-auth')



router.post('/search', requireWorkerAuth, search)

router.get('/', requireWorkerAuth, getUsers)

router.delete('/:userId', requireWorkerAuth, deleteUser)




router.get('/', requireAuth, getUser)

router.patch('/', requireAuth,updateUser)


module.exports = router
