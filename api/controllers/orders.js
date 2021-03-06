const Order=require('../models/order');
const Product=require('../models/product');
const mongoose=require('mongoose');


exports.orders_get_all = (req,res,next)=>{
    Order
        .find()
        .select('productId quantity _id')
        .populate('productId','_id name price')
        .exec()
        .then(docs=>{
            res.status(200).json({
                count:docs.length,
                orders : docs.map(doc=>{
                    return{
                        _id:doc._id,
                        productId:doc.productId,
                        quantity:doc.quantity,
                        request:{
                            type : 'GET',
                            url : 'http:localhost:3000/orders/'+doc._id
                        }
                    }
                })
            });
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
}

exports.orders_create_order = (req,res,next)=>{
    Product.findById(req.body.productId)
            .then(product=>{
                if(!product){
                    return res.status(404).json({
                        message:'Product Not Found'
                    });
                }
                const order=new Order({
                    _id : mongoose.Types.ObjectId(),
                    productId : req.body.productId,
                    quantity : req.body.quantity
                });
                return order
                    .save()
                    }).then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message : 'Order Stored',
                            createdOrder:{
                                _id:result._id,
                                productId:result.productId,
                                quantity:result.quantity
                            },
                            request:{
                                type : 'GET',
                                url : 'http:localhost:3000/orders/'+result._id
                            }
                        })
                    .catch(err=>{
                        console.log(err);
                        res.status(500).json({
                            error:err
                        });
                    });
            })
}

exports.orders_get_order = (req,res,next)=>{
    const id=req.params.orderID;
    Order.findById(id)
        .populate('productId','_id name price')
        .exec()
        .then(doc=>{
            if(doc){
                res.status(200).json({
                    order:doc,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders'
                    }
                });
            }else{
                res.status(404).json({message:'NO Valid entry found for provided ID'});
            }
        })
        .catch(err =>{console.log(err);
            res.status(500).json({error:err});
        });
}

exports.orders_delete_order = (req,res,next)=>{
    const id = req.params.orderID;
    Order.remove({_id:id})
    .exec()
    .then(result=>{
        console.log("deleted");
        res.status(200).json({
            message:'Order deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/orders/',
                body:{productId:'ID',quantity:'Number'}
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}