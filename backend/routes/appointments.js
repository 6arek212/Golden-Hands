const router = require('express').Router()
const required_fields = require('../middleware/check_fields')
const checkFields = require('../middleware/check_fields')
const { getAppointments,
    updateAppointment,
    deleteAppointment,
    bookAppointment,
    unbookAppointment,
    getAvailableAppointments,
    createAppointment,
    getUserAppointment,
    getUserAppointments
} = require('../controller/appointmentsController')


const { requireAuth, requireWorkerAuth } = require('../middleware/check-auth')



router.get('/', requireWorkerAuth, getAppointments)

router.post('/', checkFields('body', ['worker', 'start_time', 'end_time']), requireWorkerAuth, createAppointment)

router.patch('/:appointmentId', requireWorkerAuth, updateAppointment)

router.delete('/:appointmentId', requireWorkerAuth, deleteAppointment)




router.post('/book', checkFields('body', ['service', 'appointmentId', 'userId']), requireAuth, bookAppointment)

router.post('/unbook', checkFields('body', ['appointmentId']), requireAuth, unbookAppointment)



//customer routes

router.get('/user-appointment', requireAuth, getUserAppointment)

router.get('/user-appointments', requireAuth, getUserAppointments)

router.get('/available', checkFields('query', ['workerId']), requireAuth, getAvailableAppointments)


module.exports = router

