const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        match: /^[a-zA-Z\u0590-\u05fe\u0621-\u064A]+( [a-zA-Z\u0590-\u05fe\u0621-\u064A]+)*$/,
        תminlength: 2,
        maxlength: 24
    },
    lastName: {
        type: String,
        required: true,
        match: /^[a-zA-Z\u0590-\u05fe\u0621-\u064A]+( [a-zA-Z\u0590-\u05fe\u0621-\u064A]+)*$/,
        תminlength: 2,
        maxlength: 24
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]+$/,
        תminlength: 2,
        maxlength: 24
    },
    birthDate: {
        type: Date,
        required: true
    },
    role: { type: String, required: true, default: 'customer', enum: ['barber', 'customer'] },
    superUser: { type: Boolean },
    image: { type: String },
    isBlocked: { type: Boolean, default: false }
}, {
    strictPopulate: false,
    timestamps: true
})


// statiac signup method
userSchema.statics.signup = async function ({ phone, firstName, lastName, birthDate, imagePath, role }) {

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

    const user = await this.create({ phone, firstName, lastName, birthDate, image: imagePath, role: role })

    return user
}


// statiac login method
userSchema.statics.login = async function (phone) {

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