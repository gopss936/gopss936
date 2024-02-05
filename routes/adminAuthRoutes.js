var express = require('express');
var {suadminLogin} =  require('../controller/adminAuth');
const router = express.Router();

/* POST users listing. */
router.post('/suadminLogin', suadminLogin);
module.exports = router;
