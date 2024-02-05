var validation = require("../helper/validation");
var helper = require("../helper/helper");

require("dotenv").config();
var moment = require("moment");
const offer = require("../models/offer_model");
const employee = require("../models/employee_model");

async function addoffer(req, res) {
  try {
    const {
      promo_code,
      message,
      start_date,
      end_date,
      no_of_user,
      min_order_amount,
      discount,
      max_discount_type,
      discount_type,
      repeat_usage,
    } = req.body;
    const emp_id = req["user_id"];
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee  is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const empdetail = await employee.findOne({ _id: emp_id });
    if (req.body.promo_code != "") {
      var promocodeCheck = await offer.findOne({
        promo_code: req.body.promo_code,
      });
      if (!promocodeCheck) {
        const data = {
          promo_code: promo_code,
          message: message,
          start_date: start_date,
          end_date: end_date,
          no_of_user: no_of_user,
          discount: discount,
          max_discount_type: max_discount_type,
          repeat_usage: repeat_usage,
          store_id: empdetail.store_id,
          employee_id: emp_id,
          min_order_amount: min_order_amount,
          discount_type: discount_type,
        };
        const usersResposnse = await offer.create(data);
        if (usersResposnse) {
          var response = {
            status: 200,
            message: "offer added successfully",
            data: usersResposnse,
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Unable to add offer",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "Promo code exist",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "Promo code can not be empty",
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

async function editoffer(req, res) {
  try {
    const vendor_id = req["user_id"];
    const type = req["type"];
    if (vendor_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee  is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const {
      promo_code,
      message,
      start_date,
      end_date,
      no_of_user,
      min_order_amount,
      discount,
      max_discount_type,
      discount_type,
      repeat_usage,
      offer_id,
    } = req.body;
    const offerRes = await offer.findOne({ _id: offer_id });

    if (offerRes) {
      const data = {
        promo_code: promo_code,
        message: message,
        start_date: start_date,
        end_date: end_date,
        no_of_user: no_of_user,
        discount: discount,
        max_discount_type: max_discount_type,
        repeat_usage: repeat_usage,
        min_order_amount: min_order_amount,
        discount_type: discount_type,
      };
      offer.findByIdAndUpdate(
        { _id: offer_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "Offer Update failed",
            };
            return res.status(201).send(response);
          } else {
            const offerData = await offer.findOne({ _id: offer_id });
            var response = {
              status: 200,
              message: "Offer updated successfully",
              data: offerData,
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "offer not Available",
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

async function deleteoffer(req, res) {
  try {
    const vendor_id = req["user_id"];
    const type = req["type"];
    if (vendor_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee  is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { offer_id } = req.body;
    const offerRes = await offer.findOne({ _id: offer_id });
    if (offerRes) {
      offer.findByIdAndDelete({ _id: offer_id }, async function (err, docs) {
        if (err) {
          var response = {
            status: 201,
            message: "Offer delete failed",
          };
          return res.status(201).send(response);
        } else {
          var response = {
            status: 200,
            message: "Offer deleted successfully",
          };
          return res.status(200).send(response);
        }
      });
    } else {
      var response = {
        status: 201,
        message: "Offer not Available",
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

async function offerList(req, res) {
  try {
    const vendor_id = req["user_id"];
    const type = req["type"];
    if (vendor_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee  is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const empdetail = await employee.findOne({ _id: vendor_id });
    var offerdata = await offer.find({ store_id: empdetail.store_id });
    var response = {
      status: 200,
      message: "success",
      data: offerdata,
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
module.exports = {
  addoffer,
  editoffer,
  deleteoffer,
  offerList,
};
