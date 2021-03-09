!function(){
    page.event.on("loaded",function(args){
        //页面初始化完成
        var scmenu = page.getControl("scmenu");
        scmenu.event.on(SubTableEvent.DATACHOICE, function (args) {
            args.ui.value = args.data;
            args.ui.reload();
        });
        scmenu.event.on(SubTableEvent.UPDATEDATA, function (args) {
            if (!args.ui) {
                for (let i in scmenu.value) {
                    scmenu.value[i]["dsfa_oua_role_scmenu.ds_order"] = i * 1 + 1;
                }
                scmenu.reload();
            }
        });
    });

}();