!function () {
    page.event.on("loaded", function (args) {
        //页面初始化完成
        var dataGrid = page.getControl('DataGrid1')
        dataGrid.event.on(SubTableEvent.DATACHOICE, function (args) {
            // 添加经典文献到文章
            appendArticleToCms(args.data);
        })
    });

    function appendArticleToCms(param) {
        console.log(param);
        var loadIndex = dsf.layer.loadding();
        dsf.http.request(dsf.url.getWebPath('teas/cms/main/appendArticleToCms'), param, "POST")
            .done(function (res) {
                if (res.success) {
                    dsf.layer.message("添加成功", true);
                    page.event.trigger(PageEvent.READY);
                } else {
                    dsf.layer.message("添加失败", false);
                }
            })
            .error(function (response) {
                dsf.layer.message("添加失败", false);
            })
            .always(function () {
                dsf.layer.close(loadIndex);

            })
            .exec();
    }


}();
