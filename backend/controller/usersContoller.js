const User = require('../models/user')
const fs = require('fs')
const path = require('path')



exports.uploadUserImage = async (req, res, next) => {
  try {
    const { filename } = req.file
    const userId = req.user
    console.log(req.file, userId);

    await User.updateOne({ _id: userId }, { image: filename })


    const srcPath = path.join(__dirname, '..', 'temp', filename)
    var source = fs.createReadStream(srcPath);
    var dest = fs.createWriteStream(path.join(__dirname, '..', 'imgs', filename));

    source.pipe(dest);
    source.on('end', function () {
      fs.unlinkSync(srcPath)
      res.status(201).json({
        message: 'image uploaded',
        filename: filename
      })
    });
    source.on('error', function (err) {
      next(err)
    });

  } catch (e) {
    next(e)
  }
}




exports.getUsers = async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({
    message: 'fetch success',
    users
  })
}


exports.getUser = async (req, res, next) => {
  const userIdFromAuth = req.user
  const { userId: userIdFromParam } = req.params


  if (userIdFromAuth !== userIdFromParam && !req.worker_mode) {
    return res.status(403).json({
      message: 'you are not authorized to make this call'
    })
  }


  const user = await User.findOne({ _id: userIdFromParam }).select('firstName lastName phone role image')
  if (!user) {
    return res.status(400).json({
      message: 'You need to signup'
    })
  }

  res.status(200).json({
    message: 'fetch success',
    user
  })
}


exports.updateUser = async (req, res, next) => {
  const { userId: userIdParam } = req.params
  const userIdAuth = req.user

  console.log(userIdParam, userIdAuth, '--------------------', req.body);
  if (userIdParam !== userIdAuth && !req.worker_mode) {
    return res.status(401).json({
      message: 'Your not allowed'
    })
  }


  if (req.body.role && !req.worker_mode) {
    return res.status(403).json({
      message: 'Your not allowed to change your role'
    })
  }


  if (req.body.phone || req.body.image) {
    return res.status(403).json({
      message: 'You cant update phone number or image through this route'
    })
  }


  const user = await User.findOneAndUpdate({ _id: userIdParam }, { ...req.body }, { runValidators: true, returnOriginal: false })

  console.log(user);
  res.status(200).json({
    message: 'update success',
    user
  })

}




exports.deleteUser = async (req, res, next) => {

}


