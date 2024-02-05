var validation = require("../helper/validation");
var helper = require("../helper/helper");
require("dotenv").config();
var moment = require("moment");
const { store } = require("../models/store_model");
const { category, subCategory } = require("../models/category_model");
const employee = require("../models/employee_model");
const multer = require("multer");
const path = require("path");
const e = require("express");

async function storeRegistration(req, res) {
  // created by  superadmin credential
  try {
    const {
      name,
      email,
      store_display_name,
      admin_store_id,
      store_url,
      mobile,
      password,
      street,
      city,
      pin_code,
      state,
      latitude,
      longitude,
      store_description,
      account_number,
      bank_ifc_code,
      bank_account_name,
      commission,
      tax_name,
      GST_number,
      PAN_number,
      uploaded_id_card,
      upload_address_proof,
      logo,
    } = req.body;
    const admin_id = req["user_id"];
    const type = req["type"];
    console.log("type...", admin_id);
    // if (admin_id == null || type == 1 || type == 2) {
    //   var response = {
    //     status: 401,
    //     message: "admin is un-authorised !",
    //   };
    //   return res.status(401).send(response);
    // }
    if (req.body.email != "") {
      var emailCheck = await employee.findOne({ email: req.body.email });
      if (!emailCheck) {
        // if (req.files.logo != undefined || req.files.logo != null) {
        //   var logo = req.files.logo[0].filename;
        // }
        // if (req.files.card_id != undefined || req.files.card_id != null) {
        //   var uploaded_id_card = req.files.card_id[0].filename;
        // }
        // if (
        //   req.files.address_proof != undefined ||
        //   req.files.address_proof != null
        // ) {
        //   var upload_address_proof = req.files.address_proof[0].filename;
        // }

        const data = {
          store_url: store_url,
          store_display_name: store_display_name,
          street: street,
          admin_store_id: admin_store_id,
          email: email,
          mobile: mobile,
          password: password,
          state: state,
          city: city,
          logo: logo,
          pin_code: pin_code,
          latitude: latitude,
          longitude: longitude,
          store_description: store_description,
          account_number: account_number,
          bank_ifc_code: bank_ifc_code,
          bank_account_name: bank_account_name,
          commission: commission,
          uploaded_id_card: uploaded_id_card,
          upload_address_proof: upload_address_proof,
          tax_name: tax_name,
          GST_number: GST_number,
          PAN_number: PAN_number,
        };
        const storeResponse = await store.create(data);
        if (storeResponse) {
          const mailsendmsg = await helper.sendemails(
            email,
            name,
            password,
            5,
            "New account created"
          );
          const empdata = {
            email: email,
            name: name,
            mobile: mobile,
            password: validation.hashPassword(password),
            role: 1,
            national_id_card: uploaded_id_card,
            address: street + "  " + city + "  " + pin_code,
            store_id: storeResponse._id,
          };
          const empResponse = await employee.create(empdata);
          const empRes = await employee.aggregate([
            { $match: { store_id: storeResponse._id.toString() } },
            {
              $project: {
                employee_id: "$_id",
                name: 1,
                mobile: 1,
                role: 1,
                store_id: 1,
                _id: 0,
                email: 1,
              },
            },
          ]);
          let emp = {
            ...storeResponse._doc,
            ...empRes[0],
          };

          //  const storeinsertdata   =  await  store.aggregate([{

          //         $lookup: {
          //             from: "employees", // collection name in db
          //             let: { store_id: storeResponse._id },
          //             localField: "_id",
          //             foreignField: "store_id",
          //             as: "fromItems",
          //         }
          //     },
          //         {
          //             $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
          //          },
          //          { $project: { fromItems: 0 } }
          //     ]);
          //     console.log('storeinsertdata: ', storeinsertdata);
          var response = {
            status: 200,
            message: "Store added successfully",
            data: emp,
            profile_url: process.env.BASE_URL + "/store",
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Unable to add store",
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
  } catch (error) {
    console.log("error", error);
    response = {
      status: 201,
      message: "Operation was not successful",
    };

    return res.status(201).send(response);
  }
}

async function editStoreProfile(req, res) {
  // created by  superadmin credential
  try {
    const {
      name,
      email,
      store_display_name,
      store_url,
      mobile,
      password,
      street,
      city,
      pin_code,
      state,
      latitude,
      longitude,
      store_description,
      account_number,
      bank_ifc_code,
      bank_account_name,
      commission,
      tax_name,
      GST_number,
      PAN_number,
      store_id,
      uploaded_id_card,
      upload_address_proof,
      logo,
    } = req.body;
    const admin_id = req["user_id"];
    const type = req["type"];
    if (admin_id == null || type == 1 || type == 2) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const storeRes = await store.findOne({ _id: store_id });
    // if (
    //   req.files.logo == undefined ||
    //   req.files.logo == null ||
    //   req.files.logo == ""
    // ) {
    //   var logo = storeRes.logo;
    // } else {
    //   var logo = req.files.logo[0].filename;
    // }

    // if (
    //   req.files.address_proof == undefined ||
    //   req.files.address_proof == null ||
    //   req.files.address_proof == ""
    // ) {
    //   var upload_address_proof = storeRes.address_proof;
    // } else {
    //   var upload_address_proof = req.files.address_proof[0].filename;
    // }

    // if (
    //   req.files.card_id == undefined ||
    //   req.files.card_id == null ||
    //   req.files.card_id == ""
    // ) {
    //   var uploaded_id_card = storeRes.card_id;
    // } else {
    //   var uploaded_id_card = req.files.card_id[0].filename;
    // }
    if (storeRes) {
      const data = {
        store_url: store_url,
        store_display_name: store_display_name,
        name: name,
        mobile: mobile,
        street: street,
        state: state,
        city: city,
        logo: logo,
        pin_code: pin_code,
        latitude: latitude,
        longitude: longitude,
        store_description: store_description,
        account_number: account_number,
        bank_ifc_code: bank_ifc_code,
        bank_account_name: bank_account_name,
        commission: commission,
        uploaded_id_card: uploaded_id_card,
        upload_address_proof: upload_address_proof,
        tax_name: tax_name,
        GST_number: GST_number,
        PAN_number: PAN_number,
      };
      store.findByIdAndUpdate(
        { _id: store_id },
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
            const empResponse = await employee.findOne({
              store_id: store_id,
              role: 1,
            });
            const empdata = {
              _id: empResponse._id,
              email: email,
              name: name,
              mobile: mobile,
              // password: validation.hashPassword(password),
              role: 1,
              national_id_card: uploaded_id_card,
              address: street + "  " + city + "  " + pin_code,
              store_id: store_id,
            };
            const storeData = await store.findOne({ _id: store_id });
            const empupdatedata = await employee.findByIdAndUpdate(
              { _id: empResponse._id },
              { $set: empdata }
            );
            const empRes = await employee.aggregate([
              { $match: { store_id: store_id } },
              {
                $project: {
                  employee_id: "$_id",
                  name: 1,
                  mobile: 1,
                  role: 1,
                  store_id: 1,
                  _id: 0,
                  email: 1,
                },
              },
            ]);
            let empData = {
              ...storeData._doc,
              ...empRes[0],
            };
            var response = {
              status: 200,
              message: "Profile updated successfully",
              data: empData,
              profile_url: process.env.BASE_URL + "/store",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "Store not Available",
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

async function deleteStore(req, res) {
  //  created by  superadmin credential
  try {
    const admin_id = req["user_id"];
    const type = req["type"];
    if (admin_id == null || type == 1 || type == 2) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const { store_id } = req.body;
    const storeRes = await store.findOne({ _id: store_id });
    if (storeRes) {
      store.findByIdAndDelete({ _id: store_id }, async function (err, docs) {
        if (err) {
          var response = {
            status: 201,
            message: "Store delete failed",
          };
          return res.status(201).send(response);
        } else {
          await employee.deleteMany({ store_id: store_id });
          var response = {
            status: 200,
            message: "Store deleted successfully",
          };
          return res.status(200).send(response);
        }
      });
    } else {
      var response = {
        status: 201,
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

async function storeList(req, res) {
  try {
    const admin_id = req["user_id"];
    const type = req["type"];
    if (admin_id == null || type == 1 || type == 2) {
      var response = {
        status: 401,
        message: "admin is un-authorised !",
      };
      return res.status(401).send(response);
    }
    console.log("admin_id.... ", admin_id);

    var storedata = await store.find({ admin_store_id: admin_id });
    console.log("storedata......... ", storedata);

    var response = {
      status: 200,
      message: "success",
      data: storedata,
      profile_url: process.env.BASE_URL + "/store",
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

async function storeLogin(req, res) {
  // store employee login
  try {
    const { email, password } = req.body;
    if (email != "" && password != "") {
      var userRes = await employee.findOne({ email: email });
      if (userRes) {
        if (validation.comparePassword(userRes.password, password)) {
          const token = validation.generateUserToken(
            userRes.email,
            userRes._id,
            2,
            userRes.name,
            "logged"
          );
          const employeedata = await employee.findOne(
            { _id: userRes._id },
            { password: 0 }
          );
          var response = {
            status: 200,
            message: "Login Success",
            data: employeedata,
            token: token,
            profile_url: process.env.BASE_URL + "/store",
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Incorrect password",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "Email not exist",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "Email and password can not be empty value!",
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

async function createCategory(req, res) {
  // created by  store or store
  try {
    const { category_name, category_subtitle, category_image } = req.body;
    const emp_id = req["user_id"];
    const type = req["type"];
    console.log(type);
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const empdetail = await employee.findOne({ _id: emp_id });

    console.log("emp", empdetail);
    if (category_name != "") {
      var categoryCheck = await category.findOne({
        category_name: category_name,
        store_id: empdetail.store_id,
      });
      if (!categoryCheck) {
        // if (req.files)
        //     var categoryimg = req.files.category_image[0].filename;
        const data = {
          category_name: category_name,
          category_image: category_image,
          store_id: empdetail.store_id,
          category_subtitle: category_subtitle,
          created_by: emp_id,
        };
        const storeResponse = await category.create(data);
        if (storeResponse) {
          var response = {
            status: 200,
            message: "Store category created successfully",
            data: storeResponse,
            category_url: process.env.BASE_URL + "/category",
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Unable to create store",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "category name already exist",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "Category name can not be empty",
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

async function editStorecategory(req, res) {
  // created by  store

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
    const {
      category_name,
      category_subtitle,
      category_id,
      category_image,
      status,
    } = req.body;
    const storeRes = await category.findOne({
      _id: category_id,
    });
    // if (
    //   req.files.category_image == undefined ||
    //   req.files.category_image == null ||
    //   req.files.category_image == ""
    // ) {
    //   category_image = storeRes.category_image;
    // } else {
    //   category_image = req.files.category_image[0].filename;
    // }
    if (storeRes) {
      const data = {
        category_name: category_name,
        category_image: category_image,
        category_subtitle: category_subtitle,
        status: status,
      };
      category.findByIdAndUpdate(
        { _id: category_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "Category Updated failed",
            };
            return res.status(201).send(response);
          } else {
            const storeData = await category.findOne({ _id: category_id });
            var response = {
              status: 200,
              message: "Category updated successfully",
              data: storeData,
              category_url: process.env.BASE_URL + "/category",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "Category not Available",
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

async function deleteCategory(req, res) {
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
    const { category_id } = req.body;
    const storeRes = await category.findOne({ _id: category_id });
    if (storeRes) {
      category.findByIdAndDelete(
        { _id: category_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "Category delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "Category deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "Category not Available",
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

async function categoryList(req, res) {
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
    var categorydata = await category
      .find({ store_id: empdetail.store_id })
      .sort({ Created_on: -1 });
     

    for (let i = 0; i < categorydata.length; i++) {
      if (categorydata[i].status == 1) {
        console.log("category list status inside....1 ", categorydata[i].status);

        categorydata[i].status ="active";
        console.log("category list status inside....2 ", categorydata[i].status);
      } else {
        categorydata[i].status = "in_active";
        console.log("category list status inside)3) ", categorydata[i].status);
      }
    }
    var response = {
      status: 200,
      message: "success",
      data: categorydata,
      category_url: process.env.BASE_URL + "/category",
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

async function categoryListByStoreId(req, res) {
  try {
    var categorydata = await category.find().sort({ Created_on: -1 });
    var response = {
      status: 200,
      message: "success",
      data: categorydata,
      category_url: process.env.BASE_URL + "/category",
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


async function createSubcategory(req, res) {
  // created by  store or store
  try {
    const {
      category_id,
      subcategory_name,
      subcategory_subtitle,
      subcategory_image,
    } = req.body;
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
    if (subcategory_name != "" && category_id != "") {
      var subcategoryCheck = await subCategory.findOne({
        subcategory_name: subcategory_name,
        category_id: category_id,
        store_id: empdetail.store_id,
      });
      if (!subcategoryCheck) {
        // if (req.files)
        //   var subcategoryimg = req.files.subcategory_image[0].filename;
        const data = {
          subcategory_name: subcategory_name,
          category_id: category_id,
          store_id: empdetail.store_id,
          subcategory_subtitle: subcategory_subtitle,
          subcategory_image: subcategory_image,
          created_by: emp_id,
        };
        const subCategoryResponse = await subCategory.create(data);
        if (subCategoryResponse) {
          var response = {
            status: 200,
            message: "Subcategory created successfully",
            data: subCategoryResponse,
            base_url: process.env.BASE_URL + "/category",
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Unable to create subcategory",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "subcategory name already exist",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "Subcategory name and category can not be empty",
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

async function editSubcategory(req, res) {
  // created by  store

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
    const {
      subcategory_id,
      category_id,
      subcategory_name,
      subcategory_subtitle,
      subcategory_image,
      status,
    } = req.body;
    const storeRes = await subCategory.findOne({
      _id: subcategory_id,
      created_by: emp_id,
    });
    if (storeRes) {
      // if (
      //   req.files.subcategory_image == undefined ||
      //   req.files.subcategory_image == null ||
      //   req.files.subcategory_image == ""
      // ) {
      //   var subcategory_image = storeRes.subcategory_image;
      // } else {
      //   var subcategory_image = req.files.subcategory_image[0].filename;
      // }
      const data = {
        category_id: category_id,
        subcategory_name: subcategory_name,
        subcategory_subtitle: subcategory_subtitle,
        subcategory_image: subcategory_image,
        status: status,
      };
      subCategory.findByIdAndUpdate(
        { _id: subcategory_id },
        { $set: data },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "Subcategory Updated failed",
            };
            return res.status(201).send(response);
          } else {
            const subcategoryData = await subCategory.findOne({
              _id: subcategory_id,
            });
            var response = {
              status: 200,
              message: "Subcategory updated successfully",
              data: subcategoryData,
              base_url: process.env.BASE_URL + "/category",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "SubCategory not Available",
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

async function deleteSubCategory(req, res) {
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
    const { subcategory_id } = req.body;
    const storeRes = await subCategory.findOne({ _id: subcategory_id });
    if (storeRes) {
      subCategory.findByIdAndDelete(
        { _id: subcategory_id },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "subcategory delete failed",
            };
            return res.status(201).send(response);
          } else {
            var response = {
              status: 200,
              message: "Subcategory deleted successfully",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "SubCategory not available",
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

async function subcategoryList(req, res) {
  try {
    const emp_id = req["user_id"];
    console.log("emp_id ...", emp_id);
    const type = req["type"];
    if (emp_id == null || type == 1 || type == 3) {
      var response = {
        status: 401,
        message: "store is un-authorised !",
      };
      return res.status(401).send(response);
    }
    const empdetail = await employee.findOne({ _id: emp_id });
    console.log("empdetail..", empdetail);
    var subcategorydata = await subCategory
      .find({
        store_id: empdetail.store_id,
      })
      .sort({ Created_on: -1 });
    console.log("subcategorydata.....", subcategorydata);
    var response = {
      status: 200,
      message: "success",
      data: subcategorydata,
      base_url: process.env.BASE_URL + "/category",
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

async function subCategoriesByCategory(req, res) {
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
    const { category_id } = req.body;
    const empdetail = await employee.findOne({ _id: emp_id });
    var subcategorydata = await subCategory.find({
      store_id: empdetail.store_id,
      category_id: category_id,
    });
    var response = {
      status: 200,
      message: "success",
      data: subcategorydata,
      base_url: process.env.BASE_URL + "/category",
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

async function subCategoryListByStoreId(req, res) {
  try {
    const { category_id } = req.body;
    // if (!store_id || !category_id) {
    //   var response = {
    //     status: 401,
    //     message: "Please provide store_id, category_id !!",
    //   };
    //   return res.status(401).send(response);
    // }
    var categorydata = await subCategory
      .find({
        category_id: category_id,
      })
      .sort({ Created_on: -1 });
    var response = {
      status: 200,
      message: "success",
      data: categorydata,
      category_url: process.env.BASE_URL + "/category",
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `/var/www/skdigi/images`);
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadImage = async (req, res) => {
  console.log("req files", req.files);
  const foldername = req.params.foldername;
  let upload = multer({ storage: storage }).array("multiple_images", 10);

  upload(req, res, function (err) {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    if (err) {
      console.log("error", err);
    }
    //else if (...) // The same as when uploading single images

    let result = "";
    const files = req.files;
    console.log("files", files);
    let index, len;

    // Loop through all the uploaded images and display them on frontend
    for (index = 0, len = files.length; index < len; ++index) {
      result += `/${files[index].filename}`;
      if (index < files.length - 1) {
        result += ",";
      }
    }
    // result += '<hr/><a href="./">Upload more images</a>';
    res.send(result);
  });
};

module.exports = {
  storeRegistration,
  editStoreProfile,
  deleteStore,
  storeList,
  storeLogin,
  createCategory,
  editStorecategory,
  deleteCategory,
  categoryList,
  createSubcategory,
  editSubcategory,
  deleteSubCategory,
  subcategoryList,
  subCategoriesByCategory,
  subCategoryListByStoreId,
  categoryListByStoreId,
  uploadImage,
};
