var validation = require("../helper/validation");
var helper = require("../helper/helper");
var orderHelper = require("../helper/orderhelper");
const nodemailer = require("nodemailer");
const Delivery = require("../models/deliveries_model");
const {
  pushNotification,
} = require("../services/firebaseServices/pushNotification");
const { product } = require("../models/product_model");
const { users } = require("../models/user_model");
const { assignDeliveryBoy } = require("../services/orderService");
require("dotenv").config();
var moment = require("moment");
// const users = require("../models/user_model");
const { order, order_return } = require("../models/order_model");
const { cart } = require("../models/cart_model");
const { store } = require("../models/store_model")

const notification = require("../models/notification_model");
const employee = require("../models/employee_model");
const { Orderschema } = require("../helper/schemavalidation");
const { response } = require("express");


async function placeOrder(req, res) {
  try {
    var {
      customer_name,
      phone,
      sellers,
      delivery_charges,
      promo_discount,
      payment_method,
      shipping_address,
      deviceToken,
    } = req.body;
    let total_payable_amount = 0

    const { error } = Orderschema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details);
    }
    const customer_id = req["user_id"];



    const type = req["type"];
    if (customer_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "customer is un-authorised !",
      };
      return res.status(401).send(response);
    }
    let Cart = await cart.findOne({ user: customer_id });
    let customer = await users.find({_id:customer_id})
    let customer_email =  customer.email
   
    if (Cart) {


      let cartItems = {};

      Cart.items.forEach((item) => {
        const { storeId } = item;

        if (cartItems[storeId]) {
          cartItems[storeId].push(item);
        } else {
          cartItems[storeId] = [item];
        }
      });
      console.log('cartItems....', cartItems)
      const cartItemsArray = Object.entries(cartItems).map(
        ([storeId, items]) => ({
          storeId,
          items,
        })
      );


      for (let i = 0; i < cartItemsArray.length; i++) {


        const data = {
          customer_id: customer_id,
          customer_name: customer_name,
          phone: shipping_address.phone,
          sellers: sellers,
          delivery_charges: delivery_charges,
          payment_method: payment_method,
          order_detail: cartItemsArray[i].items,
          payment_method: "COD",
          shipping_address: shipping_address,
          billing_address: shipping_address,
          promo_discount: promo_discount,
          // total_payable_amount: total_payable_amount,
        };


        let orderResposnse = await order.create(data);

        let combinedItems = {};
        console.log('order_rsponse', orderResposnse)
        if (orderResposnse) {
          orderResposnse.order_detail.forEach((item) => {
            const { storeId } = item;

            if (combinedItems[storeId]) {
              combinedItems[storeId].push(item);
            } else {
              combinedItems[storeId] = [item];
            }
          });

          const combinedItemsArray = Object.entries(combinedItems).map(
            ([storeId, items]) => ({
              storeId,
              items,
            })
          );
          let total_amount = 0;
          let priceWithTax = 0;

          let TotalamountWithTax = 0;
          let total_discount_amount = 0;
          for (let i = 0; i < combinedItemsArray.length; i++) {
            let storeId = combinedItemsArray[i].storeId;
            const empdetail = await employee.findOne({
              store_id: storeId,
              role: 1,
            });

            let store_items = combinedItemsArray[i].items;

            for (let j = 0; j < store_items.length; j++) {
              total_amount = total_amount + parseInt(store_items[j].final_amount);
              TotalamountWithTax = TotalamountWithTax + parseInt(store_items[j].totalPriceWithDiscount);
              console.log('TotalamountWithTax...,', TotalamountWithTax)

              const hasPercentageSymbol = store_items[j].tax.includes("%");


              taxValue = hasPercentageSymbol == true ? store_items[j].tax.replace('%', '') : store_items[j].tax;


              console.log('store_items[j].tax...', store_items[j].tax)



              // priceWithTax = priceWithTax + parseInt(store_items[j].priceWithTax);
              total_discount_amount =
                total_discount_amount +
                parseInt(store_items[j].Total_discounted_price);

              console.log("total_discount_amount..", total_discount_amount);
              let variationID = store_items[j].variation._id;
              const query = { _id: store_items[j].product };
              const productdocument = await product.findOne(query);

              const variationIndex = productdocument.variation.findIndex(
                (variation) => variation._id.equals(variationID)
              );



              orderResposnse.total_amount = total_amount;
              orderResposnse.total_discount_amount = total_discount_amount;
              orderResposnse.TotalamountWithTax = parseInt(TotalamountWithTax)
              const variationquery = {
                "items.variation._id": variationID,
              };

              const varationupdate = {
                $inc: {
                  "items.$[item].variation.stock": -1,
                },
              };

              const variationoptions = {
                arrayFilters: [{ "item.variation._id": variationID }],
              };

              const result = await cart.updateMany(
                variationquery,
                varationupdate,
                variationoptions
              );

              console.log(`${result.modifiedCount} cart documents updated`);
              if (variationIndex !== -1) {
                const query = {
                  _id: store_items[j].product,
                  "variation._id": variationID,
                };

                const update = {
                  $inc: {
                    "variation.$.stock": -1,
                  },
                };

                const result = await product.updateOne(query, update);
                if (result.modifiedCount > 0) {
                  console.log("Stock value updated successfully!");
                } else {
                  console.log("Failed to update the stock value.");
                }
              } else {
                console.log("No variation found with the provided variation ID.");
              }
            }

            data["email_id"] = empdetail.email;
            data["total_amount"] = total_amount;
            data["TotalamountWithTax"] = TotalamountWithTax;
            // data["priceWithTax"] = priceWithTax;
            data["order_date"] = new Date().toLocaleString("en-Us", {
              timeZone: "Asia/Kolkata",
            });
            data["order_status"] = "success";
            data["order_id"] = orderResposnse._id;
            data["customer_email"] = customer_email;
            await orderHelper.generatePDFAndSendMail(data, store_items);

            const addnotification = {
              sender_id: customer_id,
              store_id: storeId,
              order_id: orderResposnse.order_id,
              message: "has placed an order",
              sender_type: 1,
              receiver_id: empdetail._id,
            };
            const notfication = await notification.create(addnotification);



            total_payable_amount = promo_discount ? TotalamountWithTax - parseFloat(promo_discount) : TotalamountWithTax
            total_payable_amount = delivery_charges ? parseInt(total_payable_amount) + parseInt(delivery_charges) : total_payable_amount



            orderResposnse.total_payable_amount = parseInt(total_payable_amount)


            let title = "New order";
            let body = "You have received a new order in your DCH store";
            orderResposnse.save()
            const pushNotifications = await pushNotification(
              deviceToken,
              title,
              body
            );

            var response = {
              status: 200,
              message: "order placed successfully..",
              data: orderResposnse,
            };
          }




        }
        else {
          var response = {
            status: 201,
            message: "Unable to add order",
          };
          return res.status(201).send(response);
        }
      }

      cart
        .findOneAndDelete({ user: customer_id })
        .then((deletedCart) => {
          if (deletedCart) {
            console.log("Cart deleted successfully");
          } else {
            console.log("Cart not found");
          }
        })
        .catch((error) => {
          console.error("Error deleting cart:", error);
        });
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "there is no product availble in car for this user",
      };

      return res.status(201).send(response);
    }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}




