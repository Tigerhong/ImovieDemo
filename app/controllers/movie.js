var underscore = require("underscore");// _.extend用新对象里的字段替换老的字段
var Movie =  require("../mongodb/models/movie");// 载入mongoose编译后的模型movie
/**
 * details page. 电影详情界面
 * @param req
 * @param res
 * @param next
 */
exports.details= function (req, res, next) {
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render('details', {
            title: 'imooc 详情页' + movie.title,
            movie: movie
        });
    })
}
/**
 * admin page. 后台录入展示页面
 * @param req
 * @param res
 * @param next
 */
exports.admin= function (req, res, next) {
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
}
/**
 * admin update movie 后台更新页
 * @param req
 * @param res
 */
exports.update= function (req, res) {
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
}
/**
 * admin post movie 后台录入页
 * @param req
 * @param res
 */
exports.new=function (req, res) {
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
}
/**
 * list delete movie data 列表页删除电影
 * @param req
 * @param res
 */
exports.del=function (req,res) {
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

}
/**
 * list page. 后台电影列表界面
 * @param req
 * @param res
 * @param next
 */
exports.list=function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        });
    })
}