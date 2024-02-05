var express = require('express');
var {vendorLogin} =  require('../controller/vendorAuth');
const router = express.Router();

/* POST users listing. */
router.post('/vendorLogin', vendorLogin);
module.exports = router;
