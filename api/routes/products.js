const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const Product = require('../models/product')
router.get('/',(req,res,next)=>{
    Product.find()
        .exec()
        .then(docs=>{
            console.log(docs);
          //  if(docs.length>=0)   {
                res.status(200).json(docs);
          //  }else{
          //      res.status(404).json({
          //          message:'no entries found'
          //      });
          //  }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
    /*
    res.status(200).json({
        message : 'Handling GET requests to /Products'
    });
    */
});

router.post('/',(req,res,next)=>{
    
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    })
    product
        .save()
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message : 'Handling POST requests to /Products',
                createdProduct: result
        })
        .catch(err=>{console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    
    });
});

router.get('/:productID',(req,res,next)=>{
    const id=req.params.productID;
    Product.findById(id)
        .exec()
        .then(doc=>{
            console.log("From database"+doc);
            if(doc){
                res.status(200).json(doc);
            }else{
                res.status(404).json({message:'NO Valid entry found for provided ID'});
            }
        })
        .catch(err =>{console.log(err);
                        res.status(500).json({error:err});
                    });
    /*
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
    */
});

router.patch('/:productID',(req,res,next)=>{
    const id = req.params.productID;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.update({_id:id},{$set:updateOps})//{$set:{name:req.body.newName,price:req.body.newPrice}});
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    /*
        res.status(200).json({
            message:'UPDATED PRODUCT'
        }); 
        */
});

router.delete('/:productID',(req,res,next)=>{
    const id = req.params.productID;
    Product.remove({_id:id})
        .exec()
        .then(result=>{
            console.log("deleted");
            res.status(200).json(result);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
    /*
    res.status(200).json({
        message:'PRODUCT deleted'
    }); 
    */
});
module.exports = router;
