!function(){
    page.event.on(PageEvent.LOADED,function(args){
        //此处编写扩展代码
        page.getControl("daydetail").event.on("buttonbar_click",function(button){
            let checkedData = page.getControl("daydetail").getCheckedData();
            const param={};
            const ids = [];
            for (let i = 0; i <checkedData.length ; i++) {
                ids[i]=checkedData[i]._id
            }
            param.ids=JSON.stringify(ids);
            if(button.actionName == 'work'){
                param.isWorkingText="是";
                param.isWorkingValue="1";
                dsf.layer.confirm("确认设为工作日?", function() {        //弹出确认窗
                    update(param);
                })
            }else if (button.actionName == 'rest'){
                param.isWorkingText="否";
                param.isWorkingValue="0";
                dsf.layer.confirm("确认设为非工作日?", function() {        //弹出确认窗
                    update(param);
                })
            }
        });
        function update(param) {
            dsf.http.request(dsf.url.getWebPath("dsfa/workDay/updateIsWorkingById"), param, "post")
                .done(function (response) {
                    if (response.success == true) {    //成功后调用方法
                        dsf.layer.message(response.message, true);
                        page.reload();
                    } else {                //失败后调用方法
                        dsf.layer.message(response.message, false);
                    }
                }).exec();
        }
    });
}();