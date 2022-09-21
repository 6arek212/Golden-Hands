const User = require('../models/user')
const Appointment = require('../models/appointment')

exports.getStats = async (req, res, next) => {

    const customersCount = await User.count({ role: 'customer' })
    const appointmentsCount = await Appointment.count()
    const newCustomers = await User.find().where('_id').equals('fake_user')
    // .find({ role: 'customer' }).sort({ createdAt: 'desc' }).limit(10)
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


exports.getWorkerRevenue = async (req, res, next) => {
    const { workerId } = req.query

    const $match =
    {
        status: 'in-progress'
    }

    if (workerId) {
        $match.worker = workerId
    }

    const result = await Appointment.aggregate([
        {
            $match
        },
        {

            $lookup: {
                from: 'users',
                localField: 'worker',
                foreignField: '_id',
                as: 'worker'
            }

        },
        {
            $unwind: "$worker"
        },

        {

            $lookup: {
                from: 'services',
                localField: 'service',
                foreignField: '_id',
                as: 'service'
            }

        },

        {
            $unwind: "$service"
        },

        {
            $group: {
                _id: {
                    worker: "$worker",
                    workingDate: "$workingDate"
                },
                revenue: { $sum: "$service.price" },
                count: { $count: {} }
            }
        },



        {
            $project: {
                _id: 0,
                worker: "$_id.worker",
                workingDate: "$_id.workingDate",
                revenue: "$revenue",
                count: "$count"
            }
        }

    ])


    res.status(200).json({
        message: 'fetch success',
        data: result
    })
}