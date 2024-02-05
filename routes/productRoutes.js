var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");
const  verifyToken = require('../helper/verifyAuth');

var {
  addproduct,
  editproduct,
  deleteproduct,
  getproduct,
  productList,
  productbycategoryid,
  productbysubcategoryid,
  productbystoreid,
  productbyoffer,
} = require("../controller/product");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var fieldname = file.fieldname;
    if (fieldname == "product_img") {
      var path = `./upload/product`;
    } else var path = `./upload/profile`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

/* POST users listing. */

router.post("/addproduct",verifyToken, addproduct);
router.post("/editproduct",verifyToken , editproduct);
router.post("/deleteproduct",verifyToken , deleteproduct);
router.post("/getproduct", getproduct);
router.post("/productList", productList);
router.post("/productbycategoryid",productbycategoryid);
router.post("/productbysubcategoryid", productbysubcategoryid);
router.post("/productbystoreid",productbystoreid);
router.post("/productbyoffer",verifyToken,productbyoffer);
module.exports = router;
