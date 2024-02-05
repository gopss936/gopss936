var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
var {employeeRegistration,editEmployeeProfile,deleteEmployee,employeeList} =  require('../controller/employee');
const router = express.Router();
const  verifyToken = require('../helper/verifyAuth');

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

/* POST users listing. */
router.post('/employeeRegistration',verifyToken,employeeRegistration);
router.post('/editEmployeeProfile',verifyToken,editEmployeeProfile);
router.post('/deleteEmployee',verifyToken,deleteEmployee);
router.get('/employeeList',verifyToken,employeeList);
module.exports = router;
