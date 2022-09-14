const mongoose = require('mongoose')
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    role: { type: String, required: true, default: 'customer' },
    image: { type: String }
}, {
    timestamps: true
})


// statiac signup method
userSchema.statics.signup = async function ({ phone, firstName, lastName, birthDate, imagePath, adminMode }) {

    //validation
    if (!phone || !firstName || !lastName) {
        throw Error('All fileds must be filled')
    }

    // if (!validator.isStrongPassword(password)) {
    //     throw Error('Password is not strong enough')
    // }


    const exists = await this.findOne({ phone: phone })
    if (exists) {
        throw Error('Phone already in use')
    }

    const user = await this.create({ phone, firstName, lastName, birthDate, image: imagePath })

    return user
}


// statiac login method
userSchema.statics.login = async function (phone, adminMode) {

    //validation
    if (!phone) {
        throw Error('All fileds must be filled')
    }

    const user = await this.findOne({ phone: phone })
    if (!user) {
        throw Error('Invalid credentials')
    }

    return user
}



module.exports = mongoose.model('user', userSchema)