const router = require('express').Router()
const { getWorkers, getWorkingDates, insertWorkingDate, getWorker, getWorkerServices } = require('../controller/workersController')
const { requireWorkerAuth, requireAuth } = require('../middleware/check-auth')
const checkFields = require('../middleware/check_fields')




//workerId  query params
router.get('/working-dates', checkFields('query', ['workerId']), requireAuth, getWorkingDates)


//public route 
router.get('/', getWorkers)


router.get('/services/:workerId', getWorkerServices)


router.get('/:workerId', requireAuth, getWorker)


module.exports = router


