const User = require('../models/user')
const { Service } = require('../models/service')
const Appointment = require('../models/appointment')
const mongoose = require('mongoose')


module.exports.getWorkers = async (req, res, next) => {
    console.log('----------------getWorkers----------------');

    try {
        const workers = await User
            .find()
            .where('role').ne('customer')
            .select('_id firstName lastName phone role image services')
            .populate('services')

        const data = await User.aggregate([
            {
                $match: {
                    role: { $ne: 'customer' }
                }
            },

            {
                $addFields: {
                    services: '$_id'
                }

            },

            {
                $lookup: {
                    from: 'services',
                    localField: 'services',
                    foreignField: 'worker',
                    as: 'services'
                }
            },

            {
                "$project": {
                    "_id": 1,
                    "firstName": 1,
                    "lastName": 1,
                    "phone": 1,
                    "role": 1,
                    "createdAt": 1,
                    "image": 1,
                    "services._id": 1,
                    "services.title": 1,
                    "services.price": 1
                }
            }

        ])

        res.status(200).json({
            message: 'fetch workers success',
            workers: data
        })
    }
    catch (e) {
        next(e)
    }
}



module.exports.getWorkerServices = async (req, res, next) => {
    const { workerId } = req.params
    console.log('----------------getWorkerServices----------------');

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(404).json({
            message: 'worker id is not valid'
        })
    }

    try {
        const services = await Service
            .find({ worker: workerId })


        res.status(200).json({
            message: 'fetch services success',
            services
        })
    }
    catch (e) {
        next(e)
    }
}



module.exports.getWorker = async (req, res, next) => {
    const { workerId } = req.params
    console.log('----------------getWorker----------------');

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(404).json({
            message: 'worker id is not valid'
        })
    }

    try {
        const worker = await User
            .findOne({ _id: workerId })
            .where('role').ne('customer')
            .select('_id firstName lastName phone role image')


        if (!worker) {
            return res.status(404).json({
                message: 'worker was not found'
            })
        }


        res.status(200).json({
            message: 'fetch worker success',
            worker
        })
    }
    catch (e) {
        next(e)
    }
}


module.exports.getWorkingDates = async (req, res, next) => {
    const { workerId, fromDate } = req.query
    console.log('----------------getWorkingDates----------------');
    console.log('params', workerId, fromDate);


    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(404).json({
            message: 'worker id is not valid'
        })
    }


    const query = Appointment.find({ worker: workerId })


    if (fromDate) {
        const from = new Date(fromDate)
        const to = new Date(from)
        to.setDate(from.getDate() + 6)


        if (from) {
            query.where('workingDate').gte(from)
        }

        if (to) {
            query.where('workingDate').lte(to)
        }
    }

    try {
        const workingDates = await query
            .sort({ date: 'asc' })
            .distinct('workingDate')


        res.status(200).json({
            message: 'fetch working dates success',
            workingDates
        })
    } catch (e) {
        next(e)
    }
}


