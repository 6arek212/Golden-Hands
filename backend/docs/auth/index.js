const sendAuthVerification = require('./send-auth-verification');
const verifyAndSignup = require('./verify-and-signup');
const verifyAndLogin = require('./verify-and-login');
const refreshToken = require('./refresh-token');
const signup = require('./signup');



module.exports = {
    '/api/send-auth-verification': {
        ...sendAuthVerification
    },

    '/api/signup-verify-phone': {
        ...verifyAndSignup
    },

    '/api/login-verify-phone': {
        ...verifyAndLogin
    },

    '/api/refresh-token': {
        ...refreshToken
    },

    '/api/signup': {
        ...signup
    }

}