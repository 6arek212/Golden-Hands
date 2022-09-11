const User = require('../models/user')
const Appointment = require('../models/appointment')
const Schedule = require('../models/schedule')
const mongoose = require('mongoose')


module.exports.getWorkers = async (req,res,next)=>{
    console.log('----------------getWorkers----------------');

    try{
    const workers = await User
        .find()
        .where('role').ne('customer')
        .select('_id firstName lastName phone role image')

    res.status(200).json({
        message: 'fetch workers success',
        workers
    })
}
catch(e){
        next(e)
}
}


module.exports.getWorker =  async (req,res,next)=>{
    const {workerId} = req.params
    console.log('----------------getWorker----------------');

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(404).json({
            message: 'worker id is not valid'
        })
    }

    try{
    const worker = await User
        .findOne({ _id: workerId })
        .where('role').ne('customer')
        .select('_id firstName lastName phone role image')

    
    if(!worker){
        return res.status(404).json({
            message:'worker was not found'
        })
    }


    res.status(200).json({
        message: 'fetch worker success',
        worker
    })
}
catch(e){
        next(e)
}
}


module.exports.getWorkingDates =async (req,res,next)=>{
    const { workerId , fromDate } = req.query
    console.log('----------------getWorkingDates----------------');
    console.log('params', workerId, fromDate);

   

    if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(404).json({
            message: 'worker id is not valid'
        })
    }


    const query = Schedule.find({ worker: workerId })


    if(fromDate){
        const from = new Date(fromDate)
        const to = new Date(from)
        to.setDate(from.getDate() + 6)
    

        if(from){
            query.where('date').gte(from)
        }
        
        if(to){
            query.where('date').lte(to)
        }
    }

try{
    const workingDates = await query
        .sort({ date: 'asc' })
        .populate('worker', 'firstName lastName phone role image')
        .select('_id worker date isActive')

        res.status(200).json({
            message: 'fetch working dates success',
            workingDates
        })
    }catch(e){
        next(e)
    }
}


module.exports.insertWorkingDate = async (req, res, next) => {
    console.log('----------------insertWorkingDate----------------');

    //these are required fields
    const { date, workerId } = req.body
    const workerAuthId = req.user

    // TODO:  add top level worker!!!!
    if(workerAuthId !== workerId ){
        return res.status(403).json({ 
            message: 'you cant add a working date for another worker, you must be a top level worker !'
        })
    }


    console.log(date);

    const workingDateUTC = new Date(date)
    workingDateUTC.setHours(0)
    workingDateUTC.setMinutes(0)
    workingDateUTC.setSeconds(0)
    workingDateUTC.setMilliseconds(0)

    const workingDateUTCPlusDay = new Date(workingDateUTC)
    workingDateUTCPlusDay.setDate(workingDateUTCPlusDay.getDate() + 1)


    console.log(workingDateUTC , workingDateUTCPlusDay);

    try{
    const hasWorkingDate = await Schedule.findOne({ worker: workerId, date: date })
        .where('date').gte(workingDateUTC)
        .where('date').lt(workingDateUTCPlusDay)


    if(hasWorkingDate){
        return res.status(400).json({
            message: 'You have already added a working date in this date'
        })
    }

    const workingDate = await Schedule.create({ worker: workerId, date: date })
    res.status(200).json({
        message: 'insert working date success',
        workingDate
    })
}catch(e){
    next(e)
}
}