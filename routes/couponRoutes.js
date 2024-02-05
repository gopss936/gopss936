var express = require('express');
var {addcoupon,editcoupon,deletecoupon,couponList} =  require('../controller/coupon');
const router = express.Router();
/* POST users listing. */
router.post('/addcoupon',addcoupon);
router.post('/editcoupon',editcoupon);
router.post('/deletecoupon',deletecoupon);
router.get('/couponList',couponList);
module.exports = router;