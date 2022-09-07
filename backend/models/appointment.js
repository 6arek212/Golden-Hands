const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "user"},
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    workingDate: { type: mongoose.Schema.Types.ObjectId, ref: "schedule", required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    service: { type: String, enum: ['Hair Cut', 'Wax', 'Massage'] },
    isActive: { type: Boolean, default: false }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('appointment', appointmentSchema)
