var mongoose = require('mongoose');

var MovieSchema=new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    post:String,
    year:Number,
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
MovieSchema.statics={
    fetch:function (cb) {
        return this
            .find({})
            .sort("meta.updateAt")
            .exec(cb)
    },
    findById:function (id, cb) {
        return this
            .findOne({_id:id})
            .exec(cb)
    }
}
module.exports=MovieSchema
//定义模式