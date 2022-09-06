const router = require('express').Router()
const required_fields = require('../middleware/check_fields')
const { getAppointments,
    updateAppointment,
    deleteAppointment,
    bookAppointment,
    unbookAppointment,
    getAvailableAppointments,
    createAppointment,
    getUserAppointment
} = require('../controller/appointmentsController')


const { requireAuth, requireWorkerAuth } = require('../middleware/check-auth')


//admin routes
router.get('/' , requireWorkerAuth , getAppointments)

router.post('/', requireWorkerAuth, createAppointment)

router.patch('/' , requireWorkerAuth, updateAppointment)

router.delete('/:appointmentId', requireWorkerAuth, deleteAppointment)



//customer routes

router.get('/user-appointment' , requireAuth , getUserAppointment)

router.get('/available' , requireAuth, getAvailableAppointments)

router.post('/book', requireAuth, bookAppointment)

router.post('/unbook', requireAuth, unbookAppointment)

module.exports = router