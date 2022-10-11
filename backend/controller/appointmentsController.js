const Appointment = require('../models/appointment')
const User = require('../models/user')
const { Service } = require('../models/service')
const mongoose = require('mongoose')


exports.getAppointments = async (req, res, next) => {
    console.log('--------------- getAppointments requrest ----------------------------');
    const { workerId, service, start_time, end_time, customerId, sort, status, search } = req.query
    const pageSize = + req.query.pageSize
    const currentPage = +  req.query.currentPage

    console.log(pageSize, currentPage, start_time, end_time);

    const query = Appointment.find()



    //sort 
    if (search) {
        // query.find({
        //     $or: [
        //         {
        //             "$expr": {
        //                 "$regexMatch": {
        //                     "input": { "$concat": ["customer.firstName", " ", "customer.lastName"] },
        //                     "regex": search,  //Your text search here
        //                     "options": "i"
        //                 }
        //             }

        //         },
        //         { 'customer.phone': { $regex: "^" + search } }
        //     ]
        // })
    }

    console.log(search);

    //status
    if (status) {
        query.where({ status: status })
    }

    //service
    if (service) {
        query.where({ service: service })
    }

    //barber
    if (workerId) {
        query.where({ worker: workerId })
    }


    //customer
    if (customerId) {
        query.where({ customer: customerId })
    }


    //start time constrian
    if (start_time) {
        query.where('start_time').gt(new Date(start_time))
    }


    //end time constrain
    if (end_time) {
        query.where('end_time').lt(new Date(end_time))
    }

    //sort 
    if (sort) {
        query.sort({ start_time: sort })
    }



    try {
        const q1 = query.clone()
        const count = await q1.count()


        //paging
        if (currentPage && pageSize) {
            query.skip(pageSize * (currentPage - 1))
                .limit(pageSize)
        }

        const appointments = await query.populate('worker customer', 'firstName lastName phone role image').sort({ start_time: sort ? sort : 'asc' })

        res.status(200).json({
            message: 'fetched appointments successfull',
            appointments,
            count
        })
    } catch (e) {
        next(e)
    }
}



exports.createAppointment = async (req, res, next) => {

    //required fields
    const { worker, start_time, end_time, status } = req.body



    try {
        const current_date = new Date()
        const s_time = new Date(start_time)
        const e_time = new Date(end_time)
        const timezone = start_time.substring(start_time.length - 5)

        // var date = new Date(Date.UTC(s_time.getUTCFullYear(), s_time.getUTCMonth(), s_time.getUTCDate()) + timezone);
        // var date = new Date(s_time.getFullYear(), s_time.getMonth(), s_time.getDate());
        const date = new Date(start_time.split('T')[0] + 'T00:00:00' + timezone)

        console.log('create appointment __date__', date, '__start__',
            s_time, '__end__', e_time);


        // check if the worker is valid

        if (!mongoose.Types.ObjectId.isValid(worker)) {
            return res.status(404).json({
                message: 'worker id is not valid'
            })
        }


        const wk = await User.find({ _id: worker })
        if (wk.role === 'customer') {
            return res.status(400).json({
                message: 'worker must have a non customer role'
            })
        }



        //validate dates 
        if (e_time < s_time) {
            return res.status(400).json({
                message: 'the end_date cant be older than start_date'
            })
        }

        if (s_time < current_date) {
            return res.status(400).json({
                message: 'the date cant be older than now'
            })
        }

        const diffTime = Math.abs(e_time - s_time);
        const diff = diffTime / (1000 * 60 * 60);

        if (diff > 3) {
            return res.status(400).json({
                message: 'the dates differ by at most 3 hours !'
            })
        }


        if (diff * 60 < 5) {
            return res.status(400).json({
                message: 'the dates must differ by at least 5 min !'
            })
        }


        const maxEndDate = new Date(date)
        maxEndDate.setDate(maxEndDate.getDate() + 1)
        console.log('min start date', date, 'max end date', maxEndDate);

        if (e_time >= maxEndDate) {
            return res.status(400).json({
                message: 'the max end date is 23:59 , and days cant intersect'
            })
        }


        //check if there is an intersection with another appointment 
        const conflictingAppointments = await Appointment.findOne()
            .where('worker').equals(worker)
            .where('start_time').lt(end_time)
            .where('end_time').gt(start_time)


        if (conflictingAppointments) {
            return res.status(400).json({
                message: 'appointments conflicting'
            })
        }

        const appointment = await Appointment.create({
            worker: worker,
            start_time: start_time,
            end_time: end_time,
            workingDate: date,
            status: status
        })

        await appointment.populate('worker', 'firstName lastName phone role image')

        res.status(201).json({
            message: 'appointment created',
            appointment
        })
    }
    catch (e) {
        next(e)
    }
}




exports.getAvailableAppointments = async (req, res, next) => {
    const { workerId, workingDate, fromDate } = req.query

    const date = new Date(fromDate)
    console.log(workerId, fromDate, date, workingDate);

    try {
        const query = Appointment.find({
            worker: workerId,
            customer: null,
            status: 'free'
        })

        query.where('start_time').gte(date)
        query.where('workingDate').equals(workingDate)


        const appointments = await query.populate('worker', 'firstName lastName phone role image').sort({ start_time: 'asc' })


        res.status(200).json({
            message: 'fetched success',
            availableAppointments: appointments
        })
    }
    catch (e) {
        next(e)
    }
}


exports.getUserAppointment = async (req, res, next) => {
    console.log('--------------- getAppointment requrest ----------------------------');
    const user = req.user
    try {
        const appointment = await Appointment.findOne({ customer: user, status: 'in-progress' })
            .populate('customer', 'firstName lastName phone role image')
            .populate('worker', 'firstName lastName phone role image')

        res.status(200).json({
            message: 'fetched appointment successfull',
            appointment
        })
    } catch (e) {
        next(e)
    }
}



