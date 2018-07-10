var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/imooc")//连接数据库
var UserSchema = require("../schemas/user.js");

// 编译生成User模型
var User = mongoose.model("User",UserSchema);

// 将User模型[构造函数]导出
module.exports=User
//编译好模型
