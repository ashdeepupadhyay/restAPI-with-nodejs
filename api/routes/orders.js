const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const checkAuth = require('../middleware/checkAuth');

const Order=require('../models/order');
const Product=require('../models/product');

const OrdersController =require('../controllers/orders');

//handle incoming GET requests to /orders
router.get('/',checkAuth,OrdersController.orders_get_all);

router.post('/',checkAuth,OrdersController.orders_create_order);

router.get('/:orderID',checkAuth,OrdersController.orders_get_order);

router.delete('/:orderID',checkAuth,OrdersController.orders_delete_order);

module.exports = router;
