const mongoose = require("mongoose");
const driverSchema = new mongoose.Schema({

  deliveryboy_id:Object,
  name: String,
  mobile:Number,
  email: String,
  password:String,
  date_of_birth:String,
  driver_licence:String,
  national_id_card:String,
  address: String,
  created_by:String,
  pin_code:String,
   
  isAvailable: Boolean,
  store_id:{
    type:String,
  },
  createddt: {
    type: Date,
    default: Date.now
  },
})
const deliveryboy =  mongoose.model(
  "deliveryboy",driverSchema
 );
module.exports = {deliveryboy}