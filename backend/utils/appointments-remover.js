
const CronJob = require('cron').CronJob;
const moment = require('moment');
const Appointment = require('../models/appointment')

// run free appointment remover cron job 

const schedulerFactory = function () {
    return {
        start: function () {
            new CronJob('0 0 * * *',async function () {
                console.log('Running Appointments Remover Worker for ' +
                    moment().format());


                const data = await Appointment.deleteMany({ start_time: { $lt: new Date() } , status: 'free'})
                console.log('Appointments Remover Deleted',data.deletedCount);

            }, null, true, '');
        },
    };
};


module.exports = schedulerFactory();
