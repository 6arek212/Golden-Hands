const router = require('express').Router()
const { getWorkers, getWorkingDates, insertWorkerService, deleteWorkerService, getWorker, getWorkerServices } = require('../controller/workersController')
const { requireWorkerAuth, requireAuth } = require('../middleware/check-auth')
const checkFields = require('../middleware/check_fields')




//workerId  query params
router.get('/working-dates', checkFields('query', ['workerId']), requireAuth, getWorkingDates)


//public route 
router.get('/', getWorkers)


router.get('/services/:workerId', getWorkerServices)


router.post('/services', requireWorkerAuth, checkFields('body', ['workerId', 'price', 'title']), insertWorkerService)


router.delete('/services/:serviceId', requireWorkerAuth, checkFields('param', ['serviceId']), deleteWorkerService)


router.get('/:workerId', requireAuth, getWorker)


module.exports = router


