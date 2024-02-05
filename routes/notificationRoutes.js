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

/* POST users listing. */
router.get("/usernotification", usernotification);
router.get("/storenotification", storenotification);
router.post("/addnotification", addNotification);
router.post("/editnotification", editNotification);
router.post("/deletenotification", deleteNotification);
router.get("/notificationList", notificationList);
module.exports = router;
