const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').post(createOrder).get(adminOnly, getAllOrders);
router.get('/myorders', getMyOrders);
router.route('/:id').get(getOrderById);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
