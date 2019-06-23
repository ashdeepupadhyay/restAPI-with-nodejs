const express=require('express');
const router=express.Router();

const checkAuth = require('../middleware/checkAuth');
const UserController = require('../controllers/users');

router.post('/signup',UserController.users_signup);

router.post('/login',UserController.users_login);

router.delete('/:userId',checkAuth,UserController.users_delete);
module.exports = router;