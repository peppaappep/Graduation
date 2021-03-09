!function(){
    var column = null;
    page.event.on("loaded",function(args){
        column = page.getControl('column');

        if (column) {
            var lmid = dsf.url.queryString("lmid");
            var lmname = dsf.url.queryString("lmname");
            if (lmid && lmname) {
                var mydata = {};
                mydata["dsfa_cms_content_column.dsfa_cms_cm_id"] = lmid;
                mydata["dsfa_cms_content_column.cmname"] = lmname;
                column.value.push(mydata);
                column.reload();
            }
        }

        page.getControl("ButtonBar_cynrbj").event.on('buttonbar_click', function (data) {
            if (data.actionName == "preview") {
                var content = page.getControl('content').value;
                var author = page.getControl('author').value;
                var name = page.getControl('name').value;
                var fj = page.getControl("fj").value;


                var param = {};

                param['content'] = content;
                param['author'] = author;
                param['name'] = name;
                param['fj'] = fj;

                var url = 'teas/cms/template/cachePreviewData';
                dsf.http.request(dsf.url.getWebPath(url), param, 'POST')
                    .done(function (response) {
                        if (response.success) {
                            window.open(dsf.url.getWebPath("teas/cms/template/preview?previewId=" + response.data.previewId));
                        } else {
                            dsf.layer.message('获取数据失败', false)
                        }
                    })
                    .error(function (response) {
                        dsf.layer.message('获取数据失败', false)
                    }).exec();
            }

        });



    });


    page.event.on("save_before", function (ui, def) {
        try {
            var cname = page.getControl('name').value;
            var cauthor = page.getControl('author').value;
            var shzt = page.getControl('shzt').value;

            if (column) {
                for (var i in column.value) {
                    var obj = column.value[i];
                    obj['dsfa_cms_content_column.cname'] = cname;
                    obj["dsfa_cms_content_column.cauthor"] = cauthor;
                    obj["dsfa_cms_content_column.shzt"] = shzt;
                }
                column.reload();
            }

            def.resolve();
        } catch (ex) {
            dsf.layer.message("保存出现错误", false);
            def.reject();
        }

    });



}();
