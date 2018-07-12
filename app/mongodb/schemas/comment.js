var mongoose = require('mongoose');
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId;

var CommetSchema=new Schema({
    movie:{type:ObjectId,ref:'Movie'},//当前评论对应的电影，即这个评论是哪个电影的
    from:{type:ObjectId,ref:'User'},//这个评论是谁回复的
    content:String,//具体内容
    reply:[{//这个评论下的子评论，针对当前主评论下的多个子评论，与主评论有关联的
        from:{type:ObjectId,ref:'User'},//谁回复
        to:{type:ObjectId,ref:'User'},//回复给谁
        content:String,//具体内容
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

CommetSchema.pre("save",function (next) {
    //每次使用save前都会执行这个监听方法
    if (this.isNew){
        this.meta.createAt=this.meta.updatAt=Date.now()
    }else{
        this.meta.updatAt=Date.now()
    }
    next();
})

CommetSchema.statics={
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
module.exports=CommetSchema
//定义模式