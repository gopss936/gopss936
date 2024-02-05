
var express = require('express');
var {deliveryAssign,deliveryComplete} = require('../controller/deliveries')

const router = express.Router();

router.post('/assignDeliveryBoy',deliveryAssign)
router.post('/deliveryComplete',deliveryComplete)

 
module.exports = router;

