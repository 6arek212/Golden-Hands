const router = require('express').Router()
const { requireAuth, requireWorkerAuth } = require('../middleware/check-auth')
const upload = require('../middleware/file_uploader')


const { getUsers, getUser, deleteUser, updateUser , uploadUserImage  } = require('../controller/usersContoller')




router.post('/upload-image', requireAuth, upload.single('image'), uploadUserImage)



router.get('/', requireWorkerAuth, getUsers)

router.delete('/:userId', requireWorkerAuth, deleteUser)




router.get('/:userId', requireAuth, getUser)

router.patch('/:userId', requireAuth, updateUser)


module.exports = router
