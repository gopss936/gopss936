var express = require('express');
var {placeOrder,deleteorder,editorder,orderList,orderbystatus,orderbystore,orderCancelreturn,getOrderById} =  require('../controller/order');
const router = express.Router();
/* POST users listing. */
router.post('/placeOrder',placeOrder);
router.post('/deleteorder',deleteorder);
router.post('/editorder',editorder);
router.get('/orderList',orderList);
router.post('/orderbystatus',orderbystatus);
router.post('/orderbystore',orderbystore);
router.post('/orderCancelreturn',orderCancelreturn);
router.get('/order/:id',getOrderById)
module.exports = router;
