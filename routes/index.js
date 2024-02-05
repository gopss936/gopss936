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
var dashboard = require('./dashboardRoute')
var imageUpload = require('./imageUpload')
var cart = require('./cartRouter')
var delivery = require('./deliveriesRouter')
var wishlists = require('./wishlistRouter')

router.use('/tokenGenrate',genrateToken);
router.use('/userauth',userauth);
router.use('/dashboard',verifyToken,dashboard);

router.use('/employee',verifyToken,employee);
router.use('/adminauth',adminauth);
router.use('/store',store);
router.use('/banner',verifyToken,banner);
router.use('/product',product);
router.use('/driver',verifyToken,driver);
router.use('/offer',verifyToken,offer);
router.use('/coupon',verifyToken,coupon);
router.use('/order',verifyToken,order);
router.use('/wallet',verifyToken,wallet);
router.use('/notification',verifyToken,notification);
router.use('/image',imageUpload);
router.use('/cart',verifyToken,cart);
router.use('/deliveries',verifyToken,delivery)
router.use('/wishLists',verifyToken,wishlists)

module.exports = router;

