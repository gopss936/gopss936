const { updateCartSchema } = require("../helper/schemavalidation");
const { cart } = require("../models/cart_model");
const { product } = require("../models/product_model");

async function addToCart(req, res) {
  try {
    const { productId, quantity, variationId } = req.body;
    
   
    
    const type = req["type"];
    const user_id = req["user_id"];
    console.log("type....", type);
    if (user_id == null || type == 2 || type == 3) {
      response = {
        status: 401,
        message: "User is un-authorised ! please login",
      };
      return res.status(401).send(response);
    }

    const Product = await product.findOne({ _id: productId });
    if (!Product) {
      return res.status(200).json({ message: "Product not found" });
    }

    if (Product && Product.variation) {
      var variation = Product.variation.find(
        (v) => v._id.toString() === variationId
      );
      if (!variation) {
        return res.status(200).json({ message: "variation not found" });
      }
    } else {
      console.log("Product or variation property not defined");
    }

    let Cart = await cart.findOne({ user: user_id });

    if (!Cart) {
      Cart = new cart({ user: user_id });
    }

    const cartItem = Cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variation._id.toString() === variationId
    );

    if (cartItem) {
      cartItem.quantity = parseInt(cartItem.quantity) + parseInt(quantity);

      cartItem.Total_price =
        parseInt(cartItem.variation.price) * cartItem.quantity;

      cartItem.Total_discounted_price =
        parseInt(cartItem.variation.discounted_price) * cartItem.quantity;
      cartItem.final_amount =
        cartItem.Total_price - cartItem.Total_discounted_price;
    } else {
      Cart.items.push({
        product_name:Product.product_name,
        product_description:Product.product_description,
        tax:Product.tax,
        category_id:Product.category_id,
        subcategory_id:Product.subcategory_id,
        product_type:Product.product_type,
        manufacturer:Product.manufacturer,
        made_in:Product.made_in,
        is_returnable:Product.is_returnable,
        is_cancel_able:Product.is_cancel_able,
        offer:Product.offer,
        product_status:Product.product_status,
        main_img:Product.main_img,
        storeId: Product.store_id,
        variation: variation,
        quantity: quantity,
        Total_price: variation.price,
        Total_discounted_price: variation.discounted_price,
        final_amount: variation.price - variation.discounted_price,
        product: Product,
        variation: variation,
        quantity: quantity,
        // Total_price: variation.price,
        // Total_discounted_price: variation.discounted_price,
        // final_amount: variation.price - variation.discounted_price,
      });
    }
    //Cart.markModified('items');
    Cart.items.forEach(item => {
     
    
       
     Cart.products_total_price += item.final_amount
     
    });
    await Cart.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully",status:200, Cart });
  } catch (e) {
    console.error("Error adding product to cart:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// async function removeFromCart(req, res) {
//   try {
//     const { productId, variationId, quantity } = req.body;

//     const user_id = req["user_id"];

//     const Cart = await cart.findOne({ user: user_id });

//     const cartItemIndex = Cart.items.findIndex(
//       (item) =>
//         item.product.toString() === productId &&
//         item.variation._id.toString() === variationId
//     );
//      if (cartItemIndex !== -1) {
//       const updatedQuantity = Cart.items[cartItemIndex].quantity - quantity;
//       const updatedTotalPrice = Cart.items[cartItemIndex].Total_price - Cart.items[cartItemIndex].variation.price
//       const updatedDiscountPrice = Cart.items[cartItemIndex].Total_discounted_price - Cart.items[cartItemIndex].variation.discounted_price
//       const updatedFareAmount = updatedTotalPrice - updatedDiscountPrice

//        if (updatedQuantity <= 0) {
//         Cart.items.splice(cartItemIndex, 1);
       
//       } else {

        
//         Cart.items[cartItemIndex].quantity = updatedQuantity;
//         Cart.items[cartItemIndex].Total_price = updatedTotalPrice;
//         Cart.items[cartItemIndex].Total_discounted_price  = updatedDiscountPrice;
//         Cart.items[cartItemIndex].final_amount = updatedFareAmount
//       }

//       await Cart.save();

//       res.status(200).json({
//         success: true,
//         message: "Item removed from cart successfully",
//         status:200,
//         Cart,
//       });
//     } else {
//       res
//         .status(404)
//         .json({ success: false, message: "Item not found in cart" ,status:404});
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// }

const getCart = async (req, res) => {
  try {
    const user_id = req["user_id"];
    const Cart = await cart.findOne({ user: user_id });

    if (Cart) {
      console.log("Cart", Cart);
      res.status(200).json({ success: true, Cart,status:200, });
    } else {
      res.status(200).json({ fail: false, Cart });
    }
  } catch (error) {
    console.error("Error retrieving cart:", error);
    throw error;
  }
};



const removeFromCart = async (req, res) => {
  const { productId, variationId, quantity } = req.body;
const user_id = req["user_id"];
  if (quantity < 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' });
    }
const { error, value } = updateCartSchema.validate(req.body);

try {
  const Cart = await cart.findOne({ user: user_id });

if (Cart) {
  const cartItemIndex = Cart.items.findIndex(
    (item) =>
      item.product.toString() === productId &&
      item.variation._id.toString() === variationId
  );

  if (cartItemIndex !== -1) {
    let updatedQuantity = Cart.items[cartItemIndex].quantity;
    let updatedTotalPrice = Cart.items[cartItemIndex].Total_price;
    let updatedDiscountPrice = Cart.items[cartItemIndex].Total_discounted_price;
    let updatedFinalAmount = Cart.items[cartItemIndex].final_amount;

    if (quantity == 0) {
      updatedQuantity -= 1;
      updatedTotalPrice -= Cart.items[cartItemIndex].variation.price;
      updatedDiscountPrice -= Cart.items[cartItemIndex].variation.discounted_price;
      updatedFinalAmount = updatedTotalPrice - updatedDiscountPrice;

      if (updatedQuantity === 0) {
        Cart.items.splice(cartItemIndex, 1);

        await Cart.save();

        return res.status(200).json({
          success: true,
          message: "Item removed from cart",
          status: 200,
         
        });
      }
    } else {
      updatedQuantity = quantity;
      updatedTotalPrice=
        Cart.items[cartItemIndex].variation.price * quantity;
      updatedDiscountPrice =
        Cart.items[cartItemIndex].variation.discounted_price * quantity;
      updatedFinalAmount = updatedTotalPrice - updatedDiscountPrice;
    }

    Cart.items[cartItemIndex].quantity = updatedQuantity;
    Cart.items[cartItemIndex].Total_price = updatedTotalPrice;
    Cart.items[cartItemIndex].Total_discounted_price = updatedDiscountPrice;
    Cart.items[cartItemIndex].final_amount = updatedFinalAmount;

    await Cart.save();
    const data =  Cart.items[cartItemIndex]
    res.status(200).json({
      success: true,
      message: "Quantity updated in cart successfully",
      status: 200,
      data,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Item not found in cart",
      status: 404,
    });
  }
} else {
  res.status(404).json({
    success: false,
    message: "Cart not found",
    status: 404,
  });
}

} catch (error) {
  res.status(500).json({ success: false, error: error.message });
}

  
}
 
module.exports = {
  addToCart,
  removeFromCart,
  getCart,
 };
