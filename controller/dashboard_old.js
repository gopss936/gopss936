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

      var employeedetail = await employee.findOne({ _id: emp_id });
    console.log('employeedetail..........',employeedetail.store_id)
    var employeeStores = await employee.find(
      { store_id: employeedetail.store_id },
      
    );   
    
    const store_filter = {
      store_id:employeeStores[0].store_id
     };
    const employeeCount= await employee.countDocuments(store_filter )
    const constcategoryCount = await category.countDocuments()

    const subCategoryCount = await subCategory.countDocuments()
    const orderCount = await order.countDocuments() 
    const productCount = await product.countDocuments()
     res.status(200).json({
      status: 200,
  
      data:  {
             employeeCount:employeeCount,
             constcategoryCount:constcategoryCount,
             subCategoryCount:subCategoryCount,
             orderCount:orderCount,
             productCount:productCount
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
