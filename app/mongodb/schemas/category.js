var mongoose = require('mongoose');
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId;

var CategorySchema=new Schema({
    name:String,
    movies:[{
        type:ObjectId,ref:'Movie'
    }],
    meta:{
        crateAt:{
            type:Date,
            default:Date.now()
        },
        updatAt:{
            type:Date,
            default:Date.now()
        }
    },
})

CategorySchema.pre("save",function (next) {
    //每次使用save前都会执行这个监听方法
    if (this.isNew){
        this.meta.createAt=this.meta.updatAt=Date.now()
    }else{
        this.meta.updatAt=Date.now()
    }
    next();
})

CategorySchema.statics={
    fetch:function (cb) {
        return this
            .find({})
            .sort("meta.updateAt")//排序方式，根据创建的时间来排序
            .exec(cb)
    },
    findById:function (id, cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}
module.exports=CategorySchema
//定义模式