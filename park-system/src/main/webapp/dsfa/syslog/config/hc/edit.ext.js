!function(){
    page.event.on("loaded",function(args) {
        //页面初始化完成
        page.getControl('ButtonBar3').event.on("buttonbar_click", function (data) {
            if (data.actionName === 'syn') {
                var directory = page.getControl('directory').value;
                var prefix = page.getControl('prefix').value;
                var suffix = page.getControl('suffix').value;
                var s_r = page.getControl('s_r').value;
                var e_r = page.getControl('e_r').value;
                var elements = page.getControl('elements').value;
                var loadIndex = dsf.layer.loadding();
                dsf.http.request(dsf.url.getWebPath("syslog/extract/requestLog"), {"directory": directory,"prefix": prefix,"suffix": suffix
                ,"s_r": s_r,"e_r": e_r,"elements": elements}, "get")
                    .done(function (response) {
                        if (response.success == true) {
                            dsf.layer.message(response.message, true);
                        } else {
                            dsf.layer.message(response.message, false);
                        }
                    })
                    .error(function (response) {
                        dsf.layer.message("失败", false);
                    })
                    .always(function () {
                        dsf.layer.close(loadIndex);
                    })
                    .exec();
            }
        });
    });
}();

