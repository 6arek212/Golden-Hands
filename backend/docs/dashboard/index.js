const getStats = require('./get-stats');
const getWorkerRevenue = require('./get-worker-revenue');

module.exports = {
    '/api/dashboard/stats': {
        ...getStats
    },
    '/api/dashboard/worker-revenue': {
        ...getWorkerRevenue
    }
}