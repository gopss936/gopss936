const mongoose = require("mongoose");
const OfferSchema = new mongoose.Schema({
    promo_code: String,
    message:String,
    start_date: String,
    end_date:String,
    no_of_user:Number,
    discount:String,
    min_order_amount:String,
    discount_type: String,
    max_discount_type:String,
    repeat_usage: String,
    employee_id:String,
    store_id:{
      type:String
    },
    createddt: {
      type: Date,
      default: Date.now
    },
  })
module.exports = mongoose.model(
     "offer", OfferSchema
   );