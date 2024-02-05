const { string } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  order_id: String,
  customer_id: String,
  customer_name: String,
  phone: String,
  sellers: String,
  total: String,
  store_id: String,
  delivery_charges: String,
  tax: String,
  discount: String,
  promo_discount: String,
  total_payable_amount: Number,
  total_amount: Number,
  total_discount_amount: Number,
  wallet_money_used: String,
  payment_method: String,
  order_detail: Array,
  totalPriceWithDiscount: String,
  TotalamountWithTax: String,
  order_status: {
    type: Number,
    default: 1, // 1 = created , 2 = accepted , 3 = on the way , 4 = delivered , 5 =cancel
  },

  delivery_status: String,

  shipping_address: Object,
  billing_address: Object,
  assigned_to: String,
   storeDetails:Object,
  assigned_by: String,
  delivery_boy: String,

  ordered_on: {
    type: Date,
    default: Date.now
  },
})

const order = mongoose.model(
  "order", orderSchema
);


const orderRetrunSchema = new mongoose.Schema({
  requested_by: String,
  product_name: String,
  order_id: String,
  price: String,
  discounted_price: String,
  quantity: Number,
  total: String,

  status: {
    type: Number,
    default: 1,
  },
  reason: String,
  action: {
    type: Number,
    default: 1, // 1 = Accept , 2 = reject 
  },
  created_date: {
    type: Date,
    default: Date.now
  },
})

const order_return = mongoose.model(
  "order_return", orderRetrunSchema
);
module.exports = { order, order_return }