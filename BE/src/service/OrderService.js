const { handleIncomingMessage } = require('../app');
const Order = require('../models/Orders');
const { emitMessageToClients } = require('../services/websocketServer');

const OrderService = {
  createOrder: async (orderData) => {


    console.log('Order -------------------------------- service file')

    // ws.send(JSON.stringify());



    emitMessageToClients({ type:"new-order-reload",message: 'Start making a new order' });



    const order = new Order(orderData);
    await order.save();



    // handleIncomingMessage(JSON.stringify({type:"new-order-reload",message:'Start making a new order'}))


    return order;
  },

  // getOrders: async () => {
  //   // Fetch orders and populate the user field to get user role
  //   return await Order.find().populate('user', 'role' ,).sort({ createdAt: -1 }).limit(100);
  // },

  getOrders: async () => {
    // Fetch orders and populate the userRole from userId field
    return await Order.find()
      .populate('userId')  // Populate based on userId and get the role field
      // .populate('userId', 'role')  // Populate based on userId and get the role field
      .sort({ createdAt: -1 })
      .limit(100);
  },
  

  updateOrder: async (id, orderData) => {
    // Find the order by ID and update it with new data
    const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true });
    emitMessageToClients({ type:"new-order-reload",message: 'order accepted' });
    return updatedOrder;
  },

  deleteOrder: async (id) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(id);


      emitMessageToClients({ type:"new-order-reload",message: 'order deleted' });



      return deletedOrder;
    } catch (error) {
      throw new Error('Error deleting order');
    }
  },
};

module.exports = OrderService;
