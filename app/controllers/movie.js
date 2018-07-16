var underscore = require("underscore");// _.extend用新对象里的字段替换老的字段
var Movie = require("../mongodb/models/movie");// 载入mongoose编译后的模型movie
var Comment = require("../mongodb/models/comment");
var Category = require("../mongodb/models/category");
var multer  = require('multer')
var fs = require('fs');
var path = require('path');
/**
 * details page. 电影详情界面
 * @param req
 * @param res
 * @param next
 */
exports.details = function (req, res, next) {
    var id = req.params.id;
    Movie.update({_id:id},{$inc:{pv:1}},function (err) {
        if (err) {
            console.log(err)
        }
    })
    //todo:第一种方式movie user各种查询
    //现在使用另外一种，简单的callback的嵌套查询，这样不怎么好
    Movie.findById(id, function (err, movie) {
        Comment.find({movie: id})
            .populate("from","name")//将谁回复的名字查询出来
            .populate("reply.from reply.to","name")//将子评论中谁回复的和回复给谁的名字查询出来
            .exec( function (err,comments) {
            console.log(comments)
            res.render('details', {
                title: 'imooc 详情页' + movie.title,
                movie: movie,
                comments:comments
            });
        })
    })
}
/**
 * admin page. 后台录入展示页面
 * @param req
 * @param res
 * @param next
 */
exports.admin = function (req, res, next) {
    Category.fetch(function (err,categories) {
        if (err)console.log(err)
        res.render('admin/movie/admin', {
            title: 'imooc 后台录入页',
            movie: {},
            categories:categories
        });
    })
}
/**
 * admin update movie 后台更新页
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {console.log(err) }
            Category.fetch(function (err,categories) {
                if (err)console.log(err)
                res.render('admin/movie/admin', {
                    title: 'imooc 后台更新页面',
                    movie: movie,
                    categories:categories
                });
            })
        })
    } else {
        console.log("后台更新页id不存在")
    }
}
exports.uploadPoster=function(req,res,next){
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname,'../../','/public/upload/'))
        },
        filename: function (req, file, cb) {
            var type = file.mimetype.split('/')[1];
            cb(null,   Date.now()+ '.' +type)
        }
    })
    var upload = multer({ storage: storage })

    var singleFileUpload=upload.single('uploadPoster');
    singleFileUpload(req, res, function(err){
        if (err) {
            next()
            return  console.log(err);
        }
        //由于设置了enctype='multipart/form-data'
        // ，我们在save方法里取req.body是取不到值的
        // ，这里使用multer的req.body能获取文本域的值
        // ，将multer里的req.body赋给当前的req.body，并next传给save方法
        req.body = req.body;
        console.log(req.file);
        if (req.file){
            req.poster=req.file.filename;
        }
        next()
    });
}
/**
 * admin post movie 后台录入页
 * @param req
 * @param res
 */
exports.new = function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie
    var _movie
    if (req.poster){
        movieObj.poster=req.poster
    }
    if (id) {
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
        _movie = new Movie(movieObj)
        var categoryId = movieObj.category
        var categoryName = movieObj.categoryName
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            if(categoryId){
                //优先保存电影分类选择
                Category.findById(categoryId,function (e, category) {
                    if (err) {
                        console.log(err);
                    }
                    category.movies.push(movie._id)
                    category.save(function (e, category) {
                        console.log("电影信息录入成功")
                        res.redirect('/movie/' + movie._id);
                    })
                })
            }else if(categoryName){
                //没有选择电影分类，则看下有没有自定义分类
                var category=new Category({
                    name:categoryName,
                    movies:[movie._id]
                })
                category.save(function (e, category) {
                    movie.category=category._id;
                    movie.save(function (e, movie) {
                        console.log("电影信息录入成功")
                        res.redirect('/movie/' + movie._id);
                    })
                })
            }else{
                res.redirect('/movie/' + movie._id);
            }
        })
    }
}
/**
 * list delete movie data 列表页删除电影
 * @param req
 * @param res
 */
exports.del = function (req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({success: 1})
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
exports.list = function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }
        res.render('admin/movie/list', {
            title: 'imooc 列表页',
            movies: movies
        });
    })
}