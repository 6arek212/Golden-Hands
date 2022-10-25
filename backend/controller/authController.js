const User = require('../models/user')
const Verify = require('../models/verify')
const jwt = require('jsonwebtoken')

const whatsapp = require('../utils/whatsapp')


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const loginTries = 10









// const uploadFile = async (fileFieldName, req, res) => {
//     return new Promise((resolve, reject) => {

//         try {
//             const id = mongoose.Types.ObjectId();
//             const fileName = Date.now() + '_' + id

//             var upload = multer({
//                 storage: storage('imgs', fileName),
//                 limits: fileLimits,
//                 fileFilter: fileFilter
//             }).single(fileFieldName);


//             upload(req, res, function (err) {
//                 if (err) {
//                     return resolve(err)
//                 }
//                 console.log(req.body.name, '   ', req.file.filename);
//                 resolve()
//             })
//         } catch (err) {
//             reject(err)
//         }
//     })
// }


// const fileUpResult = await uploadFile('image', req, res)



const createToken = (_id, type = 'auth') => {
    time = '30d'
    const date = new Date()

    if (type == 'auth') {
        time = '7d'
        date.setDate(date.getDate() + 7)
    }
    else if (type == 'refresh') {
        time = '30d'
        date.setDate(date.getDate() + 30)
    }

    return {
        token: jwt.sign({ _id }, process.env.SECRET, { expiresIn: time }),
        expireDate: date
    }
}


// TODO: Adjust for loginin with admin / customer 
/// ADD LOGIN AUTH AND PREVENT IF NOT EXISTS
exports.sendAuthVerification = async (req, res, next) => {
    const { phone, isLogin, isSignup } = req.body

    console.log(isLogin);

    try {
        const user = await User.findOne({ phone: phone })
        if (!user && isLogin) {
            return res.status(404).json({
                message: "user with this number was not found"
            })
        }


        if (user && isSignup) {
            return res.status(400).json({
                message: "user with this number already exists"
            })
        }


        if (!isLogin && !isSignup && !req.user) {
            return res.status(403).json({
                message: "your not authorized"
            })
        }


        const verifiesCount = await Verify.count({ phone: phone, forAuth: true })
        if (verifiesCount > loginTries) {
            return res.status(403).json({
                message: "you have too many login tries , try again after some time"
            })
        }

        // const code = Math.floor(1000 + Math.random() * 9000)
        const code = "1234"

        const verify = await Verify.create({
            code: code,
            phone: phone,
            forAuth: true
        })


        // client.messages
        //     .create({
        //         body: 'מספרת אברהים ,' + '\n' + 'הקוד שלך הוא :' + '\n#' + code + '\n' + `צריך להזין אותו באפליקציה שלנו`,
        //         messagingServiceSid: 'MG91cc7f21e93e935e4de2d16a90c4b45d',
        //         to: '+972' + phone
        //     })
        //     .then(message => console.log(message.sid))
        //     .catch(e => console.log('sending message error:', e))

        whatsapp.sendMessage(phone, 'code2', [{
            type: 'text',
            text: `${code}`
        }])


        res.status(201).json({
            message: 'verification sent',
            verifyId: verify._id
        })

    } catch (e) {
        next(e)
    }
}





exports.signup = async (req, res, next) => {
    const { firstName, lastName, birthDate, phone, role } = req.body
    const { superUser, user: userId } = req

    if (!superUser) {
        return res.status(400).json({
            message: "only super user can use this route"
        })
    }


    try {
        let user = await User.findOne({ phone: phone })


        if (user) {
            return res.status(400).json({
                message: "user with this number already exists"
            })
        }


        user = await User.signup({
            firstName, lastName, phone, birthDate, role
        })


        res.status(201).json({
            message: 'signup sucess',
            authData: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    image: user.image,
                }
            }
        })
    }
    catch (e) {
        next(e)
    }

}



exports.verifyAndSignup = async (req, res, next) => {
    const { verifyId, code, firstName, lastName, birthDate, phone, role } = req.body
    const { worker_mode } = req

    try {
        let user = await User.findOne({ phone: phone })


        if (user) {
            return res.status(400).json({
                message: "user with this number already exists"
            })
        }


        const verify = await Verify.findOne({ _id: verifyId })
        if (!verify) {
            return res.status(404).json({
                message: 'No verification found !'
            })
        }

        if (verify.code !== code) {
            return res.status(403).json({
                message: 'Code not match !'
            })
        }

        user = await User.signup({
            firstName, lastName, phone, birthDate,
            role: worker_mode && role ? role : 'customer'
        })


        //create token
        const { token, expireDate } = createToken(user._id, 'auth')
        const { token: refresh_token, expireDate: expireDateRefreshToken } = createToken(user._id, 'refresh')

        res.status(201).json({
            message: 'signup sucess',
            authData: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    image: user.image,
                },
                token,
                refresh_token,
                expiresIn: 3 * 24 * 60 * 60,
                expireDateRefreshToken: expireDateRefreshToken,
                expireDate: expireDate
            }
        })
    } catch (e) {
        next(e)
    }
}




exports.verifyAndLogin = async (req, res, next) => {
    const { phone, verifyId, code } = req.body

    try {

        // check if the code match
        const verify = await Verify.findOne({ _id: verifyId })
        if (!verify) {
            return res.status(404).json({
                message: 'No verification found !'
            })
        }

        if (verify.code !== code) {
            return res.status(403).json({
                message: 'Code not match !'
            })
        }

        let user = await User.login(phone)
        // console.log('aaaaaaaaa');

        //create token
        const { token, expireDate } = createToken(user._id, 'auth')
        const { token: refresh_token, expireDate: expireDateRefreshToken } = createToken(user._id, 'refresh')


        res.status(200).json({
            message: 'login sucess',
            authData: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    image: user.image,

                },
                token,
                refresh_token,
                expiresIn: 3 * 24 * 60 * 60,
                expireDateRefreshToken: expireDateRefreshToken,
                expireDate: expireDate
            }
        })

    } catch (e) {
        next(e)
    }
}










exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body

    try {
        console.log('----------------Refresh Token---------------');

        const { _id } = await jwt.verify(refreshToken, process.env.SECRET)

        const { token: newtoken, expireDate } = createToken(_id, 'auth')

        res.status(200).json({
            message: 'token refreshed',
            token: newtoken,
            expireDate: expireDate
        })

    } catch (e) {
        next(e)
    }
}










exports.verifyAndUpdatePhone = async (req, res, next) => {
    const { phone, verifyId, code, userId } = req.body
    const userIdAuth = req.user

    try {
        let user = await User.findOne({ phone: phone })

        if (user) {
            return res.status(400).json({
                message: "user with this number already exists"
            })
        }

        if (userIdAuth !== userId && !req.worker_mode) {
            return res.status(403).json({
                message: "Your not allowed to do that"
            })
        }

        // check if the code match
        const verify = await Verify.findOne({ _id: verifyId })
        if (!verify) {
            return res.status(404).json({
                message: 'No verification found'
            })
        }

        if (verify.code !== code) {
            return res.status(403).json({
                message: 'Code not match'
            })
        }

        user = await User.findOneAndUpdate({ _id: userId }, { phone: phone }, { runValidators: true, returnOriginal: false })

        res.status(200).json({
            message: 'phone updated successfully',
            user
        })

    } catch (e) {
        next(e)
    }
}