const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requireAuth = async (req, res, next) => {

    const { authorization } = req.headers
    if (!authorization) {
        return res.status(403).json({ message: 'Authorization token required' })
    }

    const token = authorization.split(' ')[1]


    try {
        const { _id } = await jwt.verify(token, process.env.SECRET)

        const user = await User.findOne({ _id })
        if (!user) {
            return res.status(401).json({
                message: 'Request is not authorized'
            })
        }

        req.worker_mode = user.role !== 'customer'
        req.user = _id
        next()
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Request is not authorized' })
    }
}





const requireWorkerAuth = async (req, res, next) => {

    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ message: 'Authorization token required' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = await jwt.verify(token, process.env.SECRET)

        const worker = await User.findOne({ _id })
        if (!worker || worker.role === 'customer') {
            return res.status(401).json({
                message: 'Request is not authorized'
            })
        }

        req.user = _id
        next()
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Request is not authorized' })
    }
}




module.exports = { requireAuth, requireWorkerAuth }