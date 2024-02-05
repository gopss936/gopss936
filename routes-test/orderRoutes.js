var express = require('express');
var {placeOrder,deleteorder,editorder,orderList,orderbystatus,orderbystore,orderCancelreturn} =  require('../controller/order');
const  verifyToken = require('../helper/verifyAuth');

const router = express.Router();
/* POST users listing. */
router.post('/placeOrder',verifyToken,placeOrder);
router.post('/deleteorder',verifyToken,deleteorder);
router.post('/editorder',verifyToken,editorder);
router.get('/orderList',verifyToken,orderList);
router.post('/orderbystatus',verifyToken,orderbystatus);
router.post('/orderbystore',verifyToken,orderbystore);
router.post('/orderCancelreturn',verifyToken,orderCancelreturn);
module.exports = router;
