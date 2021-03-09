! function() {

    // var path = dsf.url.queryString("path");
    // var prefix = "";

    page.event.on("loaded", function(args) {
        //页面初始化完成
        // if (path) {
        //     prefix = dsf.url.queryString("path");
        // } else {
        //     let index = page.getControl("ID").value.lastIndexOf(".");
        //     prefix = page.getControl("ID").value.substring(0, index);
        // }

        // if (!page.getControl("ID").value) {
        //     page.getControl("ID").value = prefix;
        // }

        // page.getControl("code").event.on("value_change", function(text) {
        //     if (prefix) {
        //         page.getControl("ID").value = (prefix + "." + text.value).replace(/\//g, '.');
        //     } else {
        //         page.getControl("ID").value = text.ui.value;
        //     }
        // });

        //监听子表
        page.getControl("list").event.on("subtable_addrow", function(args) {
            var code = page.getControl("list_" + (args.rowId) + "_code");
            if (code) {
                var order= page.getControl("list_" + (args.rowId) + "ds_order");
                code.event.on("value_change", function(textbox) {
                    if (order && textbox.ui) {
                        order.value = textbox.ui.value;
                    }
                })
            }
        });

    });


    page.event.on("save_before", function(args, def) {
        var list = page.getControl("list");
        var rows = list.value;
        for (var i = 0; i < rows.length; i++) {
            let row = rows[i];
            row["dsfa_rm_dict_list.class"] = page.getControl("ID").value;
        }
        def.resolve();
    });

}();