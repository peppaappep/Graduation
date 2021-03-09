!function(){
    var auth = null;
    page.event.on("loaded",function(args){
        //页面初始化完成
        auth = page.getControl('auth');
        auth.event.on(SubTableEvent.DATACHOICE,function(args){
            args.ui.value = args.data;
            auth.reload();
        })
    });
    
    page.event.on(PageEvent.CLOSE,function(){
        window['parent'].page.close();
    })
}();