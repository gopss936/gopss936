var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");
var {
  addbanner,
  editbanner,
  deleteBanner,
  bannerList,
} = require("../controller/banner");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var path = `./upload/banner`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });
const  verifyToken = require('../helper/verifyAuth');

/* POST users listing. */
router.post(
  "/addbanner",
  upload.fields([{ name: "banner_image", maxCount: 1 }]),
  addbanner
);
router.post(
  "/editbanner",
  upload.fields([{ name: "banner_image", maxCount: 1 }]),
  editbanner
);
router.post("/deleteBanner",verifyToken, deleteBanner);
router.get("/bannerList",verifyToken, bannerList);
module.exports = router;
