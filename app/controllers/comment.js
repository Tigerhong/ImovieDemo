var Comment=require('../mongodb/models/comment')

exports.save=function (req, res) {
    var _comment = req.body.comment
    var movieId=_comment.movie;
    var comment = new Comment(_comment)
    comment.save(function (err, comment) {
            if (err) {
                console.log(err);
            }
            console.log("评论成功")
            res.redirect('/movie/' + movieId);
        })
}