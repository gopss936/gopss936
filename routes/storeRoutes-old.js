var express = require("express");
var multer = require("multer");
var fs = require("fs-extra");
const  verifyToken = require('../helper/verifyAuth');

var {
  storeRegistration,
  editStoreProfile,
  deleteStore,
  storeList,
  storeLogin,
  createCategory,
  editStorecategory,
  deleteCategory,
  categoryList,
  createSubcategory,
  editSubcategory,
  deleteSubCategory,
  subcategoryList,
  subCategoriesByCategory,
  subCategoryListByStoreId,
  categoryListByStoreId,
} = require("../controller/store");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var fieldname = file.fieldname;
    if (
      fieldname == "logo" ||
      fieldname == "card_id" ||
      fieldname == "address_proof"
    ) {
      var path = `./upload/store`;
    } else var path = `./upload/category`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename(req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

/* POST users listing. */
router.post(
  "/storeRegistration",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "card_id", maxCount: 1 },
    { name: "address_proof", maxCount: 1 },
  ]),
  storeRegistration
);
router.post(
  "/editStoreProfile",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "card_id", maxCount: 1 },
    { name: "address_proof", maxCount: 1 },
  ]),
  editStoreProfile
);
router.post("/deleteStore",verifyToken, deleteStore);
router.get("/storeList",verifyToken, storeList);
router.post("/storeLogin", storeLogin);
router.post(
  "/createCategory",
  upload.fields([{ name: "category_img", maxCount: 1 }]),verifyToken,
  createCategory
);
router.post(
  "/editStorecategory",
  upload.fields([{ name: "category_img", maxCount: 1 }]),
  editStorecategory
);
router.post("/deleteCategory", verifyToken,deleteCategory);
router.get("/categoryList",verifyToken, categoryList);
router.post("/createSubcategory", verifyToken,createSubcategory);
router.post("/editSubcategory",verifyToken, editSubcategory);
router.post("/deleteSubCategory", verifyToken,deleteSubCategory);
router.post("/subCategoriesByCategory", verifyToken,subCategoriesByCategory);
router.get("/subcategoryList",verifyToken, subcategoryList);
router.post("/categoryListByStore", verifyToken,categoryListByStoreId);
router.post("/subCategoryListByStore", verifyToken,subCategoryListByStoreId);
module.exports = router;
