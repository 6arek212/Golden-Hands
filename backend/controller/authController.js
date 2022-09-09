const User = require('../models/user')
const jwt = require('jsonwebtoken')



const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}



// TODO: Adjust for loginin with admin / customer 

exports.login = async (req, res, next) => {
    const { phone, password, adminMode } = req.body

    try {
        let user = await User.login(phone, password , adminMode)

        //create token
        const token = createToken(user._id)

        res.status(200).json({
            message: 'login sucess',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone , 
                role: user.role,
                adminMode
            },
            token,
            expiresIn: 3 * 24 * 60 * 60
        })
    } catch (e) {
        next(e)
    }
}



exports.signup = async (req, res, next) => {
    const { firstName, lastName, phone, password, adminMode } = req.body

    console.log(adminMode);

    try {
        const user = await User.signup({ firstName, lastName, phone, password , adminMode})

        //create token
        const token = createToken(user._id)

        res.status(201).json({
            message: 'signup sucess',
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone , 
                role: user.role,
                adminMode
            },
            token
        })
    } catch (e) {
        next(e)
    }
}



