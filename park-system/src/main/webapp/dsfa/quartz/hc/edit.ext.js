!function(){
    function checkData(){
        var controls = page.getPostControls();
        var scope = page.getControlsData();
        var result = page.getValidateResult(scope, scope, controls);
        if (!result.success) {
            page.event.trigger(PageEvent.VALIDATEERROR, {"ui": page, "data": result});
            var errorList = result.data.error;
            var messageInfo = {};
            for (var i = 0; i < errorList.length; i++) {
                var metaCode = errorList[i].metaCode;
                var index = errorList[i].index;
                var temp = page.element.find("[ds-data-bind='" + metaCode + "']");
                if (errorList[i].type == 'Rank') {
                    if (temp.length > 0 && index != null) {
                        temp = $(temp.find('tbody tr')[index]).find('td:last-child');
                        errorList[i].ctrl.validateError(true, temp);
                    }
                    if (i == 0) {
                        if (document.body.scrollIntoView) {
                            temp.get(0).scrollIntoView({behavior: "smooth"});
                        }
                        messageInfo = {
                            "message": errorList[i].message,
                            "ctrl": errorList[i].ctrl,
                            "type": 'Rank'
                        }
                    }
                } else {
                    if (temp.length > 0 && index != null) {
                        temp = temp.eq(index);
                    }
                    var ctrl = temp.data("Object");
                    if (ctrl) {
                        ctrl.validateError(true, errorList[i].message);
                    }
                    if (i == 0) {
                        if (document.body.scrollIntoView) {
                            temp.get(0).scrollIntoView({behavior: "smooth"});
                        }
                        messageInfo = {
                            "ctrl": ctrl,
                            "message": errorList[i].message
                        }
                    }
                }
            }
            if (messageInfo && messageInfo.type == 'Rank') {
                // 评分
                dsf.layer.message(messageInfo.ctrl.label + "下所有的评分项必评，请检查", false);
            } else if (messageInfo && messageInfo.ctrl) {
                dsf.layer.message(messageInfo.ctrl.label + "未填写正确或不符合要求，请检查", false);
            } else {
                dsf.layer.message("未填写完整或不符合要求，请检查", false);
            }
            return false;
        }else{
            return true;
        }
    }

    page.event.on(PageEvent.LOADED,function(args){
      //此处编写扩展代码
        page.getControl("ButtonBar3").event.on("buttonbar_click",function(button) {
            if (button.actionName === 'save' && checkData()) {
                    var loadIndex = dsf.layer.loadding();
                    var param = {};
                    param.jobParam = page.getControl("rwcs").value;
                    if (isJSON(param.jobParam) || param.jobParam == null || param.jobParam === "") {
                        param.jobName = page.getControl("rwmc").value;
                        param.groupName = page.getControl("rwz").value;
                        param.describe = page.getControl("rwms").value;
                        param.cron = page.getControl("cronbds").value;
                        param.fullyClassName = page.getControl("rwlm").value;
                        dsf.http.request(dsf.url.getWebPath("task/addClassTimingTask"), param, "post")
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
                    } else {
                        dsf.layer.message("任务参数必须为JSON格式!!", false);
                    }
            }else if (button.actionName === 'update'){
                var loadIndex = dsf.layer.loadding();
                var param = {};
                param.jobName = page.getControl("rwmc").value;
                param.groupName = page.getControl("rwz").value;
                param.cron = page.getControl("cronbds").value;
                dsf.http.request(dsf.url.getWebPath("task/updateTimingTaskCronByNameAndGroup"), param, "post")
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
            }
        });
        page.getControl("buttonbar47").event.on("buttonbar_click",function(button) {
            if (button.actionName === 'generateCron' ) {
                dsf.layer.openDialog({
                    title: '生成表达式',
                    shade:0.01,
                    shadeClose:true,
                    content: 'cron.html',
                    area:["500px","400px"],
                    offset: 'r'
                })
            }
        });
    });
    function isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }

            } catch(e) {
                return false;
            }
        }
    }
}();