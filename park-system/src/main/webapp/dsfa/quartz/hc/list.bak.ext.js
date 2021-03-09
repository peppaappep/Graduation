!function(){
    page.event.on(PageEvent.LOADED,function(args){
      //此处编写扩展代码
        page.getControl("dsrwlist").event.on("row_buttonbar_click",function(button) {
            if (button.actionName === 'stop') {
                dsf.layer.confirm("确定要暂停吗?", function () {
                    var loadIndex = dsf.layer.loadding();
                    var param = {};
                    param.jobName = button.data["dsfa_quartz_listsjy.rwmc"];
                    param.groupName = button.data["dsfa_quartz_listsjy.rwz"];
                    dsf.http.request(dsf.url.getWebPath("task/pauseTimingTaskByNameAndGroup"), param, "post")
                        .done(function (response) {
                            if (response.success == true) {
                                dsf.layer.message(response.message, true);
                                page.event.trigger('ready');
                            } else {
                                dsf.layer.message(response.message, false);
                            }
                        })
                        .error(function (response) {
                            dsf.layer.message("失败", false);
                        })
                        .always(function () {
                            dsf.layer.close(loadIndex);
                        }).exec();
                });
            }else if (button.actionName === 'recover') {
                dsf.layer.confirm("确定要恢复吗?", function () {
                    var loadIndex = dsf.layer.loadding();
                    var param = {};
                    param.jobName = button.data["dsfa_quartz_listsjy.rwmc"];
                    param.groupName = button.data["dsfa_quartz_listsjy.rwz"];
                    dsf.http.request(dsf.url.getWebPath("task/resumeTimingTaskByNameAndGroup"), param, "post")
                        .done(function (response) {
                            if (response.success == true) {
                                dsf.layer.message(response.message, true);
                                page.event.trigger('ready');
                            } else {
                                dsf.layer.message(response.message, false);
                            }
                        })
                        .error(function (response) {
                            dsf.layer.message("失败", false);
                        })
                        .always(function () {
                            dsf.layer.close(loadIndex);
                        }).exec();
                });
            }else if (button.actionName === 'del') {
                dsf.layer.confirm("确定要删除吗?", function () {
                    var loadIndex = dsf.layer.loadding();
                    var param = {};
                    param.jobName = button.data["dsfa_quartz_listsjy.rwmc"];
                    param.groupName = button.data["dsfa_quartz_listsjy.rwz"];
                    dsf.http.request(dsf.url.getWebPath("task/delTimingTaskByNameAndGroup"), param, "post")
                        .done(function (response) {
                            if (response.success == true) {
                                dsf.layer.message(response.message, true);
                                page.event.trigger('ready');
                            } else {
                                dsf.layer.message(response.message, false);
                            }
                        })
                        .error(function (response) {
                            dsf.layer.message("失败", false);
                        })
                        .always(function () {
                            dsf.layer.close(loadIndex);
                        }).exec();
                });
            }
        });
    });
}();
