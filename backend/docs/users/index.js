const getUsers = require('./get-users');
const getUser = require('./get-user');
const updateUser = require('./update-user');
const deleteUser = require('./delete-user');
const uploadImage = require('./upload-image');


module.exports = {
    '/api/users': {
        ...getUsers,
    },
    '/api/users/{id}': {
        ...getUser,
        ...updateUser,
        ...deleteUser,
    },
    '/api/users/upload-image':{
        ...uploadImage
    }
}