async function editorder(req, res) {
  try {
    const customer_id = req["user_id"];
    const type = req["type"];
    if (customer_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "customer is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const {
      customer_name,
      store_id,
      phone,
      sellers,
      delivery_charges,
      tax,
      discount,
      promo_discount,
      payment_method,
      order_detail,
      shipping_address,
      order_id,
      order_status
    } = req.body;
    const orderRes = await order.findOne({ _id: order_id });

    console.log("orderRes...", orderRes);
    if (orderRes) {
      const data = {
        customer_id: customer_id,
        customer_name: customer_name,
        phone: phone,
        sellers: sellers,
        store_id: store_id,
        delivery_charges: delivery_charges,
        tax: tax,
        discount: discount,
        promo_discount: promo_discount,
        payment_method: payment_method,
        order_detail: order_detail,
        shipping_address: shipping_address,
        order_status: order_status
      };
      order.findByIdAndUpdate(
        { _id: order_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "order Update failed",
            };
            return res.status(201).send(response);
          } else {
            const orderData = await order.findOne({ _id: order_id });
            var response = {
              status: 200,
              message: "order updated successfully",
              data: orderData,
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "order not available",
      };

      return res.status(201).send(response);
    }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}

async function deleteorder(req, res) {
  try {
    const customer_id = req["user_id"];
    const type = req["type"];
    if (customer_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "customer is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { order_id } = req.body;
    const orderRes = await order.findOne({ _id: order_id });
    if (orderRes) {
      order.findByIdAndDelete({ _id: order_id }, async function (err, docs) {
        if (err) {
          var response = {
            status: 201,
            message: "order delete failed",
          };
          return res.status(201).send(response);
        } else {
          var response = {
            status: 200,
            message: "order deleted successfully",
          };
          return res.status(200).send(response);
        }
      });
    } else {
      var response = {
        status: 201,
        message: "order not Available",
      };

      return res.status(201).send(response);
    }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}

async function orderList(req, res) {

  try {
    const customer_id = req["user_id"];
    const type = req["type"];
    if (customer_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "customer is un-authorised !",
      };
      return res.status(401).send(response);
    }
    let customer = await users.findOne({ _id: customer_id });



    if (customer.role == "deliveryboy") {
      console.log('inside the deliveryboy')
      var orderdata = await order.find({ delivery_boy: customer_id }).sort({ ordered_on: -1 });
      var response = {
        status: 200,
        message: "success",
        data: orderdata,
      };
      return res.status(200).send(response);
    }

    var orderdata = await order.find({ customer_id: customer_id }).sort({ ordered_on: -1 });
    var response = {
      status: 200,
      message: "success",
      data: orderdata,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}

async function orderbystatus(req, res) {
  try {
    const vendor_id = req["user_id"];
    const type = req["type"];
    if (vendor_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "vendor is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { order_status, order_id } = req.body;
    var orderdata = await order.find({
      _id: order_id,
      order_status: order_status,
    });
    var response = {
      status: 200,
      message: "success",
      data: orderdata,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}



// async function orderbystore(req, res) {
//   try {
//     const customer_id = req["user_id"];
//     const type = req["type"];
//     if (customer_id == null || type == 2 || type == 3) {
//       var response = {
//         status: 401,
//         message: "customer is un-authorised !",
//       };
//       return res.status(401).send(response);
//     }
//     const { store_id } = req.body;
//     var orderdata = await order.find({ store_id: store_id });
//     var response = {
//       status: 200,
//       message: "success",
//       data: orderdata,
//     };
//     return res.status(200).send(response);
//   } catch (error) {
//     console.log("error", error);
//     response = {
//       status: 201,
//       message: "Operation was not successful",
//     };

//     return res.status(201).send(response);
//   }
// }



async function orderbystore(req, res) {
  try {
    const customer_id = req["user_id"];
    const type = req["type"];
    if (customer_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "Customer is unauthorized!",
      };
      return res.status(401).send(response);
    }
    const { store_id } = req.body;
    let storeDetails = await store.findOne({ _id: store_id });

    console.log('storeDetails...', storeDetails)
    var orderdata = await order.find({}).sort({ ordered_on: -1 });

    // Filter orders by store_id in order_detail
    var orderDetails = [];
    for (let i = 0; i < orderdata.length; i++) {
      const order = orderdata[i];

      let orderStatus = ""
      if (order.order_status == 1) {

        orderStatus = "created"
      }
      else if (order.order_status == 2) {
        orderStatus = "accepted"
      }
      else if (order.order_status == 3) {
        orderStatus = "on the way"
      }
      else if (order.order_status == 4) {
        orderStatus = "delivered"
      }
         else if (order.order_status == 5) {
        orderStatus = "assigned"
      }
      else {
        orderStatus = "cancel"
      }
      const orderDetailsFiltered = order.order_detail.filter(
        (detail) => detail.storeId === store_id
      );
      if (orderDetailsFiltered.length > 0) {
        orderDetails.push({
          _id: order._id,
          customer_id: order.customer_id,
          customer_name: order.customer_name,
          phone: order.phone,
          sellers: order.sellers,
          delivery_charges: order.delivery_charges,
          tax: order.tax,
          discount: order.discount,
          promo_discount: order.promo_discount,
          payment_method: order.payment_method,
          order_detail: orderDetailsFiltered,
          order_status: order.order_status,
          shipping_address: order.shipping_address,
          ordered_on: order.ordered_on,
          total_amount: order.total_amount,
          order_status: orderStatus,
          storeDetails: storeDetails,
          total_payable_amount: order.total_payable_amount,
          __v: order.__v,
        });
      }
    }

    var response = {
      status: 200,
      message: "Success",
      data: orderDetails,
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log("Error:", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}





async function orderCancelreturn(req, res) {
  try {
    const {
      product_name,
      order_id,
      price,
      discounted_price,
      reason,
      total,
      quantity,
      action,
    } = req.body;
    const customer_id = req["user_id"];
    const type = req["type"];
    if (customer_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "customer is un-authorised !",
      };
      return res.status(401).send(response);
    }
    if (order_id != "") {
      const orderRes = await order.findOne({ _id: order_id });

      if (orderRes) {
        const data = {
          requested_by: customer_id,
          product_name: product_name,
          order_id: order_id,
          price: price,
          discounted_price: discounted_price,
          quantity: quantity,
          total: total,
          reason: reason,
          action: action,
        };
        orderResposnse = await order_return.create(data);
        if (orderResposnse) {
          var response = {
            status: 200,
            message: "Request has send successfully",
            data: orderResposnse,
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Unable to cancel/return order",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "order not availabe",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "order_id can not be empty",
      };

      return res.status(201).send(response);
    }
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}

async function getOrderById(req, res) {
  try {
    const store_id = req['user_id'];
    console.log('store_id..', store_id)
     let storeDetails = await employee.findOne({ _id: store_id });
    console.log('storeDetails..', storeDetails)
    
     const orderId = req.params.id;
    const orderResposnse = await order.findOne({ _id: orderId });
    orderResposnse.storeDetails = storeDetails
    console.log('orderResposnse..', orderResposnse)
    var orderDetails = [];
    if (orderResposnse) {
      const order = orderResposnse;

      let orderStatus = ""
      if (order.order_status == 1) {

        orderStatus = "created"
      }
      else if (order.order_status == 2) {
        orderStatus = "accepted"
      }
      else if (order.order_status == 3) {
        orderStatus = "on the way"
      }
      else if (order.order_status == 4) {
        orderStatus = "delivered"
      }
      else {
        orderStatus = "cancel"
      }

      orderResposnse.orderStatus = orderStatus
      
       
       
    }

    // var response = {
    //   status: 200,
    //   message: "Success",
    //   data: orderDetails,
    // };
    return res.status(200).send(orderResposnse);
  } catch (error) {
    console.log("Error:", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}
module.exports = {
  placeOrder,
  deleteorder,
  editorder,
  orderList,
  orderbystatus,
  orderbystore,
  orderCancelreturn,
  getOrderById
};