exports.getUserAppointments = async (req, res, next) => {

    const user = req.user
    try {
        const appointments = await Appointment.find({ customer: user })
            .populate('customer', 'firstName lastName phone role image')
            .populate('worker', 'firstName lastName phone role image').sort({ 'status': 'desc' })

        res.status(200).json({
            message: 'fetched appointment successfull',
            appointments
        })
    } catch (e) {
        next(e)
    }
}





// only admin can delete an appointment !!!!
exports.deleteAppointment = async (req, res, next) => {
    const { appointmentId, message } = req.params

    try {
        const appointment = await Appointment.findOne({ _id: appointmentId })

        if (!appointment) {
            return res.status(404).json({
                message: 'appointment not found'
            })
        }


        //TODO : SEND MESSAGE TO THE CUSTOMER , APPOINTMENT HAS BEEN cancelled

        await Appointment.deleteOne({ _id: appointmentId })
        res.status(200).json({
            message: 'appointment deleted'
        })
    }
    catch (e) {
        next(e)
    }
}



const statusEnum = ['done', 'in-progress', 'didnt-come', 'canceled', 'free', 'hold']

exports.updateAppointmentStatus = async (req, res, next) => {
    try {
        const { appointmentId, status, service } = req.body
        const user = req.user

        if (!(statusEnum.includes(status))) {
            return res.status(400).json({
                message: 'status in not valid'
            })
        }

        const appointment = await Appointment.findOne({ _id: appointmentId })
        if (!appointment) {
            return res.status(404).json({
                message: 'appointment was not found'
            })
        }

        if (String(appointment.worker) !== user && !req.superUser) {
            return res.status(403).json({
                message: 'its not your appointment you cant modify it'
            })
        }


        // if ((status === 'free' || status === 'hold') && appointment.customer) {
        //     return res.status(400).json({
        //         message: 'the appointment is booked, You can change the status to done , in-progress , didnt-come , canceled'
        //     })
        // }

        //TODO: if we want to make the appointment in-progress again we the time must not be older than today !!!!! 
        const updateOps = { status }
        if ((status === 'free')) {
            updateOps.customer = null
            updateOps.service = null
        }

        if (status === 'hold') {
            updateOps.customer = null
            updateOps.service = null

            const workerService = await Service.findOne({ title: service, worker: appointment.worker })
            console.log(workerService);
            if(!workerService){
                return res.status(403).json({
                    message: 'the worker does not have this service'
                })
            }

            updateOps.service = workerService
        }


        const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId },
            { ...updateOps },
            { new: true })
            .populate('worker', 'firstName lastName phone role image')
            .populate('customer', 'firstName lastName phone role image')


        res.status(200).json({
            message: 'appointment status updated',
            appointment: updatedAppointment
        })
    }
    catch (e) {
        next(e)
    }
}





exports.bookAppointment = async (req, res, next) => {
    try {
        const { service, appointmentId, userId: customerId } = req.body
        const user = req.user


        const currentDate = new Date()

        const appointmentExists = await Appointment.findOne({ _id: appointmentId })

        if (!appointmentExists) {
            return res.status(404).json({
                message: 'appointment was not found !'
            })
        }


        if (appointmentExists.start_time < currentDate) {
            return res.status(400).json({
                message: 'you cant book an old appointment',
                errorCode: 4
            })
        }


        if (user !== customerId && !req.worker_mode && !req.superUser) {
            return res.status(401).json({
                message: 'you\'r not authorized to book an appointment for another user'
            })
        }


        if (appointmentExists.status === 'hold') {
            return res.status(400).json({
                message: 'the appointment is in hold you cant book it',
                errorCode: 3
            })
        }


        const hasAppointment = await Appointment.findOne({ customer: customerId, status: 'in-progress' })

        console.log('has appointment', hasAppointment);

        if (hasAppointment) {
            return res.status(400).json({
                message: 'you already have an appointment',
                errorCode: 1
            })
        }


        const serviceDoc = await Service
            .findOne({ _id: service, worker: appointmentExists.worker })
            .select('price title')

        if (!serviceDoc) {
            return res.status(404).json({
                message: 'service could not be found'
            })
        }


        console.log(serviceDoc);



        const appointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId, customer: null, status: 'free' },
            { service: serviceDoc, customer: customerId, status: 'in-progress' },
            { new: true, runValidators: true })
            .populate('worker', 'firstName lastName phone role image')
            .populate('customer', 'firstName lastName phone role image')

        if (!appointment) {
            return res.status(400).json({
                message: 'appointment has already been booked',
                errorCode: 2
            })
        }

        res.status(200).json({
            message: 'appointment booked !',
            appointment
        })
    }
    catch (e) {
        next(e)
    }
}




exports.unbookAppointment = async (req, res, next) => {
    try {
        const { appointmentId } = req.body
        const user = req.user


        const appointment = await Appointment.findOne({ _id: appointmentId })


        if (!appointment) {
            return res.status(404).json({
                message: 'appointment was not found !'
            })
        }

        if (!appointment.customer) {
            return res.status(400).json({
                message: 'appointment is not booked !',
                errorCode: 1
            })
        }

        if (!(String(appointment.customer) === user) && !req.worker_mode && !req.superUser) {
            return res.status(401).json({
                message: 'you\'r not authorized to unbook this appointment'
            })
        }


        await Appointment.updateOne(
            { _id: appointmentId },
            { service: null, customer: null, status: 'free' }
        )

        res.status(200).json({
            message: 'appointment unbooked'
        })
    }
    catch (e) {
        next(e)
    }
}