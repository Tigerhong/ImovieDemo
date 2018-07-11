var Movie =  require("../mongodb/models/movie");// 载入mongoose编译后的模型movie
/* index page项目的首页 */
exports.index= function (req, res, next) {
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
}