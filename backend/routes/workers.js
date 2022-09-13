const router = require('express').Router()
const { getWorkers, getWorkingDates, insertWorkingDate, getWorker } = require('../controller/workersController')
const { requireWorkerAuth , requireAuth} = require('../middleware/check-auth')
const checkFields = require('../middleware/check_fields')




//workerId  query params
router.get('/working-dates', checkFields('query', ['workerId']), requireAuth, getWorkingDates)


// date on body
router.post('/working-date', checkFields('body', ['date', 'workerId']), requireWorkerAuth, insertWorkingDate)


//public route 
router.get('/', getWorkers)


router.get('/:workerId', requireAuth, getWorker)


module.exports = router



/**
 * A User that represents the customer and worker item
 * @typedef {object} User
 * @property {string} _id - 
 * @property {string} customer - 
 * @property {string} firstName.required - 
 * @property {string} lastName.required - 
 * @property {string} phone.required - 
 * @property {string} password.required - 
 * @property {string} role.required - default: 'customer'
 * @property {boolean} isActive - 
 */




/**
 *  Schedule item
 * @typedef {object} Schedule
 * @property {string} worker.required - 
 * @property {string} date.required - 
 * @property {boolean} isActive.required - 
 */




/**
 * WorkingDatePayload
 * @typedef {object} WorkingDatePayload
 * @property {string} date.required - 
 */




/**
 * GET /api/workers
 * @summary get workers
 * @tags Workers
 * @return {object} 200 - success response - application/json
 * @return {Message} 400 - Bad request response
 * 
 * @example response - 200 - success response - application/json
{
    "message": "fetch workers success",
    "workers": [
        {
            "_id": "6317b6ded417e4cbffde4da5",
            "firstName": "טארק",
            "lastName": "חוסין",
            "phone": "0525145565",
            "role": "barber",
            "image": "6317b6ded417e4cbffde4da5.jpg"
        }
    ]
    }
*/



/**
 * GET /api/workers/{workerId}
 * @summary get worker
 * @tags Workers
 * @param {string} workerId.query.required - 
 * @return {object} 200 - success response - application/json
 * @return {Message} 400 - Bad request response
 * 
 * @example response - 200 - success response - application/json
{
    "message": "fetch worker success",
    "worker": {
        "_id": "6317b6ded417e4cbffde4da5",
        "firstName": "טארק",
        "lastName": "חוסין",
        "phone": "0525145565",
        "role": "barber",
        "image": "6317b6ded417e4cbffde4da5.jpg"
    }
}
*/





/**
 * GET /api/workers/working-dates
 * @summary get working dates
 * @tags Working Date
 * @param {string} workerId.query.required - 
 * @param {string} fromDate.query - yyyy-MM-ddTHH:mm:ssZ
 * @return {object} 200 - success response - application/json
 * @return {Message} 400 - Bad request response
 * @example response - 200 - success response - application/json
 * 
 * {
 "message": "fetch working dates success",
    "workingDates": [
        {
            "_id": "631cc618d509d93a57af2d0f",
            "worker": {
                "_id": "6317b6ded417e4cbffde4da5",
                "firstName": "טארק",
                "lastName": "חוסין",
                "phone": "0525145565",
                "role": "barber",
                "image": "6317b6ded417e4cbffde4da5.jpg"
            },
            "date": "2022-09-10T21:00:00.000Z",
            "isActive": true
        }
    ]
}
*/





/**
 * POST /api/workers/working-date
 * @summary insert a working date
 * @tags Working Date
 * @param {WorkingDatePayload} request.body.required - format yyyy-MM-ddTHH:mm:ssZ
 * @return {object} 201 - success response - application/json
 * @return {Message} 400 - Bad request response
 * @example response - 201 - success response - application/json
{
    "message": "insert working date success",
    "workingDate": {
        "worker": "6317b6ded417e4cbffde4da5",
        "date": "2022-09-20T21:00:00.000Z",
        "isActive": true,
        "_id": "631d9b76538bd05972664620",
        "createdAt": "2022-09-11T08:25:26.156Z",
        "updatedAt": "2022-09-11T08:25:26.156Z",
        "__v": 0
    }
}
*/