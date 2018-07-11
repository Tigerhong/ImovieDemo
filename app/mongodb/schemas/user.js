var mongoose = require('mongoose');
//慕课网的老师用的是bcrypt，在windows中一直是安装不了
//所以就使用bcrypt-nodejs代替
var bcryptNodejs= require('bcrypt-nodejs')
let SALT_WORK_FACTOR=10;
var UserSchema=new mongoose.Schema({
    //  定义了一个新的模型
    name:{
        unique:true,//必要的，唯一的
        type:String
    },
    password:String,
    // 0 : normal user
    // 1 : verified user
    // 2 : professonal user

    //  >10 : admin
    //  >50 : superadmin
    role:{
        type:Number,
        default:0
    },
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
UserSchema.pre("save",function (next) {
    var user = this
    //每次使用save前都会执行这个监听方法
    if (this.isNew){
        this.meta.createAt=this.meta.updatAt=Date.now()
    }else{
        this.meta.updatAt=Date.now()
    }

    // bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    //     if (err) return next(err)
    //
    //     bcrypt.hash(user.password, salt, function(err, hash) {
    //         if (err) return next(err)
    //
    //         user.password = hash
    //         next()
    //     })
    // })
    var hash = bcryptNodejs.hashSync(this.password);
    this.password = hash; // 注意：这里是同步执行的
    next();
})
UserSchema.methods = {
    /**
     * 密码校验
     * @param _password
     * @param cb
     */
    comparePassword: function(_password, cb) {
        // bcrypt.compare(_password, this.password, function(err, isMatch) {
        //     if (err) return cb(err)
        //
        //     cb(null, isMatch)
        // })
        var hash = this.password;
        try {
            var isMatch = bcryptNodejs.compareSync(_password, hash);
            cb(null, isMatch);
        } catch (e) {
            cb(e);
        }

    }
}
// 为User 模式的扩展一些静态方法
UserSchema.statics={
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
module.exports=UserSchema
//定义模式