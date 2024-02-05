var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");
const verifyToken = require("../helper/verifyAuth");
const path = require("path");

var {
   
  uploadImage
} = require("../controller/store");
const router = express.Router();
 
router.post("/uploadImage",uploadImage)
module.exports = router;
