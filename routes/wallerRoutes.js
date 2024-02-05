var express = require('express');
var {addMoneyWallet} =  require('../controller/wallet');
const router = express.Router();
router.post('/addMoneyWallet',addMoneyWallet);
module.exports = router;