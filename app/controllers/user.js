var User =  require("../mongodb/models/user");// 载入mongoose编译后的模型movie
/**
 * signup注册请求
 * @param req
 * @param res
 */
exports.singup= function (req,res) {
        var _user= req.body.user;
        // console.log("请求过来的参数"+_user)
        // req.param('user')//这样获取也能获取到user这个json对象
        User.find({name:_user.name},function (err, user) {
            //判断该名字是否有注册过
            if (err){
                console.log(err)
            }
            if (user.length){
                //已经注册
                return res.redirect("/")
            } else {
                //没有注册
                var user=new User(_user);
                user.save(function (err,user) {
                    if (err){
                        console.log(err)
                        return;
                    }
                    console.log("注册成功")
                    res.redirect("/admin/userlist")
                })
            }
        })
    }
/**
 * signin登录请求
 * @param req
 * @param res
 */
exports.singin=function (req,res) {
    var _user= req.body.user;
    var name = _user.name;
    var password = _user.password;
    // console.log("请求过来的参数"+_user)
    User.findOne({name:_user.name},function (err, user) {
        //判断该名字是否有注册过
        if (err){
            console.log(err)
        }
        if (!user){
            //已经存在
            return res.redirect("/")
        }
        user.comparePassword(password,function (err, isMatch) {
            if (err){
                console.log(err)
            }
            if (isMatch){
                //登录成功
                console.log("登录成功")
                req.session.user=user
                return res.redirect("/")
            } else{
                console.log("登录失败.password is not matched")
            }
        })
    })
}
/**
 * 后台用户list界面.
 * @param req
 * @param res
 * @param next
 */
exports.list=function (req, res, next) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        });
    })
}
/**
 * 登出
 * @param req
 * @param res
 */
exports.logout=function (req,res) {
    delete req.session.user
    // delete  app.locals.user
    res.redirect('/')
}