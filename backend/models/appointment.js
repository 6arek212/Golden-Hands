const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    workingDate: { type: Date, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    service: { type: String, enum: ['Hair Cut', 'Wax', 'Massage'] },
    status: { type: String, enum: ['done', 'in-progress', 'didnt-come', 'canceled', 'free', 'hold'], default: 'free' },
    hold: { type: Boolean, default: false }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('appointment', appointmentSchema)
