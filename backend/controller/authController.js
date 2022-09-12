const User = require('../models/user')
const Verify = require('../models/verify')
const jwt = require('jsonwebtoken')

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;   
const client = require('twilio')(accountSid, authToken);


const loginTries = 10


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}


// TODO: Adjust for loginin with admin / customer 

exports.sendAuthVerification = async (req, res, next) => {
    const { phone, adminMode } = req.body

    try {
        const verifiesCount = await Verify.count({ phone: phone, forAuth: true })
        if (verifiesCount > loginTries){
            return res.status(403).json({
                message:"you have too many login tries , try again after some time"
            })
        }

        var code = Math.floor(1000 + Math.random() * 9000)

        const verify = await Verify.create({
            code: code,
            phone: phone,
            forAuth: true
        })


        client.messages
        .create({
            body:  'מספרת אברהים ,' + '\n' + 'הקוד שלך הוא :' + '\n#' + code + '\n' + `צריך להזין אותו באפליקציה שלנו`,
            messagingServiceSid: 'MG91cc7f21e93e935e4de2d16a90c4b45d',   
            to: '+972' + phone
        })
        .then(message => console.log(message.sid))
            .catch(e => console.log('sending message error:', e))


        res.status(201).json({
            message:'login verification sent',
            verifyId: verify._id
        })

    } catch (e) {
        next(e)
    }
}



const verify = async (res, verifyId, code) => {
    // check if the code match
    const verify = await Verify.findOne({ _id: verifyId })
    if(!verify){
        return res.status(400).json({
            message: 'No verification found !'
        })
    }

    if(verify.code !== code){
        return res.status(403).json({
            message: 'Code not match !'
        })
    }
 
    // await Verify.updateOne({ _id: verifyId }, { isActive: false })
}



exports.verifyAndSignup = async (req, res, next) => {
    const { verifyId, code, firstName, lastName, birthDate, phone, adminMode } = req.body

    console.log(adminMode);

    try {
       
        verify(res, verifyId, code)
      
        const user = await User.signup({ firstName, lastName, phone, password , adminMode})

        //create token
        const token = createToken(user._id)
        const refresh_token = createToken(user._id)

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




exports.verifyAndLogin = async (req, res, next) => {
    const { verifyId, code, adminMode } = req.body

    try {

        // check if the code match
        verify(res, verifyId, code)

        let user = await User.login(phone, adminMode)

        //create token
        const token = createToken(user._id)
        const refresh_token = createToken(user._id)


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
            refresh_token,
            expiresIn: 3 * 24 * 60 * 60
        })
        
    } catch (e) {
        next(e)
    }
}




exports.verifyPhone = async (req, res, next) => {
    const { verifyId , code } = req.body

    try {
         // check if the code match
         verify(res, verifyId, code)

        res.status(200).json({
            message: 'phone verify success !'
        })
        
    } catch (e) {
        next(e)
    }
}


