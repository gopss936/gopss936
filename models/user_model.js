const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: Number,
  role: {
    type: String,
    enum: ['user', 'deliveryboy'],
    default: 'user',
  },
  profile_image: {
    type: String,
    default: "default.png",
  },
  shippingAddress: {
    city: {
      type: String,
    },
    address_1: {
      type: String,
    },
    
    address_2: {
      type: String,
    },
    email:{
      type: String,
    },
    phone: {
      type: String,
    },
    company: {
      type: String,
    },
    country: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    postcode: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  billingAddress: {
    city: {
      type: String,
    },
    phone: {
      type: String,
    },
    address_1: {
      type: String,
    },
    address_2: {
      type: String,
    },
    company: {
      type: String,
    },
    country: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    postcode: {
      type: String,
    },
    state: {
      type: String,
    },
    email:{
      type: String,
    },
  },
  balance: {
    type: String,
    default: 0,
  },
  city: String,
  pin_code: Number,
  wallet_amount: {
    type: String,
    default: 0,
  },
  status: {
    type: Number,
    default: 0, // 0 = inactive , 1 = active
  },
  verified: {
    type: Number,
    default: 0, // 0 = unverified , 1 = verified
  },
  otp: {
    type: String,
    default: "",
  },
  signup_mode: {
    // 	0=app,1=fb,2=G
    type: Number,
    default: 0,
  },
  accesstoken: {
    type: String,
    default: "",
  },
  facebook_id: {
    type: String,
    default: "",
  },
  google_id: {
    type: String,
    default: "",
  },
  Created_on: {
    type: Date,
    default: Date.now,
  },
});

const users = mongoose.model("users", UserSchema);
module.exports =  {users}
