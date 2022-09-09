const User = require('../models/user')



exports.getUsers = async (req, res, next) => {
  const users = await User.find()  
  res.status(200).json({
    message:'fetch success',
    users
  })
}


exports.getUser= async (req, res, next) => {
  const userId = req.user 

  console.log(userId);

  const user = await User.findOne({ _id: userId }).select('firstName lastName phone role image')
  if(!user){
    return res.status(400).json({
      message: 'You need to signup'
    })
  }

  res.status(200).json({
    message:'fetch success',
    user
  })
}


exports.updateUser = async (req, res, next) => {
  const userId = req.user 

  console.log('--------------------', req.body);

  const user = await User.findOneAndUpdate({ _id: userId }, { ...req.body }, { runValidators: true, returnOriginal: false })

  console.log(user);

  res.status(200).json({
    message:'update success',
    user
  })

}


exports.deleteUser = async (req, res, next) => {
 
}


