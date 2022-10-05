const getWorkingDates = require('./get-working-dates');

const getWorkers = require('./get-workers');
const getWorker = require('./get-worker');
const getWorkerServices = require('./get-worker-services')
const insertWorkerService = require("./insert-worker-service")
const deleteWorkerService = require('./delete-worker-service')

module.exports = {
    '/api/workers': {
        ...getWorkers,
    },
    '/api/workers/{id}': {
        ...getWorker,
    },

    '/api/workers/services/{workerId}': {
        ...getWorkerServices,
    },

    '/api/workers/services': {
        ...insertWorkerService,
    },

    '/api/workers/services/{serviceId}': {
        ...deleteWorkerService,
    },


    '/api/worker/working-dates': {
        ...getWorkingDates,
    },


}