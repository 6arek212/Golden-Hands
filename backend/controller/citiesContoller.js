const City = require('../models/city')

exports.getCities = (req, res, next) => {

  City.find().select('name').then(cities => {
    res.status(200).json({
      message: 'Cities fetched successfuly',
      cities
    })
  }).catch(err =>{})
}



exports.getAdminCities = (req, res, next) => {
  City.find().then(cities => {
    if (!cities)
      return 

    res.status(200).json({
      message: 'Cities fetched successfuly',
      cities
    })
  }).catch(err => {})
}


exports.deleteCity = (req, res, next) => {
  const cityId = req.params.cityId

  console.log('deleting city ',cityId);

  City.findOneAndDelete({ _id: cityId }).then(result => {
    res.status(200).json({
      message: 'Cities deleted successfuly'
    })
  }).catch(err => {})
}




exports.addCity = (req, res, next) => {

  const city = new City({
    name: req.body.name
  })

  city.save().then(cit => {
    res.status(200).json({
      message: 'Cities added successfuly'
    })
  }).catch(err => {})
}


