const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + file.originalname);//(Date.now() returns milliseconds)
    }
});
;
const fileFilter = (req,file,cb)=>{
    //reject a file
    if(file.mimetype ==='image/jpeg'||file.mimetype==='image/png'){
        //accept a file
        cb(null,true);
    }else{
        cb(new Error('file type not supported'),false); 
    }    
}

const upload = multer({
    storage:storage,
    limits:{
    fileSize : 1024*1024 * 5    
    },
    fileFilter : fileFilter 
});

const Product = require('../models/product')
router.get('/',(req,res,next)=>{
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs=>{
            const response = {
                count : docs.length,
                products : docs.map(doc=>{
                    return{
                        name:doc.name,
                        price:doc.price,
                        _id:doc._id,
                        productImage:doc.productImage,
                        request :{
                            type : 'GET',
                            url : 'http://localhost:3000/products/'+doc._id
                        }
                    }
                })
            };
            console.log(docs);
          //  if(docs.length>=0)   {
                res.status(200).json(response);
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

router.post('/',upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage:req.file.path
    });
    product
        .save()
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message : 'Created Product Successfully',
                createdProduct: {
                    name:result.name,
                        price:result.price,
                        _id:result._id,
                        request :{
                            type : 'GET',
                            url : 'http://localhost:3000/products/'+result._id
                        }
                }
            });
        })
        .catch(err=>{console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

router.get('/:productID',(req,res,next)=>{
    const id=req.params.productID;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc=>{
            console.log("From database"+doc);
            if(doc){
                res.status(200).json({
                    product:doc,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products'
                    }
                });
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
        res.status(200).json({
            message:'Product Updated',
            request :{
                type : 'GET',
                url : 'http://localhost:3000/products/'+id
            }
        });
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
            res.status(200).json({
                message:'Product deleted',
                request:{
                    type:'POST',
                    url:'http://localhost:3000/products/',
                    body:{name:'String',price:'Number'}
                }
            });
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
