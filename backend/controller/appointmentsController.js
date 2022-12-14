const Appointment = require('../models/appointment')
const User = require('../models/user')
const { Service } = require('../models/service')
const mongoose = require('mongoose')
const whatsapp = require('../utils/whatsapp')
const moment = require('moment')

exports.getAppointments = async (req, res, next) => {
    console.log('--------------- getAppointments requrest ----------------------------');
    const { workerId, service, start_time, end_time, customerId, sort, status, search } = req.query
    const pageSize = + req.query.pageSize
    const currentPage = +  req.query.currentPage

    console.log(workerId, search, pageSize, currentPage, start_time, end_time, status);

    // const query = Appointment
    //     .find()
    //     .populate('worker customer')


    const query = Appointment.aggregate()

    //barber
    if (workerId) {
        query.match({
            'worker': new mongoose.Types.ObjectId(workerId)
        })
    }


    //customer
    if (customerId) {
        query.match({
            'customer': new mongoose.Types.ObjectId(customerId)
        })
    }


    query.lookup({
        from: 'users',
        localField: 'worker',
        foreignField: '_id',
        as: 'worker'
    })
        .lookup({
            from: 'users',
            localField: 'customer',
            foreignField: '_id',
            as: 'customer'
        })
        .unwind({
            "path": "$worker",
            "preserveNullAndEmptyArrays": true
        })
        .unwind({
            "path": "$customer",
            "preserveNullAndEmptyArrays": true
        })


    //sort 
    if (search) {
        query
            .addFields({
                fullName: { $concat: ['$customer.firstName', ' ', '$customer.lastName'] }
            })
            .match({
                $or: [
                    { 'fullName': { $regex: search, $options: "i" } },
                    { 'customer.phone': { $regex: search, $options: "i" } }
                ]
            })
    }


    //status
    if (status) {
        if (status === 'in-progress') {
            query.match({
                $or: [{ status: 'in-progress' }, { status: 'hold' }]
            })
        } else {
            query.match({
                status: status
            })
        }
    }

    //service
    if (service) {
        query.match({
            service: service
        })
    }




    //start time constrian
    if (start_time) {
        query.match({
            start_time: { $gte: new Date(start_time) }
        })
    }


    //end time constrain
    if (end_time) {
        query.match({
            end_time: { $lt: new Date(end_time) }
        })
    }


    let numberOfActiveCustomers;
    if (start_time && end_time) {
        numberOfActiveCustomers = await Appointment.count({
            $or: [{ status: 'in-progress' }, { status: 'done' }, { status: 'hold' }],
            start_time: { $gte: new Date(start_time) },
            end_time: { $lt: new Date(end_time) } , 
            worker: workerId
        })
    }


    try {

        //paging
        if (currentPage && pageSize) {
            query.skip(pageSize * (currentPage - 1))
                .limit(pageSize)
        }


        const appointments = await query.sort({ start_time: sort ? sort : 1 })


        res.status(200).json({
            message: 'fetched appointments successfull',
            appointments: appointments,
            numberOfActiveCustomers: numberOfActiveCustomers
        })
    } catch (e) {
        next(e)
    }
}



const getAppointmentsListFromRange = (worker, startDate, endDate, duration = 30) => {

    console.log('creating appointments', duration);
    var date1 = moment(startDate)
    const list = []


    const diffTime = Math.abs(startDate - endDate);
    const hourDiff = diffTime / (1000 * 60);

    const numberOfAppointments = parseInt(hourDiff / duration)

    console.log(numberOfAppointments);
    const date2 = moment(date1)
    date2.add(duration, 'minutes')

    for (var i = 0; i < numberOfAppointments; i++) {
        list.push({
            worker: worker,
            start_time: date1.format(),
            end_time: date2.format()
        })
        date1.add(duration, 'minutes')
        date2.add(duration, 'minutes')
    }

    return list
}

