var mongoose = require("mongoose");
var MovieSchema = require("../schemas/movie.js");//引入'../schemas/movie.js'导出的模式模块

// 编译生成movie模型
var Movie = mongoose.model("Movie",MovieSchema);

// 将movie模型[构造函数]导出
module.exports=Movie
//编译好模型