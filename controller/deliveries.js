const express = require("express");

const { order } = require("../models/order_model");
const { deliveryboy } = require("../models/deliveryboy_model");
const Delivery = require("../models/deliveries_model");
const {users} = require("../models/user_model")
const deliveryAssign = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

    // const DeliveryBoy = await users.findOne({deliveryBoyId, role:"deliveryboy"});

    const DeliveryBoy = await users.findOne({ _id: deliveryBoyId, role: "deliveryboy" });

    console.log('DeliveryBoy..',DeliveryBoy)
    if (!DeliveryBoy) {
      return res.status(404).json({ message: "Delivery Boy not found" });
    }

     const delivery = await Delivery.findOne({ orderId, deliveryBoyId });

    if (delivery) {
      // return res
      //   .status(400)
      //   .json({ message: "Delivery already assigned to the delivery boy" });
    }

    // await order.findByIdAndUpdate(orderId, { delivery_status: "accept" },{deliveryboy:deliveryBoyId});
    let orders= await order.findByIdAndUpdate(orderId, { order_status: 5, delivery_boy: deliveryBoyId }, { new: true });

     const newDelivery = new Delivery({
      orderId,
      deliveryBoyId,
      status: "Assigned",
    
      assignedAt: new Date(),
    });
    await newDelivery.save();

    res.status(200).json({
      statusCode:200,
      message: "Order accepted and assigned successfully",
      deliveryDetails: newDelivery,
      orders:orders
    });
  } catch (e) {
      console.log('e..',e)
    res.status(500).json({ message: "An error occurred", e });
  }
};

const deliveryComplete = async (req, res) => {
  try {
    const { orderId } = req.body;

    const delivery = await Delivery.findOne({ orderId });

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    delivery.status = "Delivered";

    delivery.save();

    const Order = await order.findById(orderId);

    Order.delivery_status = "Delivered";

    await Order.save();

    res
      .status(200)
      .json({ message: "Delivery completed successfully", delivery: delivery });
  } catch (e) {}
};
module.exports = {
  deliveryAssign,
  deliveryComplete,
};
