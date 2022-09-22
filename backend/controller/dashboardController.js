const User = require('../models/user')
const Appointment = require('../models/appointment')

exports.getStats = async (req, res, next) => {

    const customersCount = await User.count({ role: 'customer' })
    const appointmentsCount = await Appointment.count()
    const doneAppointmentsCount = await Appointment.count({ status: 'done' })
    const pendingAppointmentsCount = await Appointment.count({ status: 'in-progress' })
    const canceledAppointmentsCount = await Appointment.count({ status: 'canceled' })
    const newCustomers = await User.find().where('_id').equals('fake_user')
    // .find({ role: 'customer' }).sort({ createdAt: 'desc' }).limit(10)

    res.status(200).json({
        message: 'fetch success',
        customersCount,
        appointmentsCount,
        newCustomers,
        doneAppointmentsCount,
        pendingAppointmentsCount,
        canceledAppointmentsCount
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
            $sort: { workingDate: 1 }
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







