var validation = require("../helper/validation");
var helper = require("../helper/helper");
const {userUpdateSchema} = require("../helper/userSchemavalidation")
require("dotenv").config();
var moment = require("moment");
const {users} = require("../models/user_model");

async function userRegistration(req, res) {
  try {
    if (req.body.email != "" && req.body.password != "" && req.body.phoneNumber !="") {

     

      const query = {
        $or: [
          {email:req.body.email, },
          {  phone:req.body.phoneNumber}
        ]
      };
      var emailCheck = await users.findOne(query);

      console.log('emailCheck',emailCheck)
      if (!emailCheck) {
        //const otp = await helper.getRandomInt(4);
        const otp = 1111;

         
        const data = {
          email: req.body.email,
          password: validation.hashPassword(req.body.password),
          name: req.body.name,
          city: req.body.city,
          phone:req.body.phoneNumber,
          pin_code: req.body.pin_code,
          profile_image: req.body.profile_image,
          otp: otp,
        };
        const usersResposnse = await users.create(data);
        if (usersResposnse) {
          var userRes = await users.findOne({ _id: usersResposnse });
          const token = validation.generateUserToken(
            userRes.email,
            userRes._id,
            1,
            userRes.name,
            "logged"
          );
          const userdata = {
            email: userRes.email,
            token: token,
          };
          const mailsendmsg = helper.sendemails(
            userRes.email,
            userRes.name,
            otp,
            0
          );
          var response = {
            status: 200,
            message: "Registration success",
            data: userdata,
          };
          return res.status(200).send(response);
        } else {
          var response = {
            status: 201,
            message: "Registration failed",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "Email or mobileNumber already exist",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "email and password and phoneNumber not be empty value !",
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

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (email != "" && password != "") {
      console.log('email...',email)
      var userRes = await users.findOne({ email: email });
      if (userRes) {
        if (validation.comparePassword(userRes.password, password)) {
          const token = validation.generateUserToken(
            userRes.email,
            userRes._id,
            1,
            userRes.name,
            "logged"
          );
          const userData = await users.findOne(
            { _id: userRes._id },
            {
              password: 0,
              signup_mode: 0,
              accesstoken: 0,
              accesstoken: 0,
              facebook_id: 0,
              google_id: 0,
            }
          );
          var response = {
            status: 200,
            message: "Login Success",
            data: userData,
            imgbase_url: process.env.BASE_URL + "/profile",
            token: token,
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

async function forgotPasswordUser(req, res) {
  try {
    if (req.body.email != "") {
      var userRes = await users.findOne({ email: req.body.email });
      if (userRes) {
        //const newotp = await helper.getRandomInt(4);
        const newotp = 1111;
        users.findByIdAndUpdate(
          { _id: userRes._id },
          { $set: { otp: newotp } },
          { new: true },
          function (err, docs) {
            if (err) {
              var response = {
                status: 201,
                message: "OTP send failed",
              };
              return res.status(201).send(response);
            } else {
              helper.sendemails(userRes.email, userRes.name, newotp, 1);
              var response = {
                status: 200,
                message: "OTP send success",
              };
              return res.status(200).send(response);
            }
          }
        );
      } else {
        var response = {
          status: 201,
          message: "Email not exist ",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "Email can not be empty !",
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

async function updatePassword(req, res) {
  try {
    if (req.body.email != "" && req.body.otp != "" && req.body.password != "") {
      var new_password = req.body.password;
      var userRes = await users.findOne({
        email: req.body.email,
        otp: req.body.otp,
      });
      if (userRes) {
        const hashedPassword = validation.hashPassword(new_password);
        const data = {
          password: hashedPassword,
          otp: 0,
        };
        users.findByIdAndUpdate(
          { _id: userRes._id },
          { $set: { password: hashedPassword, otp: 0 } },
          { new: true },
          function (err, docs) {
            if (err) {
              var response = {
                status: 201,
                message: "Password change failed",
              };
              return res.status(201).send(response);
            } else {
              var response = {
                status: 200,
                message: "Password change success",
              };
              return res.status(200).send(response);
            }
          }
        );
      } else {
        var response = {
          status: 201,
          message: "Enter right OTP",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "value can not be empty value !",
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

async function userVerify(req, res) {
  try {
    const user_id = req["user_id"];
    const type = req["type"];
    if (user_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "User is un-authorised !",
      };
      return res.status(401).send(response);
    }
    if (req.body.otp != "") {
      var resUser = await user.findOne({ _id: user_id, otp: req.body.otp });
      if (resUser) {
        const data = {
          verified: 1,
          status: 1,
          otp: "",
        };
        user.findByIdAndUpdate(
          { _id: user_id },
          { $set: { verified: 1, status: 1, otp: "" } },
          { new: true },
          async function (err, docs) {
            if (err) {
              var response = {
                status: 201,
                message: "User verified failed",
              };
              return res.status(201).send(response);
            } else {
              const userRes = await user.findOne(
                { _id: user_id },
                {
                  password: 0,
                  signup_mode: 0,
                  accesstoken: 0,
                  accesstoken: 0,
                  facebook_id: 0,
                  google_id: 0,
                }
              );
              const token = validation.generateUserToken(
                userRes.email,
                userRes._id,
                1,
                userRes.name,
                "logged"
              );
              userRes.token = token;
              var response = {
                status: 200,
                message: "User verified successfully",
                data: userRes,
                token: token,
                imgbase_url: process.env.BASE_URL + "/profile",
              };
              return res.status(200).send(response);
            }
          }
        );
      } else {
        var response = {
          status: 201,
          message: "OTP not match ",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message: "OTP can not be empty value ! ",
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

async function changePassword(req, res) {
  try {
    const user_id = req["user_id"];
    const type = req["type"];
    if (user_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "User is un-authorised !",
      };
      return res.status(401).send(response);
    }
    if (
      req.body.old_password != "" &&
      req.body.new_password != "" &&
      req.body.user_id != ""
    ) {
      var old_password = req.body.old_password;
      var new_password = req.body.new_password;
      var userRes = await user.findOne({ _id: user_id });
      if (userRes) {
        if (validation.comparePassword(userRes.password, old_password)) {
          const hashedPassword = validation.hashPassword(new_password);
          users.findByIdAndUpdate(
            { _id: user_id },
            { $set: { password: hashedPassword } },
            { new: true },
            async function (err, docs) {
              if (err) {
                var response = {
                  status: 201,
                  message: "Password change failed",
                };
                return res.status(201).send(response);
              } else {
                var response = {
                  status: 200,
                  message: "Password change successfully",
                };
                return res.status(200).send(response);
              }
            }
          );
        } else {
          var response = {
            status: 201,
            message: "Old password wrong",
          };
          return res.status(201).send(response);
        }
      } else {
        var response = {
          status: 201,
          message: "user not Available",
        };
        return res.status(201).send(response);
      }
    } else {
      var response = {
        status: 201,
        message:
          "Userid, new password and old password can not be empty value !",
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

async function getUserProfile(req, res) {
  try {
    const user_id = req["user_id"];
    const type = req["type"];
    if (user_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "User is un-authorised !",
      };
      return res.status(401).send(response);
    }
    var userRes = await user.findOne(
      { _id: user_id },
      {
        password: 0,
        signup_mode: 0,
        accesstoken: 0,
        accesstoken: 0,
        facebook_id: 0,
        google_id: 0,
      }
    );   
    if (userRes) {
      userRes.token = req.headers["token"];
      var response = {
        status: 200,
        message: "Success",
        data: userRes,
        imgbase_url: process.env.BASE_URL + "/profile",
      };
      return res.status(200).send(response);
    } else {
      var response = {
        status: 201,
        message: " User not exist",
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

async function userSocialSiteLogin(req, res) {
  const { name, email, signup_mode, social_id, accesstoken } = req.body;

  if (
    validation.empty(signup_mode) ||
    validation.empty(social_id) ||
    validation.empty(accesstoken) ||
    validation.empty(email)
  ) {
    response = {
      status: 201,
      message: "validation failed",
    };
    return res.status(201).send(response);
  }
  try {
    if (signup_mode == 1) {
      var signinUser = await user.findOne({ email: email });
      var facebook_id = social_id;
      var google_id = "";
    } else if (signup_mode == 2) {
      var signinUser = await user.findOne({ email: email });
      var google_id = social_id;
      var facebook_id = "";
    } else {
      response = {
        status: 201,
        message: "select signup mode",
      };
      return res.status(201).send(response);
    }

    if (signinUser) {
      //Login user
      const user_id = signinUser._id;
      var valuesUpdate = {
        accesstoken: accesstoken,
        google_id: google_id,
        facebook_id: facebook_id,
        signup_mode: signup_mode,
      };

      const token = validation.generateUserToken(
        signinUser.email,
        signinUser._id,
        1,
        signinUser.name,
        "logged"
      );
      user.findByIdAndUpdate(
        { _id: user_id },
        { $set: valuesUpdate },
        { new: true },
        async function (err, docs) {
          if (err) {
            var response = {
              status: 201,
              message: "Login failed",
            };
            return res.status(201).send(response);
          } else {
            if (signup_mode == 1) {
              var userRes = await user.findOne(
                { facebook_id: facebook_id },
                { password: 0 }
              );
            } else if (signup_mode == 2) {
              var userRes = await user.findOne(
                { google_id: google_id },
                { password: 0 }
              );
            }

            var response = {
              status: 200,
              message: "Login successfully",
              data: userRes,
              imgbase_url: process.env.BASE_URL + "/profile",
              token: token,
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      //signUp

      var emailCheck = await user.findOne({ email: email });
      if (emailCheck.length > 0) {
        response = {
          status: 201,
          message: "Email already exist",
        };
        return res.status(201).send(response);
      } else {
        const userValues = {
          email: email,
          name: name,
          signup_mode: signup_mode,
          device_type: device_type,
          device_token: device_token,
          accesstoken: accesstoken,
          google_id: google_id,
          facebook_id: facebook_id,
          verified: 1,
        };
        const userCreate = await user.create(userValues);
        var signinUser = await user.findOne(
          { _id: userCreate._id },
          { password: 0 }
        );
        if (userCreate) {
          const token = validation.generateUserToken(
            signinUser.email,
            signinUser._id,
            1,
            signinUser.name,
            "logged"
          );
          var userData = signinUser;
          response = {
            status: 200,
            message: "Registration successfully",
            data: userData,
            token: token,
            imgbase_url: process.env.BASE_URL + "/profile",
          };
          return res.status(200).send(response);
        } else {
          response = {
            status: 201,
            message: "Registration failed",
          };
          return res.status(201).send(response);
        }
      }
    }
  } catch (error) {
    console.log("error: ", error);

    response = {
      status: 201,
      message: "Operation was not successful",
    };
    return res.status(201).send(response);
  }
}

async function editProfileUser(req, res) {
  try {

  //   const { error, value } = userUpdateSchema.validate(req.body);

  //   if (error) {
  //     return res.status(400).send(error.details);
  //  } else {
  //     console.log(value);
  //  }
    const user_id = req["user_id"];
    const type = req["type"];
    if (user_id == null || type == 2 || type == 3) {
      var response = {
        status: 401,
        message: "User is un-authorised ! please login",
      };
      return res.status(401).send(response);
    }
    const {
      name,
      city,
      phone,
      pin_code,
      profile_image,
       
      shippingAddress
    } = req.body;
      console.log('re.body..',shippingAddress)
     
    const userRes = await users.findOne({ _id: user_id });
    // if (
    //   req.files.profile_image == undefined ||
    //   req.files.profile_image == null ||
    //   req.files.profile_image == ""
    // ) {
    //   var profileimg = userRes.profile_image;
    // } else {
    //   var profileimg = req.files.profile_image[0].filename;
    // }
    if (userRes) {
      const data = {
        name: name,
        pin_code: pin_code,
        city: city,
        phone: phone,
        profile_img: profile_image,
        
      
        shippingAddress:shippingAddress,
        billingAddress:shippingAddress

      };
      users.findByIdAndUpdate(
        { _id: user_id },
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
            const userData = await users.findOne(
              { _id: user_id },
              {
                password: 0,
                signup_mode: 0,
                accesstoken: 0,
                accesstoken: 0,
                facebook_id: 0,
                google_id: 0,
              }
            );
            var response = {
              status: 200,
              message: "Profile updated successfully",
              data: userData,
              imgbase_url: process.env.BASE_URL + "/profile",
            };
            return res.status(200).send(response);
          }
        }
      );
    } else {
      var response = {
        status: 201,
        message: "user not Available",
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
  userRegistration,
  userLogin,
  forgotPasswordUser,
  updatePassword,
  userVerify,
  changePassword,
  editProfileUser,
  getUserProfile,
  userSocialSiteLogin,
};
