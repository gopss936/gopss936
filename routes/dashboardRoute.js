var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
var {countDetails} =  require('../controller/dashboard');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        var fieldname = file.fieldname;
        if (fieldname == "profile") {
            var path = `./upload/profile`;
        }
        else
        var path = `./upload/profile`;

        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename(req, file, callback) {

        callback(null, Date.now() + '_' + file.originalname);
    },
});

const upload = multer({ storage });

 router.get('/dashboardCount',countDetails);
 
module.exports = router;
