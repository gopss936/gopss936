const mongoose = require("mongoose");

const DeliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "Delivered"],
      default: "Pending",
    },
    store_id: {
      type: String,
    },
    // Add other necessary fields for delivery details
  },
  { timestamps: true }
);

const Delivery = mongoose.model("Delivery", DeliverySchema);

module.exports = Delivery;
