var User =  require("../mongodb/models/user");// 载入mongoose编译后的模型movie
var path = require('path');
var multer = require('multer')
/**
 *用户信息详情界面
 * @param req
 * @param res
 */
exports.details=function (req, res) {
    var id = req.params.id;
    User.findById(id,function (e, user) {
        res.render('admin/user/admin',{
            title:'用户信息',
            isReadable:true,
            user,user
        })
    })
}
/**
 * 用户头像的保存请求
 * @param req
 * @param res
 * @param next
 */
exports.postHeadPic=function (req, res,next) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../../', '/public/upload/headPic'))
        },
        filename: function (req, file, cb) {
            var type = file.mimetype.split('/')[1];
            cb(null, Date.now() + '.' + type)
        }
    })
    var upload = multer({storage: storage})

    var singleFileUpload = upload.single('uploadPoster');
    singleFileUpload(req, res, function (err) {
        if (err) {
            next()
            return console.log(err);
        }
        //由于设置了enctype='multipart/form-data'
        // ，我们在save方法里取req.body是取不到值的
        // ，这里使用multer的req.body能获取文本域的值
        // ，将multer里的req.body赋给当前的req.body，并next传给save方法
        req.body = req.body;
        console.log("用户保存的头像:",req.file);
        if (req.file) {
            req.headPicUrl = req.file.filename;
        }
        next()
    });
}
/**
 * 用户信息保存请求
 * @param req
 * @param res
 */
exports.save=function (req, res) {
    var id = req.body.user._id;
    var userObject=req.body.user
    if (req.headPicUrl) {
        userObject.headPicUrl = req.headPicUrl
    }
    User.findById(id,function (err, user) {
       var _user = Object.assign(user, userObject);
        _user.save(function (e, user) {
            if (e)console.log(e)
            req.session.user=user
            res.redirect('/admin/user')
        })
    })
}
/**
 * 用户录入界面
 * @param req
 * @param res
 */
exports.admin=function (req, res) {
    res.render('admin/user/admin',{
        title:'用户信息'
    })
}
/**
 * 访问注册界面
 * @param req
 * @param res
 */
exports.showSignup=function (req, res) {
    res.render('singup',{
        title:'注册界面'
    })
}
/**
 * 访问登录界面
 * @param req
 * @param res
 */
exports.showSignin=function (req, res) {
    res.render('singin',{
        title:'登录界面'
    })
}

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
                return res.redirect("/signin")
            } else {
                //没有注册
                var user=new User(_user);
                user.save(function (err,user) {
                    if (err){
                        console.log(err)
                    }
                    console.log("注册成功")
                    res.redirect("/")
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
            return res.redirect("/signup")
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
                return res.redirect("/signin")
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
        res.render('admin/user/userlist', {
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
/**
 * 是否有登录过的检验
 * @param req
 * @param res
 * @param next
 */
exports.signinRequired=function (req, res, next) {
    var user = req.session.user;
    if (!user){
       return res.redirect('/signin')
    }
    next();
}
/**
 * 是否有访问后台的权限检验
 * @param req
 * @param res
 * @param next
 */
exports.adminRequired=function (req, res, next) {
    var user = req.session.user;
    if (user.role<=10){
        return  res.redirect('/signin')
    }
    //只有role>10以上的才有权限访问后台的界面
    next();
}