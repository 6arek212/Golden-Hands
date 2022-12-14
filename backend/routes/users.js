const router = require('express').Router()
const { requireAuth, requireWorkerAuth } = require('../middleware/check-auth')
const upload = require('../middleware/file_uploader')
const { reduceImageSize } = require('../middleware/reduce-image-size')

const { getUsers, getUser, deleteUser, updateUser, uploadUserImage } = require('../controller/usersContoller')


router.post('/upload-image', requireAuth, upload.single('image'), reduceImageSize, uploadUserImage)


router.get('/', requireWorkerAuth, getUsers)

router.delete('/:userId', requireWorkerAuth, deleteUser)




router.get('/:userId', requireAuth, getUser)

router.patch('/:userId', requireAuth, updateUser)


// const User = require('../models/user')
// const Appointment = require('../models/appointment')
// const a = async () =>{
//  await User.deleteMany({firstName: { $nin: ['טארק', 'וסאם', 'Tommy']}})
//  await Appointment.deleteMany()
// }
// a()

module.exports = router
