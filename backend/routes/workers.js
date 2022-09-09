const router = require('express').Router()
const { getWorkers , getWorkingDates , insertWorkingDate} = require('../controller/workersController')
const { requireWorkerAuth , requireAuth} = require('../middleware/check-auth')

router.get('/', requireAuth, getWorkers)


//workerId , fromDate query params
router.get('/working-dates', requireAuth, getWorkingDates)


// date on body
router.post('/working-date', requireWorkerAuth, insertWorkingDate)


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
    "message": "fetch success",
    "workers": [
        {
            "_id": "6317b78800670de89b87678c",
            "firstName": "זיאד",
            "lastName": "חוסין",
            "phone": "0525409948",
            "role": "barber"
        }
    ]
}
*/





/**
 * GET /api/workers/working-dates
 * @summary get working dates
 * @tags Working Date
 * @param {string} workerId.query.required - 
 * @param {string} fromDate.query.required - 
 * @return {object} 200 - success response - application/json
 * @return {Message} 400 - Bad request response
 * @example response - 200 - success response - application/json
{
    "message": "insert success" 
}
*/



/**
 * POST /api/workers/working-date
 * @summary insert a working date
 * @tags Working Date
 * @param {WorkingDatePayload} request.body.required - application/json
 * @return {object} 201 - success response - application/json
 * @return {Message} 400 - Bad request response
 * @example response - 201 - success response - application/json
{
    "message": "insert success" 

}
*/