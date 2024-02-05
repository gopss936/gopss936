var express = require('express');
var {suadminLogin} =  require('../controller/adminAuth');
const router = express.Router();
const  verifyToken = require('../helper/verifyAuth');

/* POST users listing. */
router.post('/suadminLogin', suadminLogin);
module.exports = router;
