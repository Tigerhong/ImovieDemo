var Comment=require('../mongodb/models/comment')
/**
 * 评论请求
 * @param req
 * @param res
 */
exports.save=function (req, res) {
    var _comment = req.body.comment
    var movieId=_comment.movie;
    //判断下评论的是这个电影还是评论
    if (_comment.cid){
        //保存的是主评论下的子评论
        Comment.findById(_comment.cid,function (err,comment) {
            var reply={
                from:_comment.from,
                to:_comment.tid,
                content:_comment.content
            }
            comment.reply.push(reply)
            comment.save(function (err, comment) {
                if (err) {
                    console.log(err);
                }
                console.log("评论评论成功")
                res.redirect('/movie/' + movieId);
            })
        })
    }else{
        //保存的是主评论，回复
        var comment = new Comment(_comment)
        comment.save(function (err, comment) {
            if (err) {
                console.log(err);
            }
            console.log("评论电影成功")
            res.redirect('/movie/' + movieId);
        })
    }
}