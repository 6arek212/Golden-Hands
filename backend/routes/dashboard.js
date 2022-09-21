const router = require('express').Router()
const { getStats, getWorkerRevenue } = require('../controller/dashboardController')
const { requireWorkerAuth } = require('../middleware/check-auth')

router.get('/stats', requireWorkerAuth, getStats)

router.get('/worker-revenue', requireWorkerAuth, getWorkerRevenue)


module.exports = router

