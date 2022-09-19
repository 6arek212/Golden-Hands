const getAppointments = require('./get-appointments');
const getAppointment = require('./get-appointment');
const createAppointment = require('./create-appointment');
const updateAppointmentStatus = require('./update-appointment-status');
const deleteAppointment = require('./delete-appointment');
const bookAppointment = require('./book-appointment');
const unbookAppointment = require('./unbook-appointment');


module.exports = {
    '/api/appointments': {
        ...getAppointments,
        ...createAppointment
    },

    '/api/appointments/update-status': {
        ...updateAppointmentStatus
    },

    '/api/appointments/{id}': {
        ...getAppointment,
        ...deleteAppointment
    },
    '/api/appointments/book': {
        ...bookAppointment
    },
    '/api/appointments/unbook': {
        ...unbookAppointment
    },
}