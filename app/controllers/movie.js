var underscore = require("underscore");// _.extend用新对象里的字段替换老的字段
var Movie = require("../mongodb/models/movie");// 载入mongoose编译后的模型movie
var Comment = require("../mongodb/models/comment");
var Category = require("../mongodb/models/category");
var multer = require('multer')
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
    //点击到电影详情时增加访客统计
    Movie.update({_id: id}, {$inc: {pv: 1}}, function (err) {
        if (err) {
            console.log(err)
        }
    })
    //todo:第一种方式movie user各种查询
    //现在使用另外一种，简单的callback的嵌套查询，这样不怎么好
    Movie.findById(id, function (err, movie) {
        Comment.find({movie: id})
            .populate("from", "name headPicUrl")//将谁回复的名字，头像查询出来
            .populate("reply.from reply.to", "name headPicUrl")//将子评论中谁回复的和回复给谁的名字，头像查询出来
            .exec(function (err, comments) {
                console.log(comments)
                res.render('details', {
                    title: 'imooc 详情页' + movie.title,
                    movie: movie,
                    comments: comments
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
    Category.fetch(function (err, categories) {
        if (err) console.log(err)
        res.render('admin/movie/admin', {
            title: 'imooc 后台录入页',
            movie: {},
            categories: categories
        });
    })
}
/**
 * admin update movie 后台更新页显示
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            Category.fetch(function (err, categories) {
                if (err) console.log(err)
                res.render('admin/movie/admin', {
                    title: 'imooc后台更新页面  >' + movie.title,
                    movie: movie,
                    categories: categories,
                    isUpdate: true
                });
            })
        })
    } else {
        console.log("后台更新页id不存在")
    }
}
exports.uploadPoster = function (req, res, next) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../../', '/public/upload/'))
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
        console.log(req.file);
        if (req.file) {
            req.poster = req.file.filename;
        }
        next()
    });
}

/**
 * admin post movie 后台录入页录入请求
 * @param req
 * @param res
 */
exports.save = function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie
    var _movie
    var categoryId = movieObj.category
    var categoryName = movieObj.categoryName
    if (req.poster) {
        movieObj.poster = req.poster
    }
    if (id) {
        //更新电影
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            var oldCategroyId = movie.category === undefined ? undefined : movie.category._id;

            _movie = underscore.extend(movie, movieObj) // 用新对象里的字段替换老的字段

            if (oldCategroyId) {
                //已经选择分类的
                if (oldCategroyId.toString() === categoryId.toString()) {
                    //没有重新选择分类
                    _movie.save(function (err, movie) {
                        if (err) {
                            console.log(err);
                        }
                        res.redirect('/movie/' + movie._id);
                    })
                } else {
                    let newCategoryId = categoryId;
                    //重新选择分类
                    Category.findById(oldCategroyId, function (e, cate) {
                        //从旧的分类(oldCategroyId)下删除当前的movie._id,并且保存
                        cate.movies.forEach(function (value, index) {
                            if (value.toString() === id.toString()) {
                                cate.movies.splice(index, 1)
                            }
                        })
                        cate.save(function (e, c) {
                            //为新的分类newCategory保存movie._id，并且保存
                            Category.findById(newCategoryId, function (e, c) {
                                c.movies.push(movie._id)
                                c.save(function (e, c) {
                                    _movie.save(function (err, movie) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        res.redirect('/movie/' + movie._id);
                                    })
                                })
                            })
                        })
                    })
                }
            } else {
                //未选择分类
                Category.findById(categoryId, function (e, c) {
                    c.movies.push(movie._id)
                    c.save(function (e, c) {
                        _movie.save(function (err, movie) {
                            if (err) {
                                console.log(err);
                            }
                            res.redirect('/movie/' + movie._id);
                        })
                    })
                })
            }
        })
    } else {
        //创建新的电影
        _movie = new Movie(movieObj)
        saveMovie(true, _movie, categoryId, res, categoryName);
    }
}

/**
 * 保存电影
 * @param _movie
 * @param categoryId
 * @param res
 * @param categoryName
 */
function saveMovie(isCreate, _movie, categoryId, res, categoryName) {
    _movie.save(function (err, movie) {
        if (err) {
            console.log(err);
        }
        if (categoryId) {
            //优先保存电影分类选择
            Category.findById(categoryId, function (e, category) {
                if (err) {
                    console.log(err);
                }
                category.movies.push(movie._id)
                category.save(function (e, category) {
                    console.log("电影信息录入成功")
                    res.redirect('/movie/' + movie._id);
                })
            })
        } else if (categoryName) {
            //没有选择电影分类，则看下有没有自定义分类
            var category = new Category({
                name: categoryName,
                movies: [movie._id]
            })
            category.save(function (e, category) {
                movie.category = category._id;
                movie.save(function (e, movie) {
                    console.log("电影信息录入成功")
                    res.redirect('/movie/' + movie._id);
                })
            })
        } else {
            res.redirect('/movie/' + movie._id);
        }
    })
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
var createError = require('http-errors');
exports.list = function (req, res, next) {
    //当前页
    var page = req.query.page || 1;
    //总共页数
    var totalPage;
    //限定显示的标签页
    var limitShowPage = 5;
    //每页显示多少数据
    var size = 5;
    Movie.count({}, function (e, count) {//实际总条数
        totalPage = Math.ceil(count / size)
        if (page > totalPage) {
            return next(createError('当前选择页大于最大页数'));
        }
        Movie.find({})
            .populate("category", "name")//将分类名字查询出来
            .skip((page - 1) * size)
            .limit(size)
            .sort("meta.updateAt")
            .exec(function (err, movies) {
                if (err) {
                    console.log(err)
                }
                res.render('admin/movie/list', {
                    title: 'imooc 电影列表页',
                    movies: movies,
                    moviesSize: count,
                    page: page,
                    totalPage: totalPage,
                    limitShowPage: limitShowPage
                });
            })
    })
}