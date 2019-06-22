const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message : 'Handling GET requests to /Products'
    });
});

router.post('/',(req,res,next)=>{
    res.status(200).json({
        message : 'Handling POST requests to /Products'
    });
});

router.get('/:productID',(req,res,next)=>{
    const id=req.params.productID;
    if(id==='special'){
        res.status(200).json({
            message:'You discovered the special ID',
            id:id
        })
    }else{
        res.status(200).json({
            message:'You Passed an ID'
        })
    }
});

router.patch('/:productID',(req,res,next)=>{
        res.status(200).json({
            message:'UPDATED PRODUCT'
        }); 
});

router.delete('/:productID',(req,res,next)=>{
    res.status(200).json({
        message:'PRODUCT deleted'
    }); 
});
module.exports = router;
