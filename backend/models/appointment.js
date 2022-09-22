const mongoose = require('mongoose')


const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
},
    { _id: false })



const appointmentSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    workingDate: { type: Date, required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    service: { type: serviceSchema },
    status: { type: String, enum: ['done', 'in-progress', 'didnt-come', 'canceled', 'free', 'hold'], default: 'free' }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('appointment', appointmentSchema)
