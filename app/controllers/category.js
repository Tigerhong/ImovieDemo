var Category=require('../mongodb/models/category')
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
        Category.remove({_id: id}, function (err, category) {
            var movies = category.movies;

            if (err) {
                console.log(err)
            } else {
                res.json({success: 1})
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
