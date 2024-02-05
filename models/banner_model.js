const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
  store_id: Object,
  name: String,
  type: String,
  employee_id: String,
  banner_image: {
    type: Array,
  },
  createdby_type: {
    type: Number,
    dafault: 1, // type = 1 store , type =2 employee
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const banner = mongoose.model("banner", bannerSchema);

module.exports = { banner };
