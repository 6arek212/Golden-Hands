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
 * WorkingDatePayload
 * @typedef {object} WorkingDatePayload
 * @property {string} date.required - 
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