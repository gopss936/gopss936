var validation = require("../helper/validation");
var helper = require("../helper/helper");
require("dotenv").config();
var moment = require("moment");
const { category, subCategory } = require("../models/category_model");
const { product } = require("../models/product_model");
const _ = require("lodash");
const { map } = require("lodash");
const employee = require("../models/employee_model");

async function addproduct(req, res) {
  // created by  store or vendor

  try {
    // 
    
    const {
      product_name,
      product_description,
      tax,
      seller,
      category_id,
      subcategory_id,
      product_type,
      manufacturer,
      made_in,
      is_returnable,
      is_cancel_able,
      offer,
      // delivery_place,
      // price,
      // type,
      // variation,
      // variations: [
      //   {
      //     measurement,
      //     price,
      //     stock,
      //     discounted_price,
      //     status,
      //     images = [],
      //   } = {},
      // ],
      main_img,
      // otherimage,
    } = req.body;
  
   

    const emp_id = req["user_id"];
    const typee = req["type"];
    if (emp_id == null || typee == 1 || typee == 3) {
      var response = {
        status: 401,
        message: "employee is un-authorised !",
      };
      return res.status(401).send(response);
    }
    // var otherimage = [];
    if (product_name != "") {
      const employeeRes = await employee.findOne({ _id: emp_id });
      var productCheck = await product.findOne({
        product_name: product_name,
        created_by: emp_id,
      });
      if (!productCheck) {
        // if (req.files.main_img != undefined || req.files.main_img != null || req.files.main_img != '')
        //     var main_img = req.files.main_img[0].filename;

        // if (typeof req.files.other_images !== 'undefined') {
        //     otherimage = _.map(req.files.other_images, 'filename');
        // }
        const variations = req.body.variation;
        delete req.body.variation;
    
      
        let data = {
          product_name: product_name,
          product_description: product_description,
          tax: tax,
          seller: seller,
          product_type: product_type,
          manufacturer: manufacturer,
          category_id: category_id,
          subcategory_id: subcategory_id,
          store_id:  employeeRes.store_id,
         
          created_by: emp_id,
          offer: offer,
          main_img: main_img,
          made_in: made_in,
          is_returnable: is_returnable,
          is_cancel_able: is_cancel_able,
        //  variation: [
        //   {
        //     measurement,
        //     price,
        //     stock,
        //     discounted_price,
        //     status,
        //     images 
        //   }
        // ]
      };
     
      data.variation = variations;

      console.log("data",data)
        const productResponse = await product.create(data);
        // if (req.body.variation && Array.isArray(req.body.variation)) {
        //   req.body.variation.forEach((variant) => {
        //     product.variation.push(variant);
        //   });
        // }
        // await product.create();

        if (productResponse) {
          var response = {
            status: 200,
            message: "Product added successfully",
            data: productResponse,
            imgbase_url: process.env.BASE_URL + "/product",
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Unable to add product",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "Product already exist",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "product name can not be empty",
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

async function editproduct(req, res) {
  // created by  store

  try {
    const store_id = req["user_id"];
    const type = req["type"];
    if (store_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    // var otherimage = [];
    const {
      product_name,
      product_description,
      tax,
      seller,
      category_id,
      subcategory_id,
      product_type,
      manufacturer,
      made_in,
      is_returnable,
      is_cancel_able,
      delivery_place,
      offer,
      price,
      product_id,
      main_img,
      otherimage,
      variation,
    } = req.body;
    const productRes = await product.findOne({
      _id: product_id,
      created_by: store_id,
    });
    if (productRes) {
      // if (req.files.main_img == undefined || req.files.main_img == null || req.files.main_img == '') {
      //     main_img = productRes.main_img;
      // } else {
      //     main_img = req.files.main_img[0].filename;
      // }
      // if (req.files.other_images == undefined || req.files.other_images == null || req.files.other_images == '') {
      //     otherimage = productRes.other_images;
      // } else {
      //     otherimage = _.map(req.files.other_images, 'filename');
      // }
      const data = {
        product_name: product_name,
        product_description: product_description,
        tax: tax,
        seller: seller,
        product_type: product_type,
        manufacturer: manufacturer,
        category_id: category_id,
        subcategory_id: subcategory_id,
        offer: offer,
        main_img: main_img,
        made_in: made_in,
        is_returnable: is_returnable,
        is_cancel_able: is_cancel_able,
        delivery_place: delivery_place,
        other_images: otherimage,
        price: price,
        variation: variation,
      };
      product.findByIdAndUpdate(
        { _id: product_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "Product Updated failed",
            };
            return res.status(201).send(response);
          } else {
            const productData = await product.findOne({ _id: product_id });
            var response = {
              status: 200,
              message: "product updated successfully",
              data: productData,
              imgbase_url: process.env.BASE_URL + "/product",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "Product not Available",
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

async function deleteproduct(req, res) {
  //  created by  store
  try {
    const store_id = req["user_id"];
    const type = req["type"];
    if (store_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { product_id } = req.body;
    const productRes = await product.findOne({ _id: product_id });
    if (productRes) {
      product.findByIdAndDelete(
        { _id: product_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "Product delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "Product deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "Product not Available",
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

async function productList(req, res) {
  try {
    const { limit, offset } = req.body;
    offsett = limit * offset;
    var productdata = await product
      .find()
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    var response = {
      status: 200,
      message: "success",
      data: productdata,
      imgbase_url: process.env.BASE_URL + "/product",
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

async function getproduct(req, res) {
  try {
    const { product_id } = req.body;
    var productdata = await product.findOne({ _id: product_id });
    var response = {
      status: 200,
      message: "success",
      data: productdata,
      imgbase_url: process.env.BASE_URL + "/product",
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

async function productbycategoryid(req, res) {
  try {
    const { category_id } = req.body;
    const productRes = await product.find({ category_id: category_id });
    if (productRes) {
      var response = {
        status: 200,
        message: "product category",
        data: productRes,
        imgbase_url: process.env.BASE_URL + "/product",
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "Product not Available",
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

async function productbysubcategoryid(req, res) {
  try {
    const { subcategory_id } = req.body;
    const productRes = await product.find({
      subcategory_id: subcategory_id,
    });
    if (productRes) {
      var response = {
        status: 200,
        message: "product subcategory list",
        data: productRes,
        imgbase_url: process.env.BASE_URL + "/product",
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "Product not Available",
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
async function productbystoreid(req, res) {
  try {
    const productRes = await product.find().sort({ created_on: -1 });
    if (productRes) {
      var response = {
        status: 200,
        message: "product by store",
        data: productRes,
        imgbase_url: process.env.BASE_URL + "/product",
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "Product not Available",
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
async function productbyoffer(req, res) {
  try {
    const { offer } = req.body;
    const productRes = await product.find({ offer: offer });
    if (productRes) {
      var response = {
        status: 200,
        message: "product offer",
        data: productRes,
        imgbase_url: process.env.BASE_URL + "/product",
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: "Product not Available",
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
  addproduct,
  editproduct,
  deleteproduct,
  getproduct,
  productList,
  productbycategoryid,
  productbysubcategoryid,
  productbystoreid,
  productbyoffer,
};
