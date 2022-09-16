const User = require('../models/user')
const Appointment = require('../models/appointment')

exports.getStats = async (req, res, next) => {

    const customersCount = await User.count({ role: 'customer' })
    const appointmentsCount = await Appointment.count()
    const newCustomers = await User.find({ role: 'customer' }).sort({ createdAt: 'desc' }).limit(10)
    const closestAppointments = await Appointment
        .find({ customer: { $ne: null } })
        .where('start_time').gte(new Date())
        .sort({ createdAt: 'desc' })
        .limit(10)
        .populate('customer', '_id firstName lastName image role')
        .populate('worker', '_id firstName lastName image role')

    res.status(200).json({
        message: 'fetch success',
        customersCount,
        appointmentsCount,
        newCustomers,
        closestAppointments
    })
}