const Appointment = require('../models/appointment')
const User = require('../models/user')
const moment = require('moment')


const getAppointmentsForBarber = ()=>{
    
}

const getAppointmentsForCustomer = ()=>{
    
}

// only barbers role can use this !!
exports.getAppointments = async (req, res, next) => {
    console.log('--------------- getAppointments requrest ----------------------------');
    const { barber , service , start_time , end_time , page , pageSize } =  req.query


    const query = Appointment.find()
    

    if(barber){
        query.where({barber})        
    }



    if (currentPage && pageSize) {
        query.skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }


    if (customerId) {
        query.where({ customer: customerId })
    }


    try {
        const count = await Appointment.count()
        const appointments = await query.sort({ date: 'desc', time: 'desc' })

        res.status(200).json({
            message: 'fetched appointments successfull',
            appointments,
            count
        })
    } catch (e) {
        next(e)
    }
}



// only barbers role can use this !!
exports.createAppointment = async (req, res, next) => {
    const { worker, start_time, end_time, } = req.body
    
    const current_date = new Date()
    const s_time = new Date(start_time)
    const e_time = new Date(end_time)


    //validate dates 

    if(e_time < s_time){
        return res.status(400).json({
            message:'the end_date cant be older than start_date'
        })
    }

    if(s_time < current_date){
        return res.status(400).json({
            message:'the date cant be older than now'
        })
    }

    const diffTime = Math.abs(e_time - s_time);
    const diff = diffTime / (1000 * 60 * 60); 
   
    if(diff > 3 ){
        return res.status(400).json({
            message:'the dates differ by at most 3 hours !'
        })
    }


    if (diff * 60 < 5) {
        return res.status(400).json({
            message:'the dates must differ by at least 5 min !'
        })
    }


    // check if the worker is valid 

    const wk = await User.find({ _id: worker })
    if(wk.role === 'customer'){
        return res.status(400).json({
            message:'worker must have a non customer role'
        })
    }



    //check if there is an intersection with another appointment 
    const conflictingAppointments = await Appointment.find()
        .where('start_time').lt(end_time)
        .where('end_time').gt(start_time)

    if (conflictingAppointments.length > 0) {
        return res.status(400).json({
            message:'appointments conflicting'
        })
    }


    const appointment = await Appointment.create({
        worker: worker , 
        start_time: start_time , 
        end_time: end_time
    })
    
    res.status(201).json({
        message:'appointment created' ,
        appointment
    })
}




exports.getAvailableAppointments = async (req ,res , next) => {
    const { worker , date  } =  req.query

    if(!worker){
        return res.status(400).json({
            message: 'you have to provide a worker'
        })
    }

    if(!date){
        return res.status(400).json({
            message: 'you have to provide a date'
        })
    }

    const date1 = new Date(date)
    const date2 = new Date(date)
    date2.setDate(date2.getDate() + 1)

    const appointments = await Appointment.find({
        start_time: {
            $gte: new Date(date1),
            $lte: new Date(date2) ,
        },
        customer : null ,
        worker
    })

    res.status(200).json({
        message:'fetched success',
        appointments
    })
}


exports.getUserAppointment = async (req, res, next) => {
    console.log('--------------- getAppointment requrest ----------------------------');
    const user = req.user
    try {
        const appointment = await Appointment.findOne({customer: user})

        res.status(200).json({
            message: 'fetched appointment successfull',
            appointment
        })
    } catch (e) {
        next(e)
    }
}



// only admin can update an appointment !!!!
exports.updateAppointment = async (req, res, next) => {
    const { _id: customerId } = req.user

    const appointment = await Appointment.findOneAndUpdate({ _id: customerId }, { ...req.body }, { new: true, runValidators: true })
    res.status(201).json({
        message: 'appointment booked !',
        appointment
    })
}



// only admin can delete an appointment !!!!
exports.deleteAppointment = async (req, res, next) => {
    const { appointmentId } = req.params

    const appointment = await Appointment.findOne({ _id: appointmentId })

    if (!appointment) {
        return res.status(404).json({
            message: 'appointment not found'
        })
    }

   if(appointment.customer){
    return res.status(404).json({
        message: 'appointment has been book ! , you must unbook first'
    })
   }

    await Appointment.deleteOne({ _id: appointmentId })
    res.status(200).json({
        message: 'appointment deleted !'
    })
}






exports.bookAppointment = async (req, res, next) => {
    try {
        const { service , appointmentId } = req.body
        const customerId  = req.user

        const hasAppointment = await Appointment.findOne({ customer: customerId })

        if (hasAppointment) {
            return res.status(400).json({
                message: 'you already have an appointment !'
            })
        }

        const appointment = await Appointment.findOneAndUpdate({ _id: appointmentId, customer: null },
             { service, customer: customerId, isActive: true })
        
        if(!appointment){
            return res.status(400).json({
                message: 'appointment is already been booked !',
                appointment
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
        const customerId = req.user

        const appointment = await Appointment.findOne({ _id: appointmentId })
        if (!appointment) {
            return res.status(404).json({
                message: 'appointment was not found !'
            })
        }

        if (appointment.customer != customerId) {
            return res.status(401).json({
                            message: 'you\'r not authorized to unbook this appointment !'
            })
        }
        
        await Appointment.updateOne({ _id: appointmentId }, { service: null, customer: null, isActive: false })
        
        res.status(200).json({
            message: 'appointment unbooked !'
        })
    }
    catch (e) {
        next(e)
    }
}