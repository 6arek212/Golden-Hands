const User = require('../models/user')



exports.getUsers = async (req, res, next) => {
  const users = await User.find()  
  res.status(200).json({
    message:'fetch success',
    users
  })
}


exports.getUser= async (req, res, next) => {

  const user = await User.find({ _id: req.user })  
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
 

  


}


exports.deleteUser = async (req, res, next) => {
 
}


