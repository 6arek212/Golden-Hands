const User = require('../models/user')
const Verify = require('../models/verify')
const jwt = require('jsonwebtoken')




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
    time = '1d'
    if (type == 'auth') {
        time = '3d'
    }
    else if (type == 'refresh') {
        time = '10d'
    }

    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: time })
}


// TODO: Adjust for loginin with admin / customer 

exports.sendAuthVerification = async (req, res, next) => {
    const { phone, adminMode } = req.body

    try {
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


        client.messages
            .create({
                body: 'מספרת אברהים ,' + '\n' + 'הקוד שלך הוא :' + '\n#' + code + '\n' + `צריך להזין אותו באפליקציה שלנו`,
                messagingServiceSid: 'MG91cc7f21e93e935e4de2d16a90c4b45d',
                to: '+972' + phone
            })
            .then(message => console.log(message.sid))
            .catch(e => console.log('sending message error:', e))


        res.status(201).json({
            message: 'login verification sent',
            verifyId: verify._id
        })

    } catch (e) {
        next(e)
    }
}



// const verify = async (res, verifyId, code) => {
//     // check if the code match

//     // await Verify.updateOne({ _id: verifyId }, { isActive: false })
// }



exports.verifyAndSignup = async (req, res, next) => {
    const { verifyId, code, firstName, lastName, birthDate, phone, adminMode } = req.body

    /////// TODO: UPLOAD IMAGE !!!!!!!!!!!!!!!!!!


    // console.log(adminMode);

    try {
        // const verify = await Verify.findOne({ _id: verifyId })
        // if (!verify) {
        //     return res.status(400).json({
        //         message: 'No verification found !'
        //     })
        // }

        // if (verify.code !== code) {
        //     return res.status(403).json({
        //         message: 'Code not match !'
        //     })
        // }

        console.log(req.file.filename, req.body);

        const user = await User.signup({ firstName, lastName, phone, birthDate, imagePath: req.file?.filename, adminMode })

        console.log(birthDate, user);

        //create token
        const token = createToken(user._id, 'auth')
        const refresh_token = createToken(user._id, 'refresh')

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
                    adminMode
                },
                token,
                refresh_token,
                expiresIn: 3 * 24 * 60 * 60
            }
        })
    } catch (e) {
        next(e)
    }
}




exports.verifyAndLogin = async (req, res, next) => {
    const { phone, verifyId, code, adminMode } = req.body

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

        let user = await User.login(phone, adminMode)
        // console.log('aaaaaaaaa');

        //create token
        const token = createToken(user._id, 'auth')
        const refresh_token = createToken(user._id, 'refresh')


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
                    adminMode
                },
                token,
                refresh_token,
                expiresIn: 3 * 24 * 60 * 60
            }
        })

    } catch (e) {
        next(e)
    }
}




exports.verifyPhone = async (req, res, next) => {
    const { verifyId, code } = req.body

    try {
        // check if the code match
        const verify = await Verify.findOne({ _id: verifyId })
        if (!verify) {
            return res.status(400).json({
                message: 'No verification found !'
            })
        }

        if (verify.code !== code) {
            return res.status(403).json({
                message: 'Code not match !'
            })
        }

        res.status(200).json({
            message: 'phone verify success !'
        })

    } catch (e) {
        next(e)
    }
}








exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body
    const { authorization } = req.headers

    try {
        console.log('----------------Refresh Token---------------');

        if (!authorization) {
            return res.status(403).json({ message: 'Authorization token required' })
        }
        const token = authorization.split(' ')[1]
        const { _id } = await jwt.verify(refreshToken, process.env.SECRET)

        //, {ignoreExpiration: true} 
        const newtoken = createToken(_id, 'auth')

        res.status(200).json({
            message: 'token refreshed',
            token: newtoken
        })

    } catch (e) {
        next(e)
    }
}

