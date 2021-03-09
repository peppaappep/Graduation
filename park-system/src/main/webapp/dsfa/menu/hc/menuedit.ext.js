!function(){
    page.event.on("loaded",function(args){
        //页面初始化完成
        page.getControl("name")._event.on("value_change",function(){
        extendsName();
        });
        function extendsName() {
            page.getControl("mobile_name").value=page.getControl("name").value;
        }
    });
}();