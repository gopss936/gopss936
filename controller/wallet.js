var validation = require('../helper/validation');
var helper = require('../helper/helper');
require('dotenv').config();
const  wallet  = require('../models/wallet_model');
const users = require('../models/user_model');

async function addMoneyWallet(req, res) { 
    try {
        const user_id = req['user_id'];
        const usertype = req['type'];
        if (user_id == 1  || usertype == 3) {
            var response = {
                status: 401,
                message: 'employee is un-authorised !'

            };
            return res.status(401).send(response);
        }
        const {customer_id,type,amount,message} = req.body;
        if (amount!='') 
        {
            const data = {
                customer_id: customer_id,
                created_by:user_id,
                amount:amount,
                message:message,
                type:type,
            };
            const walletResponse = await wallet.create(data);
            if (walletResponse)
            {
                const userResult =  await users.findOne({ _id:customer_id});
                const userData  = await  users.findByIdAndUpdate({ _id:customer_id},
                    { $set: { wallet_amount: parseFloat(userResult.wallet_amount)+ parseFloat(amount)}});
                var response = {
                    status: 200,
                    message: 'Amount added in wallet successfully',
                    data: walletResponse,
                };
                return res.status(200).send(response);
            } else {
                var response = {
                    status: 201,
                    message: 'Unable to add amount in wallet ',

                };
                return res.status(201).send(response);
            }
        } else {
            var response = {
                status: 201,
                message: 'amount can not be empty',
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
    addMoneyWallet,
};