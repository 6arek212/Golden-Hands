const User = require('../models/user')
const { Service } = require('../models/service')
const Appointment = require('../models/appointment')
const mongoose = require('mongoose')
const moment = require('moment')

module.exports.getWorkers = async (req, res, next) => {
    console.log('----------------getWorkers----------------');

    try {
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
                    "birthDate": 1,
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



module.exports.insertWorkerService = async (req, res, next) => {
    const { workerId, title, price } = req.body
    const user = req.user
    console.log('----------------insertWorkerService----------------');


    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(400).json({
            message: 'worker id is not valid'
        })
    }

    try {
        const workerDoc = await User.findOne({ _id: workerId })
        console.log(workerDoc, workerId);



        if (!workerDoc) {
            return res.status(404).json({
                message: 'worker was not found'
            })
        }

        if (String(workerDoc.role) !== 'barber') {
            return res.status(400).json({
                message: 'service can only be added for barber users'
            })
        }

        if (workerId !== user && !req.superUser) {
            return res.status(403).json({
                message: 'your not allowd to add service for another worker'
            })
        }


        const hasThisService = await Service.findOne({ worker: workerId, title: title })
        if (hasThisService) {
            return res.status(400).json({
                message: 'the worker already has this service'
            })
        }


        const service = await Service.create({
            title: title,
            price: price,
            worker: workerId
        })


        res.status(201).json({
            message: 'service inserted',
            service
        })
    }
    catch (e) {
        next(e)
    }
}



module.exports.deleteWorkerService = async (req, res, next) => {
    const { serviceId } = req.params
    const user = req.user
    console.log('----------------deleteWorkerService----------------');

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return res.status(400).json({
            message: 'serviceId is not valid'
        })
    }

    try {
        const service = await Service.findOne({ _id: serviceId })

        if (!service) {
            return res.status(404).json({
                message: 'service was not found'
            })
        }

        if (String(service.worker) !== user && !req.superUser) {
            return res.status(403).json({
                message: 'your not allowd to delete service for another worker'
            })
        }


        await Service
            .deleteOne({ _id: serviceId })

        res.status(200).json({
            message: 'service was deleted'
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
        return res.status(400).json({
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
    const { workerId, fromDate, timezone } = req.query
    console.log('----------------getWorkingDates----------------');

    console.log('params', workerId, new Date(fromDate), timezone);


    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(404).json({
            message: 'worker id is not valid'
        })
    }


    const data = await Appointment.aggregate([
        {
            $match: {
                worker: mongoose.Types.ObjectId(workerId),
                start_time: { $gte: new Date(fromDate) },
                status: { $eq: 'free' }
            }
        },


        {
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            date: "$start_time",
                            timezone: timezone,
                            format: '%Y-%m-%dT00:00:00%z'
                        }
                    }
                },
            }
        },
        {
            $sort: {
                '_id.date': 1
            }
        },

        {
            $project: {
                date: '$_id.date',
                _id: 0
            }
        }
    ])

    res.status(200).json({
        message: 'fetch success',
        workingDates: data
    })
}



