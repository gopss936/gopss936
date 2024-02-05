var validation = require("../helper/validation");
var helper = require("../helper/helper");

require("dotenv").config();
var moment = require("moment");
const employee = require("../models/employee_model");

async function employeeRegistration(req, res) {
  try {
    const { email, name, mobile, address, password, store_id } = req.body;
    const vendor_id = req["user_id"];
    const type = req["type"];
    if (vendor_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const storadmin = await employee.findOne({
      _id: vendor_id,
      role: 1,
      store_id: store_id,
    });
    if (storadmin) {
      if (req.body.email != "") {
        var emailCheck = await employee.findOne({ email: req.body.email });
        console.log(req.body);
        if (!emailCheck) {
          const data = {
            email: email,
            name: name,
            // date_of_birth: date_of_birth,
            // national_id_card: national_id_card,
            mobile: mobile,
            address: address,
            role: 2,
            store_id: store_id,
            password: validation.hashPassword(password),
          };
          const usersResposnse = await employee.create(data);
          if (usersResposnse) {
            usersResposnse.password = undefined;
            var response = {
              status: 200,
              message: "Employee added successfully",
              data: usersResposnse,
            };
            return res.status(200).send(response);
          } else {
            var response = {
              status: 201,
              message: "Unable to add employee",
            };
            return res.status(201).send(response);
          }
        } else {
          var response = {
            status: 201,
            message: "Email already exist",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "Email can not be empty",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message:
          "You are not authorised to create employee,only store owner can add employee",
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

async function editEmployeeProfile(req, res) {
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
    const { name, mobile, address, employee_id, email } = req.body;

    const storadmin = await employee.findOne({ _id: vendor_id, role: 1 });
    if (storadmin) {
      const employeeRes = await employee.findOne({ _id: employee_id });

      if (employeeRes) {
        const data = {
          name: name,
          // date_of_birth: date_of_birth,
          // national_id_card: national_id_card,
          email: email,
          mobile: mobile,
          address: address,
          role: employeeRes.role,
        };
        employee.findByIdAndUpdate(
          { _id: employee_id },
          { $set: data },
          { new: true },
          async function (err, docs) {
            if (err) {
              var response = {
                status: 201,
                message: "Profile Update failed",
              };
              return res.status(201).send(response);
            } else {
              const empData = await employee.findOne({ _id: employee_id });
              empData.password = undefined;
              var response = {
                status: 200,
                message: "Profile updated successfully",
                data: empData,
                imgbase_url: process.env.BASE_URL + "/profile",
              };
              return res.status(200).send(response);
            }
          }
        );
      } else {
        var response = {
          status: 201,
          message: "employee not Available",
        };

        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message:
          "You are not authorised to edit employee,only store owner can edit employee",
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

async function deleteEmployee(req, res) {
  try {
    const vendor_id = req["user_id"];
    const type = req["type"];
    if (vendor_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { employee_id } = req.body;
    const storadmin = await employee.findOne({ _id: vendor_id, role: 1 });
    if (storadmin) {
      const employeeRes = await employee.findOne({ _id: employee_id });
      if (employeeRes) {
        employee.findByIdAndDelete(
          { _id: employee_id },
          async function (err, docs) {
            if (err) {
              var response = {
                status: 201,
                message: "Profile delete failed",
              };
              return res.status(201).send(response);
            } else {
              var response = {
                status: 200,
                message: "Profile deleted successfully",
              };
              return res.status(200).send(response);
            }
          }
        );
      } else {
        var response = {
          status: 201,
          message: "employee not Available",
        };

        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message:
          "You are not authorised to delete employee,only store owner can delete employee",
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

async function employeeList(req, res) {
  try {
    const vendor_id = req["user_id"];
    console.log("vendor_id: ", vendor_id);
    const type = req["type"];
    if (vendor_id == null || type == 1) {
      var response = {
        status: 401,
        message: "vendor is un-authorised !",
      };
      return res.status(401).send(response);
    }
    var employeedetail = await employee.findOne({ _id: vendor_id });
    console.log('employeedetail..........',employeedetail)
    var employeedata = await employee.find(
      { store_id: employeedetail.store_id },
      { password: 0 }
    ).sort({ createddt: -1 });
    var response = {
      status: 200,
      message: "success",
      data: employeedata,
      imgbase_url: process.env.BASE_URL + "/profile",
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
  employeeRegistration,
  editEmployeeProfile,
  deleteEmployee,
  employeeList,
};
