var validation = require('../helper/validation');
var helper = require('../helper/helper');
require('dotenv').config();
const { coupon } = require('../models/coupon_model');
const employee = require('../models/employee_model');

async function addcoupon(req, res) { // created by  store or vendor
    try {
        const emp_id = req['user_id'];
        const usertype = req['type'];
        if (emp_id == null || usertype == 1 || usertype == 3) {
            var response = {
                status: 401,
                message: 'employee  is un-authorised !'

            };
            return res.status(401).send(response);
        }
        const { coupon_code, start_date, end_date, discount_amount,repeat_usage } = req.body;
        if (coupon_code!= '' || coupon_code!=undefined) {
            const empdetail = await employee.findOne({_id:emp_id});
            const couponCheck = await coupon.findOne({ coupon_code: coupon_code });
            if (!couponCheck) {
                const data = {
                    coupon_code: coupon_code,
                    start_date: start_date,
                    end_date: end_date,
                    discount_amount: discount_amount,
                    store_id: empdetail.store_id,
                    repeat_usage:repeat_usage,
                    employee_id:emp_id,
                };
                const couponResponse = await coupon.create(data);
                if (couponResponse) {
                    var response = {
                        status: 200,
                        message: 'coupon added successfully',
                        data: couponResponse,
                    };
                    return res.status(200).send(response);
                } else {
                    var response = {
                        status: 201,
                        message: 'Unable to add coupon',

                    };
                    return res.status(201).send(response);
                }
            } else {

                var response = {
                    status: 201,
                    message: 'coupon code already exist',
                };
                return res.status(201).send(response);
            }
        } else {
            var response = {
                status: 201,
                message: 'coupon code can not be empty',
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

async function editcoupon(req, res) {   // created by  store
    try {
        const emp_id = req['user_id'];
        const usertype = req['type'];
        if (emp_id == null || usertype == 1 || usertype == 3) {
            var response = {
                status: 401,
                message: 'employee  is un-authorised !'

            };
            return res.status(401).send(response);
        }
        const {coupon_code, start_date, end_date, discount_amount,repeat_usage,coupon_id } = req.body;
        if (coupon_code) {
            const data = {
                coupon_code: coupon_code,
                start_date: start_date,
                end_date: end_date,
                discount_amount: discount_amount,
                repeat_usage:repeat_usage,
            };
            coupon.findByIdAndUpdate({ _id: coupon_id },
                { $set: data },
                { new: true },
                async function (err, docs) {
                    if (err) {
                        var response = {
                            status: 201,
                            message: 'coupon Updated failed',
                        };
                        return res.status(201).send(response);
                    }
                    else {
                        const couponData = await coupon.findOne({ _id: coupon_id });
                        var response = {
                            status: 200,
                            message: 'coupon updated successfully',
                            data: couponData,
                          
                        };
                        return res.status(200).send(response);
                    }
                });
        } else {
            var response = {
                status: 201,
                message: 'coupon code not be empty',
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

async function deletecoupon(req, res) {   //  created by  store
    try {
        const emp_id = req['user_id'];
        const type = req['type'];
        if (emp_id == null || type == 1 || type == 3) {
            var response = {
                status: 401,
                message: 'employee  is un-authorised !'

            };
            return res.status(401).send(response);
        }
        const { coupon_id } = req.body;
        const couponRes = await coupon.findOne({ _id: coupon_id });
        if (couponRes) {
            coupon.findByIdAndDelete({ _id: coupon_id },
                async function (err, docs) {
                    if (err) {
                        var response = {
                            status: 201,
                            message: 'coupon delete failed'
                        };
                        return res.status(201).send(response);
                    }
                    else {
                        var response = {
                            status: 200,
                            message: 'coupon deleted successfully',
                        };
                        return res.status(200).send(response);
                    }
                });
        } else {
            var response = {
                status: 201,
                message: 'coupon not Available',
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

async function couponList(req, res) {
    try {

        const emp_id = req['user_id'];
        const type = req['type'];
        // if (emp_id == null || type == 1 || type == 3) {
        //     var response = {
        //         status: 401,
        //         message: 'employee  is un-authorised !'

        //     };
        //     return res.status(401).send(response);
        // }
        if(emp_id==null)
        var coupondata = await coupon.find();
        else
        var coupondata = await coupon.find({ employee_id: emp_id });
        var response = {
            status: 200,
            message: 'success',
            data: coupondata,
        };
        return res.status(200).send(response);

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
    addcoupon,
    editcoupon,
    deletecoupon,
    couponList,
};