const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const appointments = require('./appointments');
const workers = require('./workers')
const users = require('./users')
const auth = require('./auth')
const dashboard = require('./dashboard')

module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    paths: {
        ...appointments,
        ...workers,
        ...users,
        ...auth,
        ...dashboard
    }
};