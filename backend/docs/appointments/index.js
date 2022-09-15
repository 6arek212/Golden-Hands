const getAppointments = require('./get-appointments');
const getAppointment = require('./get-appointment');
const createAppointment = require('./create-appointment');
const updateAppointment = require('./update-appointment');
const deleteAppointment = require('./delete-appointment');


module.exports = {
    paths: {
        '/api/appointments': {
            ...getAppointments,
            ...createAppointment
        },
        '/api/appointments/{id}': {
            ...getAppointment,
            ...updateAppointment,
            ...deleteAppointment
        }
    }
}