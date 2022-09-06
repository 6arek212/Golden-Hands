const User = require('../models/user')



exports.search = async (req, res, next) => {
  const name = req.body.search
  console.log(req.body);

  const currentPage = + req.query.page
  const pageSize = +req.query.pagesize
  const customerQuery = User.find();





  if (currentPage && pageSize) {
    customerQuery.skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }




  if (!name) {
    return (customerQuery.find()
      .populate('city', 'name')
      .then(result => {
        return res.status(201).json({
          message: 'Customers Fetched Successfuly',
          customers: result,
          totalCustomers
        })
      })
      .catch(err => {
      }))
  }
  const searchString = name.trim()


  let fetchedCustomers

  const find = customerQuery.find({

    $or: [
      {
        "$expr": {
          "$regexMatch": {
            "input": { "$concat": ["$firstName", " ", "$lastName"] },
            "regex": searchString,  //Your text search here
            "options": "i"
          }
        }

      },
      { 'phone': { $regex: "^" + searchString } }
    ]
  })

  find
    .populate('city', 'name')
    .then(result => {
      fetchedCustomers = result
      return customerQuery.count()
    })
    .then(count => {
      res.status(201).json({
        message: 'Customers Fetched By Name Successfuly',
        customers: fetchedCustomers,
        totalCustomers: count
      })
    })
    .catch(err => {
    })
}


exports.getCustomerDetails = (req, res, next) => {
  const customerId = req.params.customerId

  User.findOne({ '_id': customerId })
    .select('firstName lastName phone')
    .populate('city', 'name')
    .then(customer => {
      if (!customer)
        return res.status(404).json({
          message: 'Customer not found'
        })

      res.status(200).json({
        message: ' Fetched customer successfuly',
        customer
      })
    })
}



exports.updateCustomer = (req, res, next) => {
  const { customerId } = req.params
  const updateOps = []


  for (op of req.body) {
    updateOps[op.name] = op.value
  }

  console.log(updateOps, customerId);


  Customer.findOneAndUpdate({ '_id': customerId }, { ...updateOps }, { new: true, runValidators: true })
    .populate('city', 'name')
    .then(customer => {
      res.status(200).json({
        message: 'updated customer successfuly',
        customer
      })
    })
    .catch(err => { })

}







exports.getCustomers = (req, res, next) => {
  User.find()
    .then(docs => {
      res.status(200).json({
        message: 'fetched cutomers',
        customers: docs
      })
    })
}






exports.deleteCustomer = (req, res, next) => {
  const customerId = req.params.customerId

  User.findOneAndDelete({ '_id': customerId })
    .then(result => {
      console.log(result);

      res.status(200).json({
        message: 'Customer deleted successfuly'
      })
    })
    .catch(err => { })
}



