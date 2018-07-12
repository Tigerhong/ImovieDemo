var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function (app) {
    //pre hande session 会话持久逻辑预处理
    app.use(function (req, res, next) {
        var _user = req.session.user;

        app.locals.user = _user

        next()
    })
    //Index
    app.get('/', Index.index);//index page项目的首页

    //User
    app.post('/user/signup', User.singup)//signup注册请求
    app.post('/user/signin', User.singin)//signin登录请求
    app.get("/signup", User.showSignup)//登出展示页面
    app.get("/signin", User.showSignin)//登入展示页面
    app.get("/logout", User.logout)//登出
    app.get('/admin/user/list', User.signinRequired,User.adminRequired,User.list);//后台用户list界面.

    //Movie
    app.get('/movie/:id', Movie.details);//details page. 电影详情界面
    app.get('/admin/movie',User.signinRequired,User.adminRequired, Movie.admin);//admin page. 后台录入展示页面
    app.get("/admin/movie/update/:id",User.signinRequired,User.adminRequired, Movie.update)//admin update movie 后台更新页
    app.post("/admin/movie/movie/new", User.signinRequired,User.adminRequired,Movie.new)//admin post movie 后台录入请求
    app.delete('/admin/movie/list/deleteMovie', User.signinRequired,User.adminRequired,Movie.del)// list delete movie data 后台录入list删除请求
    app.get('/admin/movie/list', User.signinRequired,User.adminRequired,Movie.list);//list page. 后台电影列表界面

    //Comment
    app.post('/user/comment', User.signinRequired,Comment.save)

    //Category
    app.get('/admin/category', User.signinRequired,User.adminRequired,Category.adminCategory)//后台，电影分类录入
    app.get('/admin/category/list', User.signinRequired,User.adminRequired,Category.adminCategoryList)//后台，电影分类列表界面
    app.post('/admin/category/new', User.signinRequired,User.adminRequired,Category.save)//后台，电影分类录入请求
};
