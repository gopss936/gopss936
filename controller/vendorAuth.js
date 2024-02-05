var validation = require('../helper/validation');
var helper = require('../helper/helper');
require('dotenv').config();
var moment = require('moment');
const vendor = require('../models/vendor_model');

async function vendorLogin(req, res) {
    try {
        const { email, password } = req.body;
        if (email != '' && password != '') {
            var userRes = await vendor.findOne({ email: email })
            if (userRes) {
                if (validation.comparePassword(userRes.password, password)) {
                    const token = validation.generateUserToken(userRes.email, userRes._id,2, userRes.first_name, 'logged')
                    var response = {
                        status: 200,
                        message: 'Login Success',
                        data: userRes,
                        token:token,
                    };
                    return res.status(200).send(response);

                } else {
                    var response = {
                        status: 201,
                        message: 'Incorrect password',
                    };
                    return res.status(201).send(response);
                }
            } else {
                var response = {
                    status: 201,
                    message: 'Email not exist',
                };
                return res.status(201).send(response);
            }
        } else {
            var response = {
                status: 201,
                message: 'Email and password can not be empty value!',
            };
            return res.status(201).send(response);
        }
    } catch (error) {
        console.log("error", error);
        response = {
            status: 201,
            message: 'Operation was not successful',
        };
        return res.status(201).send(response);
    }
};

module.exports = {
    vendorLogin,
};