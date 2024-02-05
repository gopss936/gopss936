// const mongoose = require("mongoose");
// const notificationSchema = new mongoose.Schema({
//     sender_id:Object,
//     receiver_id:Object,
//     message:String,
//     order_id:String,
//     store_id:String,
//     sender_type:Number,    // 1 = customer , 2 = store employee
//     createddt: {
//       type: Date,
//       default: Date.now
//     },
//   })
// module.exports = mongoose.model(
//     "notification", notificationSchema
// );

const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  //   store_id:Object,
  name: String,
  description: String,
  notification_image: {
    type: String,
  },
  createdby_type: {
    type: Number,
    dafault: 1, // type = 1 admins,
  },
  status: {
    type: Number,
    default: 1, // 0 = inactive , 1 = active
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notification", notificationSchema);
