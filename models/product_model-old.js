const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  product_name: String,
  product_description: String,
  tax: String,
  seller: String,
  category_id: Object,
  subcategory_id: Object,
  product_type: String,
  manufacturer: String,
  made_in: String,
  is_returnable: Number,
  is_cancel_able: Number,
  // other_images: Array,
  // delivery_place: String,
  store_id: String,
  created_by: String,
  offer: String,
  variation: Array,
  createdby_type: {
    type: Number,
    dafault: 1, // type = 1 store , type =2 employee
  },
  // type: Number,
  product_status: {
    type: Number,
    default: 1,
  },
  main_img: {
    type: String,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const product = mongoose.model("product", ProductSchema);

module.exports = { product };
