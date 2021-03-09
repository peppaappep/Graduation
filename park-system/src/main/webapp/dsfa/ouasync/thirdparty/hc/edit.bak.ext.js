!function () {
    var appKey, appSecret;
    page.event.on(PageEvent.LOADED, function (args) {
        //此处编写扩展代码
        var isEdit = dsf.url.queryString('id');
        appKey = page.getControl('appkey');
        appSecret = page.getControl('appsecret');
        if (isEdit) {
            //查看时显示
            page.getControl('app_box').addStyle('display', 'inline')
            appKey.value = appKey.value || '生成失败！'
            appSecret.value = appSecret.value || '生成失败！'
        }

        // 子表数据
        var sub = page.getControl('sub');
        if (sub) {
            sub.event.on('subtable_datachoice', function (d) {
                if (d.data && d.data.length > 0) {
                    for (var i in d.data) {
                        var obj = {};
                        obj["dsfa_ouasync_thirdparty_sub.dsfa_serverapi_id"] = d.data[i]._id;
                        obj["dsfa_ouasync_thirdparty_sub.name"] = d.data[i]._name;
                        obj["dsfa_ouasync_thirdparty_sub.url"] = d.data[i].url;
                        d.ui.value.push(obj);
                    }
                    d.ui.reload();
                }
            });
        }

        var thirdpartySubList = function () {
        	var arr = [];
        	if (sub) {
        		page.getControl('sub').value.forEach((item) => {
        		    let sub = {
                        thirdpartySubId: item["dsfa_ouasync_thirdparty_sub.dsfa_ouasync_thirdparty_sub_id"],
                        apiTypeText: item["dsfa_ouasync_thirdparty_sub.api_type_text"],
                        apiTypeValue: item["dsfa_ouasync_thirdparty_sub.api_type_value"],
                        url: item["dsfa_ouasync_thirdparty_sub.url"],
                        serverApiId: item["dsfa_ouasync_thirdparty_sub.dsfa_serverapi_id"],
                        name: item["dsfa_ouasync_thirdparty_sub.name"],
                        apiGroupText: item["dsfa_ouasync_thirdparty_sub.api_group_text"],
                        apiGroupValue: item["dsfa_ouasync_thirdparty_sub.api_group_value"]
                    };
                    arr.push(sub)
                })
        	}
        	return arr;
        };

        page.getControl("thirdpartySaveButton").event.on("buttonbar_click", function (button) {
            if (button.actionName === "thirdparty_save") {
                let userData = {
                    id: dsf.Express.eval('@[url("id")]'),
                    userId: dsf.Express.eval('@[session("user_id")]'),
                    userName: dsf.Express.eval('@[session("user_name")]'),
                    linkName: page.getControl('link_name').value,
                    name: page.getControl('name').value,
                    ip: page.getControl('ip').value,
                    link: page.getControl('link').value,
                    remark: page.getControl('remark').value,
                    appKey: page.getControl('appkey').value,
                    appSecret: page.getControl('appsecret').value,
                    subList: thirdpartySubList()
                };
                dsf.http.request(dsf.url.getWebPath('/org/thirdparty/save'), JSON.stringify(userData), "post", "application/json;charset=UTF-8")
                    .done(function (res) {
                        if (res.success) {
                            dsf.layer.message("执行成功！", true);
                            page.event.trigger(PageEvent.READY);
                        } else {
                            dsf.layer.message("执行失败！", false);
                        }
                    })
                    .exec();
            }
        });

    });
}();
