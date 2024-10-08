const express = require("express");
const OrderController = require('../controller/OrdersController');

const router = express.Router();

// Route definitions
router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.put('/:id', OrderController.updateOrder); // Fix: changed updateOrders to updateOrder
router.delete('/:id', OrderController.deleteOrder); // Fix: changed deleteOrders to deleteOrder

module.exports = router;
