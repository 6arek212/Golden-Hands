const mongoose = require('mongoose')


const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
}, {
  timestamps: true
})


module.exports = mongoose.model("city", CitySchema)
