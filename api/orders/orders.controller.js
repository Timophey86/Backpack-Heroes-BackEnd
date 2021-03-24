const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const orderService = require('./orders.service')
 
async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query)
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
} 

async function deleteOrder(req, res) {
    try {
        await orderService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete order', err)
        res.status(500).send({ err: 'Failed to delete order' })
    }
}
 

async function addOrder(req, res) {
    try {
        console.log('is this working ', req.body)
        order = await orderService.add(req.body)
        res.send(order)

    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}


async function updateOrder(req, res) {
    console.log('is it in the backend ',req.body);
    try {
      const order = req.body;
      const savedOrder = await orderService.update(order);
      res.json(savedOrder);
    } catch (err) {
      res.status(500).send("cannot update order");
    }
  }

module.exports = {
    getOrders,
    deleteOrder,
    addOrder,
    updateOrder
}