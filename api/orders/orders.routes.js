const express = require('express') 
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addOrder, getOrders, deleteOrder, updateOrder} = require('./orders.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth) 

router.get('/', log, getOrders)
router.put('/:orderId', updateOrder)
router.post('/',  requireAuth, addOrder)
router.delete('/:id',  requireAuth, deleteOrder)

module.exports = router 