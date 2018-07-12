var Category=require('../mongodb/models/category')
/**
 * 分类录入请求
 * @param req
 * @param res
 */
exports.save=function (req, res) {
    var _category = req.body.category
    var category=new Category(_category)
    category.save(function (e, category) {
        if (e)console.log(e)
        res.redirect('/admin/category/list')
    })
}
exports.adminCategory=function (req, res) {
   res.render('adminCategory',{
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
        res.render('categorylist',{
            title:'后台电影分类列表界面',
            categories:categories
        })
    })
}