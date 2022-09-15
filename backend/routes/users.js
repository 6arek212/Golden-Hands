const router = require('express').Router()
const { getUsers, getUser, deleteUser, updateUser } = require('../controller/usersContoller')
const { requireAuth, requireWorkerAuth } = require('../middleware/check-auth')




router.get('/', requireWorkerAuth, getUsers)

router.delete('/:userId', requireWorkerAuth, deleteUser)




router.get('/:userId', requireAuth, getUser)

router.patch('/', requireAuth, updateUser)


module.exports = router
