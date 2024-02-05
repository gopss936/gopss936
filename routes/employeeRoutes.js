var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
var {employeeRegistration,editEmployeeProfile,deleteEmployee,employeeList} =  require('../controller/employee');
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

/* POST users listing. */
router.post('/employeeRegistration',employeeRegistration);
router.post('/editEmployeeProfile',editEmployeeProfile);
router.post('/deleteEmployee',deleteEmployee);
router.get('/employeeList',employeeList);
module.exports = router;
