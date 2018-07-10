var mongoose = require('mongoose');

var MovieSchema=new mongoose.Schema({
    //  定义了一个新的模型
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    // meta 更新或录入数据的时间记录
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
MovieSchema.pre("save",function (next) {
    //每次使用save前都会执行这个监听方法
    if (this.isNew){
        this.meta.createAt=this.meta.updatAt=Date.now()
    }else{
        this.meta.updatAt=Date.now()
    }
    next();
})
// 为MovieSchema 模式的扩展一些静态方法
MovieSchema.statics={
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
// 导出movieSchema模式
module.exports=MovieSchema
//定义模式