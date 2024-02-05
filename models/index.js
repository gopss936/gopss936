const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);
const db ={};
db.mongoose = mongoose;
module.exports = db;

