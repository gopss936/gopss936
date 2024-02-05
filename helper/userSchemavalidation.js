const Joi = require("joi");

// Define a schema for input validation
const userUpdateSchema = Joi.object({
   name: Joi.allow("").optional(),
  city: Joi.string().allow("").optional(),
  phone: Joi.string().allow("").optional(),
  pin_code:Joi.string().allow("").optional(),
  profile_image: Joi.string().allow("").optional(),
  city: Joi.string().allow("").optional(),
  city: Joi.string().allow("").optional(),
  city: Joi.string().allow("").optional(),

  

  shippingAddress: Joi.required(),
  phone: Joi.string().allow("").optional(),
});

module.exports = {
  userUpdateSchema
}
