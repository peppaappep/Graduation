! function() {
    var pid = dsf.url.queryString("pid");
    var p_path = dsf.url.queryString("ppath");
    var prefix="";


    page.event.on("loaded", function(args) {
        //页面初始化完成
        if(p_path){
            prefix= dsf.url.queryString("ppath");
        }
        else{
            let index= page.getControl("path").value.lastIndexOf("/");
            prefix= page.getControl("path").value.substring(0,index);
        }

        if(!page.getControl("path").value){
            page.getControl("path").value=prefix;
        }
        if(!page.getControl("ID").value){
            page.getControl("ID").value=prefix.replace(/\//g,'.');
        }
        
        page.getControl("code").event.on("value_change",function(text){
            if(text.ui){
                text = text.ui;
                if(prefix){
                    page.getControl("path").value=prefix+"/"+text.value;
                    page.getControl("ID").value=(prefix+"."+text.value).replace(/\//g,'.');
                }
                else{
                    page.getControl("path").value=text.value;
                    page.getControl("ID").value=text.value;
                }
            }
        });
    });

    // page.event.on(EventEmun.PageEvent.SAVEBEFORE, function(args, def) {
    //     var currentCode = page.getControl("code");
    //     if(pid){
    //         var pathValue = page.getControl("path").value
    //         if (!pathValue) {
    //             try {
    //                 page.getControl("path").value = "#(StrKit.join('/','" + p_path + "','" + currentCode.value + "'))";
    //                 def.resolve();
    //             } catch (ex) {
    //                 def.reject();
    //             }
    //         } else {
    //             var path_str = page.getControl("path").value.split("/");
    //             if (path_str[path_str.length - 1]) {
    //                 path_str[path_str.length - 1] = currentCode.value;
    //             }
    //             page.getControl("path").value = path_str.join("/");
    //             def.resolve();
    //         }
    //     }
    //     else{
    //         def.resolve();
    //     }
    // });

    // page.event.on(EventEmun.PageEvent.SAVEAFTER, function(args, def) {
    //     def.resolve();
    // });

}();