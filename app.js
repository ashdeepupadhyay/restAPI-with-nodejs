const express = require('express');
const morgan = require('morgan');
const app = express();


const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
//Routes which should handle request
app.use('/products',productRoutes);
app.use('/orders',ordersRoutes);

module.exports=app;
