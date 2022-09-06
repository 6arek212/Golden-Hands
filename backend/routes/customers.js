const router = require('express').Router()
const { search, getCustomers, getCustomerDetails, updateCustomer, deleteCustomer } = require('../controller/customerContoller')


router.post('/search', search)

router.get('', getCustomers)

router.get('/:customerId', getCustomerDetails)




router.patch('/:customerId', updateCustomer)

router.delete('/:customerId', deleteCustomer)


module.exports = router
