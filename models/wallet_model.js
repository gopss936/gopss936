const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
    customer_id: String,
    type: Number, // 0 = debit , 1 = credit
    amount: String,
    message: String,
    created_by:String,
    created_on: {
      type: Date,
      default: Date.now
    },
  })

module.exports = mongoose.model(
    "wallet", walletSchema
   );