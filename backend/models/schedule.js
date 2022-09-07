const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    date: { type: Date, required: true, unique: true },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('schedule', scheduleSchema)
