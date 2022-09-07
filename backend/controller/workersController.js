const User = require('../models/user')
const Appointment = require('../models/appointment')
const Schedule = require('../models/schedule')


module.exports.getWorkers = async (req,res,next)=>{

    const workers = await User.find().where('role').ne('customer').select('_id firstName lastName phone')

    res.status(200).json({
        message: 'fetch success',
        workers
    })
}


module.exports.getWorkingDates =async (req,res,next)=>{
    const { workerId , fromDate } = req.query

    const from = new Date(fromDate)
    const to = new Date(from)
    to.setDate(from.getDate() + 6)

    console.log(workerId , from , to);

    const workingDates = await Schedule.find({ worker: workerId })
        res.status(200).json({
            message: 'fetch success',
            workingDates
        })
}


module.exports.insertWorkingDate = async (req, res, next) => {
    const { date } = req.body
    const workerId = req.user

    const hasWorkingDate = await Schedule.findOne({ worker: workerId, date: date })
    if(hasWorkingDate){
        return res.status(400).json({
            message: 'You have already added a working date in this date'
        })
    }

    const workingDate = await Schedule.create({ worker: workerId, date: date })
    res.status(200).json({
        message: 'insert success',
        workingDate
    })
}