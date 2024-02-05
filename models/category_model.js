const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  category_name: String,
  store_id: Object,
  category_subtitle: String,
  created_by: {
    type: String,
  },
  category_image: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: 1,
  },
  Created_on: {
    type: Date,
    default: Date.now,
  },
});

const category = mongoose.model("category", categorySchema);
const SubcategorySchema = new mongoose.Schema({
  category_id: String,
  store_id: String,
  subcategory_subtitle: String,
  subcategory_name: String,
  created_by: {
    type: String,
  },
  subcategory_image: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: 1,
  },
  Created_on: {
    type: Date,
    default: Date.now,
  },
});

const subCategory = mongoose.model("subcategory", SubcategorySchema);
module.exports = { category, subCategory };
