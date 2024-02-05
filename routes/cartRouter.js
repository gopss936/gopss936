
var express = require('express');
const { addToCart,removeFromCart,getCart } = require('../controller/cart');

const router = express.Router();

router.post('/addToCart',addToCart)
router.post('/removeFromCart',removeFromCart)
router.get('/getCart',getCart)
module.exports = router;

