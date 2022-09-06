const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "user"},
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    start_time: { type: Date, ref: "customer", required: true },
    end_time: { type: Date, ref: "customer", required: true },
    service: { type: String, enum: ['Hair Cut', 'Wax', 'Massage'] },
    isActive: { type: Boolean, default: false }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('appointment', appointmentSchema)
