const mongoose = require("mongoose");
const storeSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  admin_store_id: String,
  store_url: String,
  store_display_name: String,
  mobile: Number,
  street: String,
  city: String,
  logo: {
    type: String,
  },
  pin_code: String,
  state: String,
  latitude: String,
  longitude: String,
  store_description: String,
  status: {
    type: Number,
    default: 1, // 0 = inactive , 1 = active
  },
  verified: {
    type: Number,
    default: 0, // 0 = unverified , 1 = verified
  },
  otp: {
    type: String,
    default: "",
  },
  account_number: String,
  bank_ifc_code: String,
  bank_account_name: String,
  commission: String,
  uploaded_id_card: String,
  upload_address_proof: String,
  tax_name: String,
  GST_number: String,
  PAN_number: String,
  createddt: {
    type: Date,
    default: Date.now,
  },
});

const store = mongoose.model("store", storeSchema);
module.exports = {
  store
};
