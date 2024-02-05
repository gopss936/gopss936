var express = require('express');
var {addoffer,editoffer,deleteoffer,offerList} =  require('../controller/offer');
const router = express.Router();
/* POST users listing. */
router.post('/addoffer',addoffer);
router.post('/editoffer',editoffer);
router.post('/deleteoffer',deleteoffer);
router.get('/offerList',offerList);
module.exports = router;
