var express = require('express');
var multer = require('multer');
var fs = require('fs-extra');
const  verifyToken = require('../helper/verifyAuth');

var {userRegistration, userLogin, forgotPasswordUser, updatePassword, userVerify,
changePassword, editProfileUser, getUserProfile,userSocialSiteLogin} =  require('../controller/userAuth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
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
router.post('/userSignup',upload.fields([{ name: 'profile_image', maxCount: 1}]),userRegistration);
router.post('/userVerify',verifyToken, userVerify);
router.post('/userLogin', userLogin);
router.post('/forgotPassword',verifyToken, forgotPasswordUser);
router.post('/updatePassword', verifyToken,updatePassword);
router.post('/changePassword', verifyToken,changePassword);
router.post('/editProfileUser',verifyToken,upload.fields([{ name: 'profile_image', maxCount: 1}]),editProfileUser);
router.post('/socialSiteLogin', verifyToken,userSocialSiteLogin);
router.get('/getUserProfile',verifyToken, getUserProfile);
module.exports = router;
