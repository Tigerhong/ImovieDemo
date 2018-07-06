var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Movie = require("../models/movie");
var underscore = require("underscore");
mongoose.connect("mongodb://localhost:27017/imooc")

/* index page. */
router.get('/', function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err){
            console.log(err)
        }
        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        });
    })

});
/* details page. */
router.get('/movie/:id', function (req, res, next) {
    var id = req.params.id;
    Movie.findById(id,function (err, movie) {
        res.render('details', {
            title: 'imooc 详情页'+movie.title,
            movie: movie
        });
    })
});
/* admin page. */
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
//admin update movie
router.get("/admin/movie/:id",function (res, req) {
    var id = req.params.id;
    if (id){
        Movie.findById(id,function (err, movie) {
            res.render('admin',{
                title:"imooc 后台更新页面",
                movie:movie
            })
        })
    }
})
//admin post movie
router.post("/admin/movie/new",function (req,res) {
    var id=req.body.movie._id;
    var movieObj=req.body.movie
    var _movie
    if (id !== "undefined"){
        Movie.findById(id,function (err,movie) {
            if (err) {console.log(err);}
            _movie=underscore.extend(movie,movieObj)
            _movie.save(function (err, movie){
                if (err) {console.log(err);}
                res.redirect('/movie/'+movie._id);
        })
    })
    }else{
        _movie=new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash,
        })
        _movie.save(function (err, movie){
            if (err) {console.log(err);}
            res.redirect('/movie/'+movie._id);
        })
    }
})
/* list page. */
router.get('/list', function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err){
            console.log(err)
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        });
    })
});

module.exports = router;
