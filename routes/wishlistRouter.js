var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");
var {
  addWishLists,
  getWhislists,
  deletewishlists,
} = require("../controller/wishlist");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var path = `./upload/driver`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });
router.post("/addwishlists", addWishLists);
router.post("/removewishlists", deletewishlists);
router.get("/getWhislists", getWhislists);

module.exports = router;
