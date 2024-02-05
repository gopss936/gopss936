const express = require('express');
const  verifyToken = require('../helper/verifyAuth');
const router = express.Router();

var genrateToken = require('./tokenRoute');
var userauth = require('./userAuthRoutes');
var employee = require('./employeeRoutes');
var adminauth = require('./adminAuthRoutes');
var store = require('./storeRoutes');
var banner = require('./banner');
var product = require('./productRoutes')
var driver = require('./deliveryboyRoutes');
var offer = require('./offerRoutes');
var coupon = require('./couponRoutes');
var order = require('./orderRoutes');
var wallet = require('./wallerRoutes');
var notification = require('./notificationRoutes');


router.use('/tokenGenrate',genrateToken);
router.use('/userauth',userauth);
router.use('/employee',employee);
router.use('/adminauth',adminauth);
router.use('/store',store);
router.use('/banner',banner);
router.use('/product',product);
router.use('/driver',driver);
router.use('/offer',offer);
router.use('/coupon',coupon);
router.use('/order',order);
router.use('/wallet',wallet);
router.use('/notification',notification);

module.exports = router;

