var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
var {adddeliveryboy,editdeliveryboy,deletedeliveryboy,deliveryboyList} =  require('../controller/deliveryboy');
const  verifyToken = require('../helper/verifyAuth');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var path = `./upload/driver`;
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    },
});
const upload = multer({ storage });
router.post('/adddeliveryboy', upload.fields([{ name: 'driver_licence', maxCount: 1},{ name: 'national_id_card', maxCount: 1}]),verifyToken,adddeliveryboy);
router.post('/editdeliveryboy', upload.fields([{ name: 'driver_licence', maxCount: 1},{ name: 'national_id_card', maxCount: 1}]),verifyToken,editdeliveryboy);
router.post('/deletedeliveryboy',verifyToken,deletedeliveryboy);
router.get('/deliveryboyList',verifyToken,deliveryboyList);
module.exports = router;