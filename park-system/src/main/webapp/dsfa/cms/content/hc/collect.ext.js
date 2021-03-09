!function () {
    page.event.on("loaded", function (args) {

        var collect = page.getControl('collect');

        collect.getDataSource = function () {
            var loadIndex = dsf.layer.loadding();
            dsf.http.request(dsf.url.getWebPath('teas/cms/main/collect'), {
                "pageSize": collect.$limit,
                "startPage": collect.index,
                "keyword": collect.getSearchString()
            }, "get")
                .done(function (res) {
                    if (res.success) {
                        if (res.data) {
                            var data = res.data;
                            collect.loadData(data);
                        }
                    } else {
                        dsf.layer.message("获取数据失败", false);
                    }
                })
                .error(function (response) {
                    dsf.layer.message("服务器异常", false);
                })
                .always(function () {
                    dsf.layer.close(loadIndex);
                })
                .exec();
        }

        collect.event.on(DataGridEvent.ROWBUTTONCLICK, function (args) {
            var url = 'teas/cms/main/collectCmsById';
            if (args.actionName == 'removeCollect') {
                var item = args.data;
                var param = {"relId": item['dsfa_cms_content_column.dsfa_cms_content_id'], "type": '0'};
                dsf.http.request(dsf.url.getWebPath(url), param, "POST")
                    .done(function (response) {
                        if (response.success) {
                            dsf.layer.message("取消收藏成功", true);
                            page.event.trigger(PageEvent.READY);
                        } else {
                            dsf.layer.message("操作失败", false);
                        }
                    })
                    .error(function (response) {
                        dsf.layer.message("操作失败", false);
                    }).exec();
            }
        })

    });

}();