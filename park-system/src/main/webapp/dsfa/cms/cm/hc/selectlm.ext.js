!function(){
    page.event.on("loaded",function(args){
        //页面初始化完成
    });

    window.setCheckedData = function (v) {
        for (let i in v) {
            v[i]._id = v[i]["dsfa_cms_content_column.dsfa_cms_cm_id"];
            v[i]._name = v[i]["dsfa_cms_content_column.cmname"];
            v[i].status_text = v[i]["dsfa_cms_content_column.cmstatus"];
        }
        page.getControl('selectlm').value = v;
    }
    window.getCheckedData = function () {
        return page.getControl('selectlm').value;
    }

}();