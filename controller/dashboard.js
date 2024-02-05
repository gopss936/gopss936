const employee = require("../models/employee_model");
 const { category, subCategory } = require("../models/category_model");
    const {order}=require("../models/order_model");
    const {product} = require("../models/product_model")
var validation = require("../helper/validation");
var helper = require("../helper/helper");

require("dotenv").config();
var moment = require("moment");
 

const  countDetails = async (req,res)=> {
    try{
      const emp_id = req["user_id"];



      const today = new Date();

       const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
       const thisYearStart = new Date(today.getFullYear(), 0, 1);

      


      var employeedetail = await employee.findOne({ _id: emp_id });
     var employeeStores = await employee.find(
      { store_id: employeedetail.store_id },
      
    );   
    
    const store_filter = {
    store_id:employeeStores[0].store_id
     
     };
     console.log('employeeStores[0].store_id..',employeeStores[0].store_id)
    const storeId = employeeStores[0].store_id
    const employeeCount= await employee.countDocuments(store_filter)
    const constcategoryCount = await category.countDocuments(store_filter)
    const subCategoryCount = await subCategory.countDocuments(store_filter)
    const orderCount = await order.countDocuments({ 'order_detail.storeId':employeeStores[0].store_id });

    const todayOrdersCount = await order.countDocuments({
      'order_detail.storeId': employeeStores[0].store_id,
      ordered_on: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    }); 

    const thisMonthOrdersCount = await order.countDocuments({
      'order_detail.storeId': storeId,
      ordered_on: { $gte: thisMonthStart },
    });


    const thisYearOrderCount = await order.countDocuments({
      'order_detail.storeId': storeId,
      ordered_on: { $gte: thisYearStart },
    });


     const productCount = await product.countDocuments(store_filter)
     res.status(200).json({
      status: 200,
  
      data:  {
             employeeCount:employeeCount,
             constcategoryCount:constcategoryCount,
             subCategoryCount:subCategoryCount,
             orderCount:orderCount,
             productCount:productCount,
             todayOrdersCount:todayOrdersCount,
             thisMonthOrdersCount:thisMonthOrdersCount,
             thisYearOrderCount:thisYearOrderCount
            }, 
    });

  

}
catch(err){
    res.status(500).json({
        message: err.message,
        status: 500,
      });
}

}

module.exports = {
  countDetails
}
