const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'orders was fetched'
    });
});

router.post('/',(req,res,next)=>{
    res.status(201).json({
        message:'order were created'
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
