const { deliveryboy } = require("../models/deliveryboy_model");
const assignDeliveryBoy = async (storeId) => {
  try {
     const deliveryBoys  = await deliveryboy.find({
      store_id: storeId,
     });

    if (deliveryBoys.length === 0) {
      return null;
    }
    const assignedDeliveryBoy = deliveryBoys[Math.floor(Math.random() * deliveryBoys.length)];

   

    return assignedDeliveryBoy
   } catch (e) {

    return e

  }
};
module.exports = {
  assignDeliveryBoy,
};
