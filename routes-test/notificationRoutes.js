var express = require("express");
var {
  usernotification,
  storenotification,
  addNotification,
  editNotification,
  deleteNotification,
  notificationList,
} = require("../controller/notification");
const router = express.Router();
const  verifyToken = require('../helper/verifyAuth');


/* POST users listing. */
router.get("/usernotification",verifyToken, usernotification);
router.get("/storenotification", verifyToken,storenotification);
router.post("/addnotification",verifyToken, addNotification);
router.post("/editnotification",verifyToken, editNotification);
router.post("/deletenotification",verifyToken, deleteNotification);
router.get("/notificationList",verifyToken, notificationList);
module.exports = router;
