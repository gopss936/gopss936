const mongoose = require("mongoose");

const suadminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    mobile:Number,
    profile_img:{
      type:String,
      default:"default.png",
    },
    createddt: {
      type: Date,
      default: Date.now
    },
  })

module.exports = mongoose.model(
    "admin", suadminSchema
   );