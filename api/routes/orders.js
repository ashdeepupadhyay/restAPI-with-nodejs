const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const Order=require('../models/order');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'orders was fetched'
    });
});

router.post('/',(req,res,next)=>{
    const order=new Order({
        _id : mongoose.Types.ObjectId(),
        productId : req.body.productId,
        quantity : req.body.quantity
    });
    order
        .save()
        .then(result=>{
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});

router.get('/:orderID',(req,res,next)=>{
    res.status(200).json({
        message:'order details',
        orderId:req.params.orderID
    });
});

router.delete('/:orderID',(req,res,next)=>{
    res.status(200).json({
        message:'order deleted',
        orderId:req.params.orderID
    });
});
module.exports = router;
