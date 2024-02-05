var express = require('express');
var {addoffer,editoffer,deleteoffer,offerList} =  require('../controller/offer');
const  verifyToken = require('../helper/verifyAuth');

const router = express.Router();
/* POST users listing. */
router.post('/addoffer',verifyToken,addoffer);
router.post('/editoffer',verifyToken,editoffer);
router.post('/deleteoffer',verifyToken,deleteoffer);
router.get('/offerList',verifyToken,offerList);
module.exports = router;
