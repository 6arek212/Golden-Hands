const getWorkingDates = require('./get-working-dates');

const getWorkers = require('./get-workers');
const getWorker = require('./get-worker');


module.exports = {
    '/api/workers': {
        ...getWorkers,
    },
    '/api/workers/{id}': {
        ...getWorker,
    },



    '/api/worker/working-dates': {
        ...getWorkingDates,
    },

    
}