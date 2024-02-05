var validation = require("../helper/validation");
var helper = require("../helper/helper");

require("dotenv").config();
var moment = require("moment");
const employee = require("../models/employee_model");
const users = require("../models/user_model");
const notification = require("../models/notification_model");

async function usernotification(req, res) {
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
    const customerinfo = await notification.find({
      receiver_id: customer_id,
      sender_type: 2,
    });
    if (customerinfo) {
      var response = {
        status: 200,
        message: "notification list found",
        data: customerinfo,
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "notification list not found",
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
async function storenotification(req, res) {
  try {
    const emp_id = req["user_id"];
    console.log("emp_id: ", emp_id);
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const empinfo = await employee.findOne({ _id: emp_id });
    if (empinfo.store_id) {
      const customerinfo = await notification.aggregate([
        {
          $match: { store_id: empinfo.store_id, sender_type: 1 },
        },
        {
          $lookup: {
            from: "users",
            let: { sender_id: "$sender_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", { $toObjectId: "$$sender_id" }],
                  },
                },
              },
            ],
            as: "userinfo",
          },
        },
        {
          $set: {
            userinfo: {
              $arrayElemAt: ["$userinfo", 0],
            },
          },
        },
        {
          $project: {
            userinfo: {
              password: 0,
              balance: 0,
              city: 0,
              pin_code: 0,
              status: 0,
              verified: 0,
              otp: 0,
              signup_mode: 0,
              accesstoken: 0,
              facebook_id: 0,
              google_id: 0,
              wallet_amount: 0,
            },
          },
        },
      ]);

      if (customerinfo) {
        var response = {
          status: 200,
          message: "notification list found",
          data: customerinfo,
        };
        return res.status(200).send(response);
      } else {
        var response = {
          status: 201,
          message: "notification list not found",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "notification list not found",
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

async function addNotification(req, res) {
  // created by  store or vendor
  try {
    const emp_id = req["user_id"];
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const { name, description, notification_image } = req.body;
    const empinfo = await employee.findOne({ _id: emp_id });
    console.log(req.body, "BODY");
    if (notification_image) {
      // var notification_image = req.files.notification_image[0].filename;
      //   const empdetail = await admin.findOne({ _id: user_id });
      const data = {
        notification_image: notification_image,
        store_id: empinfo.store_id,
        description: description,
        name: name,
      };
      const notificationResponse = await notification.create(data);
      if (notificationResponse) {
        var response = {
          status: 200,
          message: "notification added successfully",
          data: notificationResponse,
          notification_url: process.env.BASE_URL + "/notification",
        };
        return res.status(200).send(response);
      } else {
        var response = {
          status: 201,
          message: "Unable to add notification",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "please upload notification image",
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
async function notificationList(req, res) {
  try {
    const emp_id = req["user_id"];
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const empinfo = await employee.findOne({ _id: emp_id });
    var notificationdata = await notification.find({
      store_id: empinfo.store_id,
    });
    //var notificationdata = await notification.find();
    var response = {
      status: 200,
      message: "success",
      data: notificationdata,
      notification_url: process.env.BASE_URL + "/notification",
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
async function deleteNotification(req, res) {
  //  created by  store
  try {
    const emp_id = req["user_id"];
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { notification_id } = req.body;
    const notificationRes = await notification.findOne({
      _id: notification_id,
    });
    if (notificationRes) {
      notification.findByIdAndDelete(
        { _id: notification_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "notification delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "notification deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "notification not Available",
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

async function editNotification(req, res) {
  // created by  store

  try {
    const emp_id = req["user_id"];
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "employee is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { name, notification_id, notification_image, description } = req.body;
    if (notification_image) {
      const data = {
        notification_image: notification_image,
        description: description,
        name: name,
      };
      //console.log('data',data);
      notification.findByIdAndUpdate(
        { _id: notification_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "notification Updated failed",
            };
            return res.status(201).send(response);
          } else {
            const notificationData = await notification.findOne({
              _id: notification_id,
            });
            var response = {
              status: 200,
              message: "notification updated successfully",
              data: notificationData,
              notification_url: process.env.BASE_URL + "/notification",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "upload notification image",
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

module.exports = {
  usernotification,
  storenotification,
  addNotification,
  editNotification,
  deleteNotification,
  notificationList,
};
