var validation = require("../helper/validation");
var helper = require("../helper/helper");
require("dotenv").config();
const { banner } = require("../models/banner_model");
const employee = require("../models/employee_model");

async function addbanner(req, res) {
  // created by  store or vendor
  try {
    const emp_id = req["user_id"];
    const usertype = req["type"];
    if (emp_id == null || usertype == 1 || usertype == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }

    const { name, type, banner_image } = req.body;
    if (req.body) {
      // var banner_image = req.files.banner_image[0].filename;
      const empdetail = await employee.findOne({ _id: emp_id });
      const data = {
        banner_image: banner_image,
        store_id: empdetail.store_id,
        type: type,
        name: name,
        employee_id: emp_id,
      };
      const storeResponse = await banner.create(data);
      if (storeResponse) {
        var response = {
          status: 200,
          message: "banner added successfully",
          data: storeResponse,
          banner_url: process.env.BASE_URL + "/banner",
        };
        return res.status(200).send(response);
      } else {
        var response = {
          status: 201,
          message: "Unable to add banner",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "please upload banner image",
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

async function editbanner(req, res) {
  // created by  store

  try {
    const emp_id = req["user_id"];
    const usertype = req["type"];
    if (emp_id == null || usertype == 1 || usertype == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { name, type, banner_id, banner_image } = req.body;
    if (req.body) {
      // var banner_image = req.files.banner_image[0].filename;
      const data = {
        banner_image: banner_image,
        type: type,
        name: name,
      };
      banner.findByIdAndUpdate(
        { _id: banner_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "Banner Updated failed",
            };
            return res.status(201).send(response);
          } else {
            const bannerData = await banner.findOne({ _id: banner_id });
            var response = {
              status: 200,
              message: "Banner updated successfully",
              data: bannerData,
              banner_url: process.env.BASE_URL + "/banner",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "upload banner image",
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

async function deleteBanner(req, res) {
  //  created by  store
  try {
    const emp_id = req["user_id"];
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { banner_id } = req.body;
    const bannerRes = await banner.findOne({ _id: banner_id });
    if (bannerRes) {
      banner.findByIdAndDelete({ _id: banner_id }, async function (err, docs) {
        if (err) {
          var response = {
            status: 201,
            message: "Banner delete failed",
          };
          return res.status(201).send(response);
        } else {
          var response = {
            status: 200,
            message: "Banner deleted successfully",
          };
          return res.status(200).send(response);
        }
      });
    } else {
      var response = {
        status: 201,
        message: "Banner not Available",
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

async function bannerList(req, res) {
  try {
    const emp_id = req["user_id"];
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const empdetail = await employee.findOne({ _id: emp_id });
    var bannerdata = await banner.find({ store_id: empdetail.store_id });
    //var bannerdata = await banner.find();
    var response = {
      status: 200,
      message: "success",
      data: bannerdata,
      banner_url: process.env.BASE_URL + "/banner",
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

async function bannerListByStoreId(req, res) {
  try {
    const { store_id } = req.body;
    if (!store_id) {
      var response = {
        status: 401,
        message: "Please provide store_id !!",
      };
      return res.status(401).send(response);
    }
    // const empdetail = await employee.findOne({ _id: emp_id });
    var bannerdata = await banner.find({ store_id: store_id });
    //var bannerdata = await banner.find();
    var response = {
      status: 200,
      message: "success",
      data: bannerdata,
      banner_url: process.env.BASE_URL + "/banner",
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
  addbanner,
  editbanner,
  deleteBanner,
  bannerList,
  bannerListByStoreId,
};
