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
                column.value.push(mydata);
                column.reload();
            }
        }


    });


    page.event.on("save_before", function (ui, def) {
        try {
            var cname = page.getControl('name').value;
            var cauthor = page.getControl('author').value;
            var csource = page.getControl('source').value;

            if (column) {
                for (var i in column.value) {
                    var obj = column.value[i];
                    obj['dsfa_cms_content_column.cname'] = cname;
                    obj["dsfa_cms_content_column.cauthor"] = cauthor;
                    obj["dsfa_cms_content_column.csource"] = csource;
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