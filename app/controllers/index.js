var Movie = require("../mongodb/models/movie");// 载入mongoose编译后的模型movie
var Category = require("../mongodb/models/category");
/* index page项目的首页 */
exports.index = function (req, res, next) {
    console.log("user in session")
    console.log(req.session.user)
    //会话持久在这里处理的话只有在这个界面会这样，其他界面没有设置session.user
    // var _user = req.session.user;
    // if (_user){
    //     app.locals.user=_user
    // }
    Category
        .find({})
        .populate({
            path: 'movies',
            select: 'title poster',
            options: {limit: 6}
        })
        .exec(function (err, categories) {
            if (err) {
                console.log(err)
            }
            res.render('index', {
                title: 'imooc 首页',
                categories: categories,
            });
        })
}
exports.search = function (req, res, next) {
    var catId = req.query.cat;
    var page = parseInt(req.query.p, 10) || 0
    var count = 2
    var index = page * count
    if (catId) {
        //根据分类id筛选的电影
        Category
            .find({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster',
            })
            .exec(function (err, categories) {
                var category = categories[0] || {}
                var movies = category.movies || []
                var results = movies.slice(index, index + count)

                if (err) {
                    console.log(err)
                }
                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: category.name,
                    query: 'cat=' + catId,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results,
                });
            })
    }else{
        //根据搜索框中的关键字筛选电影
        var q = req.query.q;
        Movie.find({title:new RegExp(q + '.*', 'i')})
            .exec(function (e, movies) {
                if (e) {
                    console.log(e)
                }
                var results = movies.slice(index, index + count)

                res.render('results', {
                    title: 'imooc 结果列表页面',
                    keyword: q,
                    query: 'q=' + q,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count),
                    movies: results,
                });
            })
    }
}