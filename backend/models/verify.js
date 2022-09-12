const mongoose = require('mongoose')

const verifySchema = new mongoose.Schema({
    code: { type: String, required: true },
    phone: { type: String, required: true },
    forAuth: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, expires: '1m', default: Date.now}
})

module.exports = mongoose.model('verify', verifySchema)
