var express = require('express');
var {addcoupon,editcoupon,deletecoupon,couponList} =  require('../controller/coupon');
const router = express.Router();
const  verifyToken = require('../helper/verifyAuth');

/* POST users listing. */
router.post('/addcoupon',verifyToken,addcoupon);
router.post('/editcoupon',verifyToken,editcoupon);
router.post('/deletecoupon',verifyToken,deletecoupon);
router.get('/couponList',verifyToken,couponList);
module.exports = router;