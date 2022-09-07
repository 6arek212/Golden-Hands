const router = require('express').Router()
const { getWorkers , getWorkingDates , insertWorkingDate} = require('../controller/workersController')
const { requireWorkerAuth , requireAuth} = require('../middleware/check-auth')

router.get('/', requireAuth, getWorkers)

router.get('/working-date', requireAuth, getWorkingDates)

router.post('/', requireWorkerAuth, insertWorkingDate)


module.exports = router
