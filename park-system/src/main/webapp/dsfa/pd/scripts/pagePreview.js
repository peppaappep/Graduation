! function() {
    var dom = null;
    var s = dsf.url.queryString("s");
    if (!window._tpl && !window._layout) {
        if (window.localStorage) {
            dom = JSON.parse(window.localStorage.getItem("layout"));
        }
        if (location.href.indexOf('mobilePreview.html') != '-1') {
            dsf._isMobile = true;
            dsf.Controls["Page"] = dsf.Controls["Page_mobile"];
        }
    } else {
        dom = {
            layout: (window._tpl || window._layout),
            relyLibs: window._relyLibs
        }
    }
    var page = new dsf.Controls[dom.layout.ctrl_type]();
    page.parentElement = "#view";
    page._isDesign = false;
    page.preview = true;
    window.page = page;

    var files = [];
    for (var k in dsf.JSRely) {
        files.push(dsf.JSRely[k]);
    }
    // files.forEach(function(f) {
    //     var src = dsf.url.getWebPath(f);
    //     document.write("<script src='" + src + "'></script>");
    // });

    $(document).ready(function() {
        window.setTimeout(function() {
            _appInit({
                loadFiles: function() {
                    return files;
                },
                ready: function() {
                    loadPage()
                }
            });
        }, 10)
    });

    function loadPage(){
        dom.relyLibs = dom.relyLibs || [];
        var relyFiles = dom.relyLibs;
        dsf.Import(relyFiles, function() {
            if (s == "mobile") {
                $("#view").addClass("mobile");
                $("body").addClass("mobile-scroll")
            }
            // console.time("加载页面");
            if (dom.layout) {
                if (dsf.url.queryString("isview") == "1") {
                    page._isView = true;
                }
                dsf.Controls.Page.loadLayout(page, dom.layout);
                if (dsf.url.queryString("isview") == "1") {
                    page.resize();
                }
            } else {
                page.render();
            }
            // console.timeEnd("加载页面");
        })
    }

}();