var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Movie = require("../models/movie");
var underscore = require("underscore");
mongoose.connect("mongodb://localhost:27017/imooc")

/* index page项目的首页 */
router.get('/', function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
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
            _movie = underscore.extend(movie, movieObj)
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

module.exports = router;
