const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const appointments = require('./appointments');


module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...appointments
};