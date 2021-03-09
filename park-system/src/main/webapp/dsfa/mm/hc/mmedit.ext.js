! function() {
    var path = dsf.url.queryString("path");
    var prefix="";
    page.event.on("loaded", function(args) {
        //页面初始化完成


        //如果当前标识为空则从url的path参数读取并赋值
        if (!page.getControl("ID").value && path) {
            page.getControl("ID").value = path;
            prefix=path;
        }
        //如果本身有值，则读取其本身值并截取最后一个.之前的字符
        else if(page.getControl("ID").value){
            var index = page.getControl("ID").value.lastIndexOf(".");
            prefix = page.getControl("ID").value.substring(0, index);
        }

        //监听code文本框值变化
        page.getControl("code").event.on("value_change", setFullCode);

    });


    function setFullCode(textBox) {
        if(textBox.ui){
            var code = textBox.ui.value;
            page.getControl("ID").value = prefix + (code ? "." + code : code);
        }
    }

}();