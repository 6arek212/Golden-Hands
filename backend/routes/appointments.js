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

router.post('/', checkFields('body', ['worker', 'start_time', 'end_time', 'workingDate']), requireWorkerAuth, createAppointment)

router.patch('/:appointmentId', requireWorkerAuth, updateAppointment)

router.delete('/:appointmentId', requireWorkerAuth, deleteAppointment)



//customer routes

router.get('/user-appointment', requireAuth, getUserAppointment)

router.get('/user-appointments', requireAuth, getUserAppointments)

router.get('/available', checkFields('query', ['workerId']), requireAuth, getAvailableAppointments)

//service , appointmentId
router.post('/book', checkFields('body', ['service', 'appointmentId']), requireAuth, bookAppointment)

router.post('/unbook', checkFields('body', ['appointmentId']), requireAuth, unbookAppointment)

module.exports = router




/**
 * An appointment item
 * @typedef {object} Appoitment
 * @property {string} _id - 
 * @property {string} customer - the id of the customer
 * @property {string} worker.required - the Id of the worker
 * @property {string} workingDate.required - the Id of the working date !!
 * @property {string} start_time.required - yyyy-MM-ddTHH:mm:ssT
 * @property {string} end_time.required - yyyy-MM-ddTHH:mm:ssT
 * @property {string} service - 
 * @property {boolean} isActive - 
 */


/**
 * An appointment requrest item
 * @typedef {object} AppoitmentPayload
 * @property {string} worker.required - the Id of the worker
 * @property {string} workingDate.required - the Id of the working date !!
 * @property {string} start_time.required - yyyy-MM-ddTHH:mm:ssT
 * @property {string} end_time.required - yyyy-MM-ddTHH:mm:ssT
 */


/**
 * A message response
 * @typedef {object} Message
 * @property {string} message - 
 */




/**
 * GET /api/appointments
 * @summary Worker only path , For getting appointmnets
 * @tags Appointments
 * @param {string} barber.query - barber id
 * @param {string} service.query - service
 * @param {string} start_time.query - start date
 * @param {string} end_time.query - end date
 * @param {number} pageSize.query - page size
 * @param {number} currentPage.query - the current page
 * @param {string} customerId.query - customerId
 * @param {string} sort.query - sort - ['desc' , 'asc']
 * @param {boolean} isActive.query - is appointment active
 * @return {object} 200 - success response - application/json
 * @return {Message} 400 - Bad request response
 * 
 * @example response - 200 - success response - application/json
 * {
 *   "message": "fetched appointments successfull",
 *   "appointments": [
 *   {
 *       "_id": "6317b9aea07dbb5aa25d6653",
 *       "worker": {
 *           "_id": "6317b78800670de89b87678c",
 *           "firstName": "Ziad",
 *           "lastName": "Husin",
 *           "phone": "0525409948",
 *           "role": "barber"
 *       },
 *       "start_time": "2022-09-08T09:00:00.000Z",
 *       "end_time": "2022-09-08T09:30:00.000Z",
 *       "isActive": false,
 *       "createdAt": "2022-09-06T21:20:46.952Z",
 *       "updatedAt": "2022-09-06T22:15:03.380Z",
 *       "customer": null,
 *       "service": null
 *   }
 *  ]
 * }
 * @example response - 400 - example error response
 * {
 *   "message": "worker must have a non customer role"
 * }
 */






/**
 * POST /api/appointments
 * @summary create appointment
 * @tags Appointments
 * @param {AppoitmentPayload} request.body.required - 
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 201 - success response - application/json
 * {
 *   "message": "appointments created",
 *   "appointment": {}
 * }
 * 
 * @example response - 400 - example error response
 * {
 *   "message": "worker must have a non customer role"
 * }
 */


/**
 * Delete /api/appointments/{appointmentId}
 * @summary delete appointment , you can delete an appointment only if it's not booked
 * @tags Appointments
 * @param {string} appointmentId.path.required - 
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - success response - application/json
 * {
 *   "message": "appointment deleted"
 * }
 * 
 * @example response - 400 - example error response
 * {
 *   "message": "this appointment has already been booked, unbook it first"
 * }
 */





/**
 * Patch /api/appointments/{appointmentId}
 * @summary update appointment , you can update an appointment only if it's not booked
 * @tags Appointments
 * @param {string} appointmentId.path.required - the appointment id
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @example response - 200 - success response - application/json
 * {
 *   "message": "appointment updated",
 *  "appointment": 
 *   {
 *       "_id": "6317b9aea07dbb5aa25d6653",
 *       "worker": {
 *           "_id": "6317b78800670de89b87678c",
 *           "firstName": "Ziad",
 *           "lastName": "Husin",
 *           "phone": "0525409948",
 *           "role": "barber"
 *       },
 *       "start_time": "2022-09-08T09:00:00.000Z",
 *       "end_time": "2022-09-08T09:30:00.000Z",
 *       "isActive": false,
 *       "createdAt": "2022-09-06T21:20:46.952Z",
 *       "updatedAt": "2022-09-06T22:15:03.380Z",
 *       "customer": null,
 *       "service": null
 *   
 * }
 * }
 * 
 * @example response - 400 - example error response
 * {
 *   "message": "this appointment has already been booked, unbook it first"
 * }
 */