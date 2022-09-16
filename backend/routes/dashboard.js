const router = require('express').Router()
const { getStats } = require('../controller/dashboardController')
const { requireWorkerAuth } = require('../middleware/check-auth')

router.get('/stats', requireWorkerAuth, getStats)


module.exports = router

