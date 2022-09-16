const getStats = require('./get-stats');

module.exports = {
    '/api/dashboard/stats': {
        ...getStats
    }
}