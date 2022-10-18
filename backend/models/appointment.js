const mongoose = require('mongoose')
const moment = require('moment')
const twilio = require('../utils/twilio')
const whatsapp = require('../utils/whatsapp')


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



const reminderTime = 30

appointmentSchema.methods.requiresNotification = function (date) {
    return Math.round(moment.duration(moment(this.start_time).diff(moment(date).utc())).asMinutes()) === reminderTime;
};



appointmentSchema.statics.sendNotifications = function (callback) {
    // now
    const searchDate = new Date();
    Appointment
        .find()
        .where('status')
        .equals('in-progress')
        .where('start_time')
        .gte(searchDate)
        .populate('worker customer')
        .then(function (appointments) {
            appointments = appointments.filter(function (appointment) {
                return appointment.requiresNotification(searchDate);
            });
            if (appointments.length > 0) {
                sendNotifications(appointments);
            }
        });

    /**
    * Send messages to all appoinment owners via Twilio
    * @param {array} appointments List of appointments.
    */
    function sendNotifications(appointments) {
        console.log('sending notifiaction',appointments);
        appointments.forEach(function (appointment) {
            whatsapp.sendMessage(appointment.customer.phone , 'appointment_approaching')
        });

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
            callback.call();
        }
    }
};


const Appointment = mongoose.model('appointment', appointmentSchema);
module.exports = Appointment;
