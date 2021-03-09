!function(){
    page.event.on(PageEvent.LOADED,function(args){
      //此处编写扩展代码
        var param={};
        param.workdayId=dsf.url.queryString("pid");
        dsf.http.request(dsf.url.getWebPath("dsfa/workDay/findWorkdayById"), param, "get")
            .done(function (response) {
                if (response.success == true) {    //成功后调用方法
                    if (response.data){
                        page.getControl("year").value=response.data.year;
                        page.getControl("mon").value=response.data.mon;
                        page.getControl("hours").value=response.data.hours;
                    }
                }
            }).exec();
        page.getControl("workdaylist").event.on("row_buttonbar_click",function(button){
            // dsf.layer.confirm("确认设为工作日?", function() {        //弹出确认窗
                //..点击确认执行的代码
                var loadIndex = dsf.layer.loadding();
                var param={};
                param.isWorkingText="是";
                param.isWorkingValue="1";
                param.workdayDetailId=button.data['dsfa_workday_listsjy.dsfa_workday_daydetail_id'];
                if(button.actionName == 'setWork'){
                    dsf.http.request(dsf.url.getWebPath("dsfa/workDay/setWork"), param, "post")
                        .done(function (response) {
                            if (response.success == true) {    //成功后调用方法
                                dsf.layer.message(response.message, true);
                                page.event.trigger('ready');
                            } else {                //失败后调用方法
                                dsf.layer.message(response.message, false);
                            }
                        })
                        .error(function (response) { //异常时调用方法
                            dsf.layer.message("失败", false);
                        })
                        .always(function () {        //始终调用该方法
                            dsf.layer.close(loadIndex);
                        }).exec();
                }
            // })

        });
        page.getControl("workdaylist").event.on("row_buttonbar_click",function(button){
            // dsf.layer.confirm("确认设为非工作日?", function() {        //弹出确认窗
                //..点击确认执行的代码
                var param={};
                param.isWorkingText="否";
                param.isWorkingValue="0";
                param.workdayDetailId=button.data['dsfa_workday_listsjy.dsfa_workday_daydetail_id'];
                var loadIndex = dsf.layer.loadding();
                if(button.actionName == 'setRest'){
                    dsf.http.request(dsf.url.getWebPath("dsfa/workDay/setRest"), param, "post")
                        .done(function (response) {
                            if (response.success == true) {    //成功后调用方法
                                dsf.layer.message(response.message, true);
                                page.event.trigger('ready');
                            } else {                //失败后调用方法
                                dsf.layer.message(response.message, false);
                            }
                        })
                        .error(function (response) { //异常时调用方法
                            dsf.layer.message("失败", false);
                        })
                        .always(function () {        //始终调用该方法
                            dsf.layer.close(loadIndex);
                        }).exec();
                }
            // })
        });
    });
}();