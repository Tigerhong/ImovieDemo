// 处理删除电影数据的逻辑
$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $(".item-id-"+id);
        $.ajax({
            type:'DELETE',
            url:'/list/deleteMovie?id='+id,
        })
            .done(function (result) {
                if (result.success===1){
                    if (tr.length>0){
                        tr.remove();
                    }
                }
            })
    })
})