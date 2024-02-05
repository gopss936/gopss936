var { wishlist } = require("../models/wishlist.model");

const { product } = require("../models/product_model");
const e = require("express");

async function addWishLists(req, res) {
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

    let Wishlist = await wishlist.findOne({ user: user_id });

    if (!Wishlist) {
      Wishlist = new wishlist({ user: user_id });
    }

    const wishlistItem = Wishlist.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variation._id.toString() === variationId
    );

    if (wishlistItem) {
      return res
        .status(200)
        .json({ message: "product already added whislists" });
    } else {
      Wishlist.items.push({
        product_name: Product.product_name,
        product_description: Product.product_description,
        tax: Product.tax,
        category_id: Product.category_id,
        subcategory_id: Product.subcategory_id,
        product_type: Product.product_type,
        manufacturer: Product.manufacturer,
        made_in: Product.made_in,
        is_returnable: Product.is_returnable,
        is_cancel_able: Product.is_cancel_able,
        offer: Product.offer,
        product_status: Product.product_status,
        main_img: Product.main_img,
        storeId: Product.store_id,
        variation: variation,
        Total_price: variation.price,
        Total_discounted_price: variation.discounted_price,
        final_amount: variation.price - variation.discounted_price,
        product: Product,
        variation: variation,
      });
    }

    Wishlist.items.forEach((item) => {
      const taxRate = parseFloat(item.tax) / 100;

      const taxablePrice = parseFloat(item.final_amount);

      const priceWithTax = taxablePrice + parseFloat(taxablePrice * taxRate);

       item.priceWithTax = priceWithTax;
    });
    await Wishlist.save();

    return res.status(200).json({
      message: "Product added to Wishlist successfully",
      status: 200,
      Wishlist,
    });
  } catch (e) {
    console.error("Error adding product to cart:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getWhislists = async (req, res) => {
  try {


    const user_id = req["user_id"]
    const wishlistItems = await wishlist.findOne({user:user_id});
    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletewishlists = async (req, res) => {
  try {

    const {productId , variationId } = req.body

    const user_id = req["user_id"]
    if(!user_id){
      return res(401).json({message:"user is unauthorized"})
    }
    let Wishlist = await wishlist.findOne({user:user_id})
    if(!Wishlist){
      return res(200).json({message:"Wishlist not found"})
    }

    const index = Wishlist.items.findIndex((item) => item.product.toString() === productId && item.variation._id.toString() === variationId);

    if(index === -1){
      return res.status(200).json({ message: "Wishlist item not found" });

    }
    Wishlist.items.splice(index, 1);
    await Wishlist.save();
    return res.status(200).json({ message: "Wishlist item removed successfully" });


  } catch (error) {
    console.log('error..',error)
    return res.status(500).json({ message: "Internal server error",error });

   }
};

module.exports = {
  addWishLists,
  getWhislists,
  deletewishlists,
};
