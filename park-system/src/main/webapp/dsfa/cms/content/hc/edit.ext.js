!function () {
    var column = null;
    page.event.on("loaded", function (args) {
        //页面初始化完成
        column = page.getControl('column');

        if (column) {
            var lmid = dsf.url.queryString("lmid");
            var lmname = dsf.url.queryString("lmname");
            if (lmid && lmname) {
                var mydata = {};
                mydata["dsfa_cms_content_column.dsfa_cms_cm_id"] = lmid;
                mydata["dsfa_cms_content_column.cmname"] = lmname;
                // mydata["dsfa_cms_content_column.cmstatus"] = '无效';
                column.value.push(mydata);
                column.reload();
            }

            column.event.on('subtable_datachoice', function (d) {
                if (d.data && d.data.length > 0) {
                    for (var i in d.data) {
                        var repeat = d.ui.value.filter(function (value, index) {
                            return value["dsfa_cms_content_column.dsfa_cms_cm_id"] == d.data[i]._id;
                        });
                        if (repeat.length == 0) {
                            let obj = {};
                            obj["dsfa_cms_content_column.dsfa_cms_cm_id"] = d.data[i].dsfa_cms_cm_id;
                            obj["dsfa_cms_content_column.cmname"] = d.data[i]._name;
                            // obj["dsfa_cms_content_column.cmstatus"] = d.data[i].status_text;
                            d.ui.value.push(obj);
                        }
                    }
                    d.ui.reload();
                }
            })
        }

        page.getControl("ButtonBar3").event.on('buttonbar_click', function (data) {
            if (data.actionName == "preview") {
                var content = page.getControl('content').value;
                var author = page.getControl('author').value;
                var source = page.getControl('source').value;
                var cover = page.getControl('cover').value;
                var name = page.getControl('name').value;
                var fj = page.getControl("fj").value;

                var col = page.getControl('column');
                var columnId = col.value[0]['dsfa_cms_content_column.dsfa_cms_cm_id']

                var param = {};

                param['columnId'] = columnId;
                param['content'] = content;
                param['author'] = author;
                param['source'] = source;
                param['cover'] = cover;
                param['name'] = name;
                param['fj'] = fj;

                var url = 'teas/cms/template/cachePreviewData';
                dsf.http.request(dsf.url.getWebPath(url), param, 'POST')
                    .done(function (response) {
                        if (response.success) {
                            window.open(dsf.url.getWebPath("teas/cms/template/preview?previewId=" + response.data.previewId + "&code=" + response.data.code));
                        } else {
                            dsf.layer.message('获取数据失败', false)
                        }
                    })
                    .error(function (response) {
                        dsf.layer.message('获取数据失败', false)
                    }).exec();

            } else if (data.actionName == "reject") {
                var param = {};
                param['cmsId'] = dsf.url.queryString("id");
                var url = 'teas/cms/main/reject';
                dsf.http.request(dsf.url.getWebPath(url), param, 'POST')
                    .done(function (response) {
                        if (response.success) {
                            dsf.layer.message('已退回', false)
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

    function chectEmptyFj() {
        var fj = page.getControl("fj").value;
        return fj == '' || fj == '[]'
    }

    function checkEmptyContent() {
        var content = page.getControl('content').value;
        return typeof content == 'object' || content == '';
    }

    function checkEmptySourceurl() {
        var exurl = page.getControl('exurl').value;
        var sourceurl = page.getControl('sourceurl').value;
        return (typeof sourceurl == 'object' || sourceurl == '') || (exurl.value != 1);
    }

    function isLibarayHome() {
        return "tsg-sy" != dsf.url.queryString('code')
    }

    page.event.on("save_before", function (ui, def) {
        try {
            //请提交正文或上传附件
            if (isLibarayHome() && chectEmptyFj() && checkEmptyContent() && checkEmptySourceurl()) {
                dsf.layer.message("正文、附件、外链请至少选择填写其中一种", false);
                def.reject();
            }
            var cname = page.getControl('name').value;
            var cauthor = page.getControl('author').value;
            var csource = page.getControl('source').value
            var shzt = page.getControl('shzt').value;
            var fixedtop = page.getControl('fixedtop').value;
            var order = page.getControl('ds_order').value;


            if(shzt.value == 2){
                shzt.value = '0';
                shzt.text = '待审核';
            }

            if (column) {
                for (var i in column.value) {
                    var obj = column.value[i];
                    obj['dsfa_cms_content_column.cname'] = cname;
                    obj["dsfa_cms_content_column.cauthor"] = cauthor;
                    obj["dsfa_cms_content_column.csource"] = csource;
                    obj["dsfa_cms_content_column.shzt"] = shzt;
                    obj['dsfa_cms_content_column.fixedtop_value'] = fixedtop.value;
                    obj['dsfa_cms_content_column.ds_order'] = order;
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