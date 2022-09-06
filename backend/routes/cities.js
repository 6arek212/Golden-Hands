const router = require('express').Router()
const citiesController = require('../controller/citiesContoller')

router.get('', citiesController.getCities)


router.delete('/:cityId',  citiesController.deleteCity)


router.post('',  citiesController.addCity)



module.exports = router