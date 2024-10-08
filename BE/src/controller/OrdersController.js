const OrderService = require('../service/OrderService');

const OrderController = {
  createOrder: async (req, res) => {
    try {
      const order = await OrderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await OrderService.getOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  },

  updateOrder: async (req, res) => {
    const { id } = req.params;
    const orderData = req.body;

    try {
      const updatedOrder = await OrderService.updateOrder(id, orderData);
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Error updating order', error });
    }
  },

  
    deleteOrder: async (req, res) => {
      const { id } = req.params; // Get the order ID from the URL parameters
  
      try {
        const deletedOrder = await OrderService.deleteOrder(id);
        if (!deletedOrder) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
      }
    },
};

module.exports = OrderController;
