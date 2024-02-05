var express = require('express');
var {addMoneyWallet} =  require('../controller/wallet');
const  verifyToken = require('../helper/verifyAuth');
const router = express.Router();

router.post('/addMoneyWallet',verifyToken,addMoneyWallet);


module.exports = router;