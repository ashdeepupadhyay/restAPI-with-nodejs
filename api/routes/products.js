const express=require('express');
const router=express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/checkAuth');
const ProductsController = require('../controllers/product');

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


router.get('/',ProductsController.product_get_all);

router.post('/',checkAuth,upload.single('productImage'),ProductsController.product_create_product);

router.get('/:productID',ProductsController.product_get_product);

router.patch('/:productID',checkAuth,ProductsController.product_update_product);

router.delete('/:productID',checkAuth,ProductsController.product_delete_product);
module.exports = router;
