const User = require('../models/user')
const fs = require('fs')
const path = require('path')



exports.uploadUserImage = async (req, res, next) => {
  try {
    const { filename } = req.file
    const userId = req.user
    console.log(req.file, userId);

    await User.updateOne({ _id: userId }, { image: filename })


    // const srcPath = path.join(__dirname, '..', 'temp', filename)
    // var source = fs.createReadStream(srcPath);
    // var dest = fs.createWriteStream(path.join(__dirname, '..', 'imgs', filename));

    // source.pipe(dest);
    // source.on('end', function () {
    //   fs.unlinkSync(srcPath)
    //   
    // });
    // source.on('error', function (err) {
    //   next(err)
    // });

    res.status(201).json({
      message: 'image uploaded',
      filename: filename
    })

  } catch (e) {
    next(e)
  }
}




exports.getUsers = async (req, res, next) => {
  const { search } = req.query
  const currentPage = + req.query.currentPage
  const pageSize = +req.query.pagesize
  const sort = +req.query.sort

  const query = User.find();

  if (search) {
    query.find({
      $or: [
        {
          "$expr": {
            "$regexMatch": {
              "input": { "$concat": ["$firstName", " ", "$lastName"] },
              "regex": search,  //Your text search here
              "options": "i"
            }
          }

        },
        { 'phone': { $regex: "^" + search } }
      ]
    })
  }


  if (currentPage && pageSize) {
    query.skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }

  if (sort) {
    query.sort({ createdAt: sort })
  } 
  else {
    query.sort({ createdAt: -1 })
  }


  const date = new Date()
  date.setMonth(date.getMonth() - 1)

  const usersCount = await User.count()
  const newUsersCount = await User.count().where('createdAt').gte(date)


  const users = await query
  res.status(200).json({
    message: 'fetch success',
    users,
    count: usersCount,
    newUsersCount: newUsersCount
  })
}


exports.getUser = async (req, res, next) => {
  const userIdFromAuth = req.user
  const { superUser } = req
  const { userId: userIdFromParam } = req.params


  if (userIdFromAuth !== userIdFromParam && !superUser) {
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
  const { user: userIdAuth, superUser, worker_mode } = req

  console.log(userIdParam, userIdAuth, '--------------------', req.body);


  if (!superUser) {
    if (userIdParam !== userIdAuth) {
      return res.status(401).json({
        message: 'Your not allowed'
      })
    }

    if (req.body.superUser) {
      return res.status(403).json({
        message: 'Your not allowed to change your permissions'
      })
    }

    if (req.body.role) {
      return res.status(403).json({
        message: 'Your not allowed to change your role'
      })
    }

    if (req.body.phone || req.body.image) {
      return res.status(403).json({
        message: 'You cant update phone number or image through this route'
      })
    }
  }

  if (superUser) {
    if (req.body.phone) {
      const numberExists = await User.findOne({ phone })
      if (numberExists) {
        return res.status(400).json({
          message: 'the phone number already exsits'
        })
      }
    }

    if (req.body.image) {
      return res.status(403).json({
        message: 'You cant update image through this route'
      })
    }
  }


  const user = await User.findOneAndUpdate({ _id: userIdParam }, { ...req.body }, { runValidators: true, returnOriginal: false })

  console.log(user);
  res.status(200).json({
    message: 'update success',
    user
  })

}




exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params
  const { superUser } = req

  try {
    if (!superUser) {
      return res.status(403).json({
        message: 'Only super user can remove another user'
      })
    }

    await User.deleteOne({ _id: userId })

    res.status(200).json({
      message: 'user deleted'
    })

  } catch (e) {
    next(e)
  }
}


