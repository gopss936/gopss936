var validation = require('../helper/validation');
const helper = require('../helper/helper');

function tokenGenrate(req, res) {
  
    const id = helper.getRandomInt(2);
    try {
    const token = validation.generateUserToken('info@eccomerce.com', id, helper.currentdate(), 'ecommerce');
      // successMessage.token = token;
      var response = {
        status : 200,
        token:token,
      };
      res.json(response);
    }
    catch (error) {
      var responseErr = {
        status : 201,
        message:'Operation was not successful',
      };
      res.json(responseErr);
     

    }

};

module.exports = tokenGenrate;