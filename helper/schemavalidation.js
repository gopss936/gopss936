const Joi = require('joi');

// Define a schema for input validation
const Orderschema = Joi.object({
    total_payable_amount: Joi.allow('').optional(),
    promo_discount: Joi.allow('').required(),
    shipping_address: Joi.allow('').optional(),
    payment_method: Joi.string().allow('').optional(),
    delivery_charges: Joi.required(),
    phone: Joi.string().allow('').optional(),
    sellers: Joi.string().allow('').optional(),
    customer_name: Joi.string().allow('').optional(),
    tax:Joi.string().allow('').optional(),
  });


  const updateCartSchema = Joi.object({
    total_payable_amount: Joi.required(),
    variationId:Joi.string().required(),
    quantity:Joi.number().integer().required(),
  });

   

module.exports ={
  Orderschema,
  updateCartSchema
 
  
}  
