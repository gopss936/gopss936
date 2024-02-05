const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  mobile: Number,
  email: String,
  password: String,
  // date_of_birth:String,
  // national_id_card:String,
  address: String,
  role: Number, // 1 = store , 2 = employee
  store_id: {
    type: String,
  },
  createddt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("employee", EmployeeSchema);