exports.createRangeAppointments = async (req, res, next) => {
    console.log('-----------createRangeAppointments-------------');
    const { worker, start_time, end_time, duration, status } = req.body

    const timezone = start_time.substring(start_time.length - 5)
    const workingDate = new Date(start_time.split('T')[0] + 'T00:00:00' + timezone)

    const maxEndDate = new Date(workingDate)
    maxEndDate.setDate(maxEndDate.getDate() + 1)
    console.log('workingDate', workingDate, 'end working date', maxEndDate);


    const current_date = new Date()
    const s_time = new Date(start_time)
    const e_time = new Date(end_time)



    // check if the worker is valid
    if (!mongoose.Types.ObjectId.isValid(worker)) {
        return res.status(404).json({
            message: 'worker id is not valid'
        })
    }


    const wk = await User.findOne({ _id: worker })
    if (wk.role !== 'barber') {
        return res.status(400).json({
            message: 'worker must have a non customer role'
        })
    }



    console.log('s_time', s_time, 'e_time date', e_time);

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

    if (diff > 24) {
        return res.status(400).json({
            message: 'the max start to end is 24 hours'
        })
    }


    if (diff * 60 < 5) {
        return res.status(400).json({
            message: 'the min start to end is 5 min'
        })
    }


    if (e_time >= maxEndDate) {
        return res.status(400).json({
            message: 'the max end date is 23:59 , and days cant intersect'
        })
    }

    if (duration < 5 || duration > 120) {
        return res.status(400).json({
            message: 'the max duration is 120 and the min is 5'
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


    // make all appointments
    const appointmentsList = getAppointmentsListFromRange(worker, s_time, e_time, duration)

    console.log(appointmentsList);

    // insert all 

    try {
        const result = await Appointment.insertMany(appointmentsList)

        res.status(200).json({
            message: 'appointments created',
            appointments: result
        })
    }
    catch (e) {
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

        console.log(start_time, end_time, 'create appointment __date__', date, '__start__',
            s_time, '__end__', e_time)


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

        await appointment.populate('worker')

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

    console.log(workerId, fromDate, workingDate);
    const workingDateStart = new Date(workingDate)
    const workingDateEnd = new Date(workingDate)
    workingDateEnd.setDate(workingDateEnd.getDate() + 1)

    console.log(workingDateStart, workingDateEnd);

    try {
        const query = Appointment.find({
            worker: workerId,
            customer: null,
            status: 'free'
        })

        if (fromDate) {
            const date = new Date(fromDate)
            query.where('start_time').gt(date)
        }

        if (workingDate) {
            query.where('start_time').gte(workingDateStart)
                .where('start_time').lt(workingDateEnd)
        }


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
            .populate('customer')
            .populate('worker')

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
            .populate('customer')
            .populate('worker').sort({ 'status': 'desc', start_time: 'desc' })

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
    const { appointmentId } = req.params

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


exports.deleteAppointments = async (req, res, next) => {
    const { appointments } = req.body

    try {
        const result = await Appointment.deleteMany({ _id: { $in: appointments } })
        console.log(result)
        res.status(200).json({
            message: 'appointments deleted'
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


        if (appointment.status === 'done' && status !== 'canceled' && status !== 'didnt-come') {
            return res.status(400).json({
                message: 'this appointment is marked as done, you cant change the status to other than , canceled , didnt-come , done'
            })
        }


        if (appointment.status === 'free' && status !== 'hold' && status !== 'canceled') {
            return res.status(400).json({
                message: 'free appointment can only be hold'
            })
        }


        if (appointment.status === 'canceled' && status !== 'hold' && status !== 'free' && status !== 'didnt-come') {
            return res.status(400).json({
                message: 'canceled appointment can only be hold or free'
            })
        }


        if (appointment.status === 'hold' && status !== 'free' && status !== 'canceled' && status !== 'didnt-come' && status !== 'done') {
            return res.status(400).json({
                message: 'holded appointment status cant be changed to in-progress'
            })
        }

        if (appointment.status === 'didnt-come' && status !== 'free' && status !== 'canceled' && status !== 'hold') {
            return res.status(400).json({
                message: 'didnt-come appointment can only be canceled , free or hold'
            })
        }


        if (status === 'hold' && !appointment.service && !service) {
            return res.status(403).json({
                message: 'you cant change the status to hold without a service'
            })
        }


        const updateOps = { status }
        if ((status === 'free')) {
            updateOps.customer = null
            updateOps.service = null
        }

        if (status === 'hold') {
            //TODO: HANDLE CUSTOMER 
            updateOps.customer = null
            updateOps.service = null

            const workerService = await Service.findOne({ title: service, worker: appointment.worker })
            console.log(workerService);
            if (!workerService) {
                return res.status(403).json({
                    message: 'the worker does not have this service'
                })
            }

            updateOps.service = workerService
        }


        const updatedAppointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId },
            { ...updateOps },
            { new: true, runValidators: true })
            .populate('worker')
            .populate('customer')


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
        const userDoc = await User.findOne({ _id: customerId })
        whatsapp.sendMessage(userDoc.phone, 'booked')

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



exports.rate = async (req, res, next) => {
    const { rate, appointmentId } = req.body
    const { user, superUser } = req

    try {
        const appointment = await Appointment.findOne({ _id: appointmentId })

        if (!appointment) {
            return res.status(404).json({
                message: 'Appointment was not found'
            })
        }

        console.log(appointment.customer, user, appointment.customer !== user)

        //TODO: somthing wrong with this condition
        if (!appointment.customer.equals(user) && !superUser) {
            return res.status(403).json({
                message: 'You are not authorized'
            })
        }


        const app = await Appointment.findOneAndUpdate(
            { _id: appointment },
            { rating: rate },
            { runValidators: true, new: true })
            .populate('worker', 'firstName lastName phone role image')
            .populate('customer', 'firstName lastName phone role image')

        res.status(200).json({
            message: 'rating has been submited',
            appointment: app
        })

    } catch (e) {
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