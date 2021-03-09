! function() {
    // dsf.log("pageDesiner");
    //加载所有模块的脚本
    var files = [];
    for (var k in dsf.JSRely) {
        files.push(dsf.JSRely[k]);
    }

    var B = dsf.url.queryString("B");
    var M = dsf.url.queryString("M");
    var usetpl = dsf.url.queryString("usetpl");
    var isTpl = dsf.url.queryString("tpl") == "1";

    function getCurrentAccsetsUrl(folder, extname) {
        var du = dsf.url;
        return du.getWebPath(du.queryString("B") + "/" + (du.queryString("M").replace(/\./g, "/")) + "/" + folder + "/" + du.queryString("pname") + "." + extname + "?d=" + (new Date().getTime()));
    }

    $(document).ready(function() {
        window.setTimeout(function() {
            _appInit({
                loadFiles: function() {
                    //加载组件包JS
                    return files;
                },
                ready: function() {
                    loadPage()
                }
            });
        }, 10)

    });


    function loadPage() {
        var p = new dsf.PD.Design();
        p.$pageType = "Page"; //dsf.url.queryString("pt") || "Page";
        p.parentElement = "#desginer";
        //加载设计器布局模板，并根据模板中的page变更页面类型
        var pt = dsf.url.queryString("pt") || "default";
        p.options = dsf.pdOptions[pt];
        p.$pageType = p.options.page.control || "Page";
        p.root = new dsf.Controls[p.$pageType](null, true);
        p.root._isDesign = true;
        p.root._pageDesign = p;
        p.root.context = { "B": B, "M": M };
        window.page = p.root;
        //修改表单设计器页面的TITLE元素
        var title = dsf.url.queryString("title");
        $("head>title").html(title || (dsf._isMobile ? "移动端表单设计器" : "表单设计器"));

        window.defaultJs = "!function(){\n" +
            "    page.event.on(PageEvent.LOADED,function(args){\n" +
            "      //此处编写扩展代码\n" +
            "      \n" +
            "      \n" +
            "      \n" +
            "    });\n" +
            "}();";

        window.defaultEvRule = "//ev.addRule({\n" +
            "//\"key\": \"A100\", //必要参数，不可重复，key如果重复则互相覆盖\n" +
            "//\"prop\": \"sub\", //子表名称，非子表验证可以为空\n" +
            "//\"level\": 1, //验证级别，0为提示性验证，1为强制性验证\n" +
            "//\"errorMsg\": \"A100只能填写整数\", //验证失败时的提示\n" +
            "//\"rel\": ['a100'], //相关控件名称\n" +
            "//\}, function(i) {\n" +
            "    //此处编写规则\n" +
            "//\});";


        //加载布局文件
        var layoutPath = "",
            extJSPath = "",
            evJSPath = "";
        if (dsf.url.queryString("B") && dsf.url.queryString("M") && dsf.url.queryString("pname")) {
            layoutPath = getCurrentAccsetsUrl("hc", "layout.js");
            extJSPath = getCurrentAccsetsUrl("hc", "ext.js");
            evJSPath = getCurrentAccsetsUrl("hc", "ev.js");
        }
        var isLayouted = false;
        var queue = dsf.queue();
        queue.step(function(def, v) {
            //尝试加载已有布局文件
            var tplMark = false;

            function loadFn(err, response, jspath) {
                if (!err) {
                    eval(response);
                    var data = window._tpl || window._layout;
                    if (jspath && jspath.index > 0) {
                        tplMark = true;
                    }
                    var fn = tplMark ? dsf.PD.Design.loadTpl : dsf.PD.Design.loadLayout;
                    if (window._relyLibs && window._relyLibs.length > 0) {
                        //导入所有页面相关的JS文件
                        dsf.Import(window._relyLibs, function() {
                            fn(p, data);
                            isLayouted = true;
                            def.resolve(1);
                        });
                    } else {
                        fn(p, data);
                        isLayouted = true;
                        def.resolve(1);
                    }
                } else {
                    def.resolve(0);
                }
            }
            loadJs([
                layoutPath,
                usetpl ? dsf.url.getWebPath(usetpl) : "",
                p.options.page.useTpl ? dsf.url.getWebPath(p.options.page.useTpl) : ""
            ], loadFn);
        });
        queue.step(function(def, v) {
            //查找相关ext.js
            if (v == 1 && extJSPath) {
                loadJs(extJSPath, function(err, response, jspath) {
                    if (!err) {
                        p.root._extJsCode = response;
                        def.resolve(1);
                    } else {
                        p.root._extJsCode = window.defaultJs;
                        def.resolve(0);
                        dsf.warn("未查找到ext.js");
                    }
                });
            } else {
                p.root._extJsCode = window.defaultJs;
                def.resolve(0);
            }
        })
        queue.step(function(def, v) {
            //查找相关ev.js
            if (v == 1 && evJSPath) {
                loadJs(evJSPath, function(err, response, jspath) {
                    if (!err) {
                        p.root._evCodeJs = response;
                        def.resolve(1);
                    } else {
                        p.root._evCodeJs = window.defaultEvRule;
                        def.resolve(0);
                        dsf.warn("未查找到ev.js");
                    }
                });
            } else {
                p.root._evCodeJs = window.defaultEvRule;
                def.resolve(0);
            }
        })
        queue.step(function(def, v) {
            if (!isLayouted) {
                p.render();
                isLayouted = true;
            }
            def.resolve();
        })
        queue.catch(function(def, v) {
            p.render();
        });
        queue.exec();
    }


    function loadJs(paths, callback) {
        paths = $.type(paths) == "array" ? paths : [paths];
        for (var i = 0; i < paths.length; i++) {
            paths[i] = {
                url: paths[i],
                index: i
            }
        }
        paths = _.filter(paths, function(o, i) {
            return dsf.isDef(o.url) && $.trim(o.url) != "";
        });

        function l(path) {
            var url = path.url;
            $.ajax({
                url: url,
                dataType: "script",
                success: function(response) {
                    callback(null, response, path);
                },
                error: function(err) {
                    var np = paths.shift();
                    if (np) {
                        l(np);
                    } else {
                        callback("文件全部加载失败", null, path);
                    }
                }
            });
        }
        if (paths.length > 0) {
            var path = paths.shift();
            l(path);
        } else {
            callback("无可加载文件", null, null);
        }
    }

}(dsf);