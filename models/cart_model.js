const { object } = require('joi');
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true },
  variation : {type:Object},
  Total_price:{type:Number},
  Total_discounted_price:{type:Number},
  storeId:{type:Object, required: true},
  final_amount:{type:Number},
  product_name:{type:Object},
  product_description:{type:Object},
  tax:{type:Object},
  category_id:{type:Object},
  subcategory_id:{type:Object},
  product_type:{type:Object},
  manufacturer:{type:Object},
  made_in:{type:Object},
  is_returnable:{type:Object},
  is_cancel_able:{type:Object},
  offer:{type:Object},
  product_status:{type:Object},
  main_img:{type:Object},
  final_amount:{type:Object},
  taxablePrice:{type:Object},
  priceWithTax :{type:Object},
  totalPriceWithDiscount:{type:Object}
});


const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [cartItemSchema],
    
  });

 
  const cart = mongoose.model("Cart", cartSchema);

  module.exports = {cart}
