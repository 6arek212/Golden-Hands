const router = require('express').Router()
const checkFields = require('../middleware/check_fields')
const { getStats } = require('../controller/dashboardController')

router.get('/stats',  getStats)


module.exports = router

