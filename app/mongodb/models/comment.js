var mongoose = require("mongoose");
var CommetSchema = require("../schemas/comment.js");

// 编译生成Comment模型
var Commet = mongoose.model("Comment",CommetSchema);

// 将Comment模型[构造函数]导出
module.exports=Commet
//编译好模型
