var mongoose = require("mongoose");
var CategorySchema = require("../schemas/category.js");

var Category = mongoose.model("category",CategorySchema);

module.exports=Category
//编译好模型
