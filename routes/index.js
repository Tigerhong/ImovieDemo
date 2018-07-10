var express = require('express');
var router = express.Router();
var underscore = require("underscore");// _.extend用新对象里的字段替换老的字段

var Movie =  require("../mongodb/models/movie");// 载入mongoose编译后的模型movie
var User =  require("../mongodb/models/user");// 载入mongoose编译后的模型movie

/* index page项目的首页 */
router.get('/', function (req, res, next) {
    console.log("user in session")
    console.log(req.session.user)
    //会话持久在这里处理的话只有在这个界面会这样，其他界面没有设置session.user
    // var _user = req.session.user;
    // if (_user){
    //     app.locals.user=_user
    // }
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies,
        });
    })

});
/* details page. 电影详情界面*/
router.get('/movie/:id', function (req, res, next) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render('details', {
            title: 'imooc 详情页' + movie.title,
            movie: movie
        });
    })
});
/* admin page. 后台录入展示页面*/
router.get('/admin', function (req, res, next) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            doctor: "",
            country: "",
            title: "",
            year: "",
            poster: "",
            language: "",
            flash: "",
            summary: "",
        }
    });
});
//admin update movie 后台更新页
router.get("/admin/update/:id", function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err){
                console.log(err)
            }
            res.render('admin', {
                title: "imooc 后台更新页面",
                movie: movie
            })
        })
    }else{
        console.log("后台更新页id不存在")
    }
})
//admin post movie 后台录入页
router.post("/admin/movie/new", function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie
    var _movie
    if (id !== "undefined") {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = underscore.extend(movie, movieObj) // 用新对象里的字段替换老的字段
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
        })
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            console.log("电影信息录入成功")
            res.redirect('/movie/' + movie._id);
        })
    }
})
// list delete movie data 列表页删除电影
router.delete('/list/deleteMovie',function (req,res) {
    var id = req.query.id;
    if (id){
        Movie.remove({_id:id},function (err, movie) {
            if (err){
                console.log(err)
            } else{
                res.json({success:1})
            }
        })
    }

})
/* list page. 后台电影列表界面*/
router.get('/list', function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        });
    })
});
//signup注册请求
router.post('/user/signup',function (req,res) {
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
})
//signin登录请求
router.post('/user/signin',function (req,res) {
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
})
/* 后台用户list界面. */
router.get('/admin/userlist', function (req, res, next) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err)
        }
        res.render('userlist', {
            title: 'imooc 用户列表页',
            users: users
        });
    })
});
//登出
router.get("/logout",function (req,res) {
    delete req.session.user
    delete  localApp.locals.user
    res.redirect('/')
})

var localApp;
module.exports = function (app) {
    localApp=app;
    //pre hande session 会话持久逻辑预处理
    app.use(function (req, res, next) {
        var _user = req.session.user;
        if (_user){
            app.locals.user=_user
        }
        next()
    })
    return router;
};
