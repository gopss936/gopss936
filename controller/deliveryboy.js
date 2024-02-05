var validation = require("../helper/validation");
var helper = require("../helper/helper");
require("dotenv").config();
const { deliveryboy } = require("../models/deliveryboy_model");
const employee = require("../models/employee_model");
const {users} = require("../models/user_model")
async function adddeliveryboy(req, res) {
  // created by  store or vendor
  try {
    const emp_id = req["user_id"];
    const usertype = req["type"];
    if (emp_id == null || usertype == 1 || usertype == 3) {
      var response = {
        status: 401,
        message: "employee is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const empdetail = await employee.findOne({ _id: emp_id });
    const {
      email,
      name,
      date_of_birth,
      mobile,
      address,
      pin_code,
      password,
      national_id_card,
      driver_licence,
    } = req.body;
     
    var emailCheck = await deliveryboy.findOne({
      email: req.body.email,
      store_id: empdetail.store_id,
    });
    var userCheck = await users.findOne({
      email: req.body.email
    })
    if (!emailCheck&& !userCheck) {

      
      const newDeliveryBoy = new users({
        name: name,
        email: email,
        password: validation.hashPassword(password),
        role: 'deliveryboy',
      });
      const savedDeliveryBoy = await newDeliveryBoy.save();

      const data = {

        deliveryboy_id:savedDeliveryBoy._id,
        email: email,
        date_of_birth: date_of_birth,
        store_id: empdetail.store_id,
        created_by: emp_id,
        name: name,
        mobile: mobile,
        address: address,
        pin_code: pin_code,
        national_id_card: national_id_card,
        driver_licence: driver_licence,
        password: validation.hashPassword(password),
      };

      console.log('data..',data)
      const storeResponse = await deliveryboy.create(data);


      console.log('newDeliveryBoy...',newDeliveryBoy)
      if (storeResponse && savedDeliveryBoy) {
        var response = {
          status: 200,
          message: "deliveryboy added successfully",
          data: storeResponse,
          deliveryboy_url: process.env.BASE_URL + "/driver",
        };
        return res.status(200).send(response);
      } else {
        var response = {
          status: 201,
          message: "Unable to add deliveryboy",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "email already exist",
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

async function editdeliveryboy(req, res) {
  // created by  store

  try {
    const store_id = req["user_id"];
    const usertype = req["type"];
    if (store_id == null || usertype == 1 || usertype == 3) {
      var response = {
        status: 401,
        message: "employee  is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const {
      name,
      date_of_birth,
      mobile,
      address,
      pin_code,
      deliveryboy_id,
      national_id_card,
      driver_licence,
      email,
    } = req.body;

    var driverCheck = await deliveryboy.findOne({ _id: deliveryboy_id });
    if (driverCheck) {
      // if (req.files.national_id_card != undefined || req.files.national_id_card != null || req.files.national_id_card != '')
      //     var national_id_card = req.files.national_id_card[0].filename;
      // else
      //     var national_id_card = driverCheck.national_id_card;
      // if (typeof req.files.driver_licence !== 'undefined') {
      //     var driver_licence = req.files.driver_licence[0].filename;
      // } else
      //     var driver_licence = driverCheck.driver_licence;
      const data = {
        date_of_birth: date_of_birth,
        name: name,
        mobile: mobile,
        address: address,
        pin_code: pin_code,
        national_id_card: national_id_card,
        driver_licence: driver_licence,
        email: email,
      };
      deliveryboy.findByIdAndUpdate(
        { _id: deliveryboy_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "deliveryboy Updated failed",
            };
            return res.status(201).send(response);
          } else {
            const deliveryboyData = await deliveryboy.findOne({
              _id: deliveryboy_id,
            });
            var response = {
              status: 200,
              message: "deliveryboy updated successfully",
              data: deliveryboyData,
              deliveryboy_url: process.env.BASE_URL + "/driver",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "delivery boy not found",
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

async function deletedeliveryboy(req, res) {
  //  created by  store
  try {
    const store_id = req["user_id"];
    const type = req["type"];
    if (store_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee  is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { deliveryboy_id } = req.body;
    const deliveryboyRes = await deliveryboy.findOne({ _id: deliveryboy_id });
    if (deliveryboyRes) {
      deliveryboy.findByIdAndDelete(
        { _id: deliveryboy_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "deliveryboy delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "deliveryboy deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "deliveryboy not Available",
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

async function deliveryboyList(req, res) {
  try {
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
    var deliveryboydata = await deliveryboy.find({
      store_id: empdetail.store_id,
    }).sort({ createddt: -1 });
    //var deliveryboydata = await deliveryboy.find();
    var response = {
      status: 200,
      message: "success",
      data: deliveryboydata,
      deliveryboy_url: process.env.BASE_URL + "/deliveryboy",
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
  adddeliveryboy,
  editdeliveryboy,
  deletedeliveryboy,
  deliveryboyList,
};
