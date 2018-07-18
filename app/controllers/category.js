var Category=require('../mongodb/models/category')
var Movie=require('../mongodb/models/movie')
/**
 * 分类录入请求
 * @param req
 * @param res
 */
exports.save=function (req, res) {
    var _category = req.body.category
    if (_category._id){
        //更新数据
        Category.update({_id:_category._id},{name:_category.name},function (e, category) {
            if (e)console.log(e)
            res.redirect('/admin/category/list')
        })
    } else{
        //创建新的分类
        var category=new Category(_category)
        category.save(function (e, category) {
            if (e)console.log(e)
            res.redirect('/admin/category/list')
        })
    }
}
exports.adminCategory=function (req, res) {
   res.render('admin/category/admin',{
       title:'后台电影类别录入页面',
       category:{}
   })
}
/**
 * 后台电影分类列表界面
 * @param req
 * @param res
 */
exports.adminCategoryList=function (req, res) {
    Category.fetch(function (e,categories) {
        res.render('admin/category/list',{
            title:'后台电影分类列表界面',
            categories:categories
        })
    })
}
/**
 * 删除某个分类
 * @param req
 * @param res
 */
exports.del=function (req, res) {
    var id = req.query.id;
    if (id) {
        //1.找到id对应的分类
        //2.将分类下的电影的categoty设置为undefined保存
        //3.执行删除分类逻辑
        //todo 这里需要重新优化，现在执行代码执行顺序不对，第2步和第3步并行执行了。
        //需要顺序执行才对
        Category.findById(id,function (err, categoty) {
            //1.找到id对应的分类
            if (err) {
                console.log(err)
            } else {
                //2.将分类下每个电影的categoty设置为undefined保存
               var movies=  categoty.movies
                for (var i=0, len=movies.length;i<len;i++){
                    var movieId=movies[i];
                    Movie.findById(movieId,function (err, movie) {
                        if (movie.category) {
                            console.log('重置分类下每个电影的category属性')
                            movie.category=undefined
                            movie.save()
                        }
                    })
                }
                //3.执行删除分类逻辑
                Category.remove({_id: id}, function (err, c) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('删除'+categoty.name+'分类成功')
                        res.json({success: 1})
                    }
                })
            }
        })
    }
}
/**
 * 显示后台 后台电影更新页面
 * @param req
 * @param res
 */
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Category.findById(id, function (err, category) {
            if (err) {console.log(err) }
            res.render('admin/category/admin', {
                title: 'imooc 后台电影更新页面',
                category:category
            });
        })
    } else {
        console.log("后台电影更新页id不存在")
    }
}
