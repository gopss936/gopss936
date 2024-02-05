const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
  store_id:Object,
  coupon_code:String,
  start_date:String,
  end_date:String,
  employee_id:String,
  discount_amount:String,
  repeat_usage:Number,
  created_on: {
    type: Date,
    default: Date.now
  },
})

const coupon =  mongoose.model(
  "coupon",couponSchema
 );
module.exports = {coupon}