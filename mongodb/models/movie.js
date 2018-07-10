
/*  mongoose 简要知识点补充
* mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]和Document[文档]对象，用起来更为方便。
* Schema对象定义文档的结构（类似表结构），可以定义字段和类型、唯一性、索引和验证。
* Model对象表示集合中的所有文档。
* Document对象作为集合中的单个文档的表示。
* mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
* */
var mongoose = require("mongoose");
//写在这里连接数据，不知道会不会每次引用此文件的时候都去连接
mongoose.connect("mongodb://localhost:27017/imooc")//连接数据库
var MovieSchema = require("../schemas/movie.js");//引入'../schemas/movie.js'导出的模式模块

// 编译生成movie模型
var Movie = mongoose.model("Movie",MovieSchema);

// 将movie模型[构造函数]导出
module.exports=Movie
//编译好模型


/*
* 使用mongoose
* 1.先连接数据库
* 2.定义一个Schema
* 3.将该Schema发布为Model
*      1.为此Schema创建方法
* 4.用Model创建Entity
* 5.Entity是具有具体的数据库操作CRUD的
* **/