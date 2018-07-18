// 处理删除分类数据的逻辑
$(function () {
    $('.del').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $(".item-id-"+id);
        // console.log('要删除分类的id'+id)
        $.ajax({
            type:'DELETE',
            url:'/admin/category/list?id='+id,
        })
            .done(function (result) {
                if (result.success===1){
                    if (tr.length>0){
                        tr.remove();
                    }
                }
                $('#confrimDelete').modal('toggle')
            })
    })
//为确认删除模态框设置一些属性
    $('#confrimDelete').on('show.bs.modal',function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var name = button.data('name');
        var id = button.data('id');
        var modal=$(this)
        modal.find('.title').text(name)
        // console.log('设置分类的id'+id)
        modal.find('.del').data('id',id)
    })
})