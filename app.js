const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');


const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use(morgan('dev'));//for logging
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");//giving access to a particular website or domain or to all
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );//type of header that can be given
    if(req.method==="OPTIONS"){//OPTIONS method is called by browser before any request to check it can make that request or not
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
})
//Routes which should handle request
app.use('/products',productRoutes);
app.use('/orders',ordersRoutes);

app.use((req,res,next)=>{
    const error =new Error('NOT FOUND');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message,
            error:error.status
        }
    });
});

module.exports=app;
