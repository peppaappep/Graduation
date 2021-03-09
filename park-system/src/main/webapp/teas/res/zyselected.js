! function() {

    var sdate = "",
        edate = "",
        relid = "",
        max = dsf.url.queryString("max") ? parseInt(dsf.url.queryString("max")) : 0;
    $(document).ready(function() {
        init();
    });

    var init = function() {
        // alert("a")
        sdate = dsf.url.queryString("sdate") || dsf.date.format(new Date(), "yyyy-mm-dd hh:ii");
        edate = dsf.url.queryString("edate") || dsf.date.format(new Date(), "yyyy-mm-dd hh:ii");
        relid = dsf.url.queryString("relid") || ""
        loadJZ();
        attachEvent();

    }

    //加载建筑数据,并加载第一个建筑的子数据
    var loadJZ = function() {
        dsf.queue(true)
            .step(function(def, v) {
                var url = dsf.UrlSetting.list_load;
                // var args = {
                //     "pid": "",
                //     "metaFullCode": "teas_zygl_jsk.NavTree1",
                //     "pageName": "main",
                //     "namespace": "teas.zygl.jsk",
                //     "globalIdValue": "",
                //     "query": JSON.stringify({ "searchValue": "" }),
                //     "maxLevel": 1,
                //     "openLevel": 1
                // }
                var args = {
                    pageNum: 1,
                    pageSize: 9999,
                    query: JSON.stringify({ "searchValue": "", "treeinfo_level": "1" }),
                    order: [],
                    namespace: "teas.zygl.jsk",
                    pageName: "pkxzdddl"
                }
                dsf.http.request(url, args, "GET")
                    .done(function(response) {
                        if (response.success) {
                            var data = response.data;
                            def.resolve(data);
                        } else {
                            def.reject();
                        }
                    })
                    .error(function(response) {
                        def.reject();
                    })
                    .exec();
            })
            .step(function(def, v) {
                renderJZ(v);
                def.resolve(v[0]);
            })
            .step(function(def, v) {
                if (v) {
                    loadZY(v["_id"], function(err, data) {
                        renderZY(data);
                        def.resolve();
                    });
                } else {
                    def.resolve();
                }
            })
            .catch(function() {
                dsf.layer.message(dsf.prompt.loaddatafail, false);
            })
            .exec();
    }

    //加载建筑物的相关资源
    var loadZY = function(pid, callback) {
        var url = dsf.url.getWebPath("teas/zygl/jsk/listClassRoomInfo") //dsf.UrlSetting.list_load;
        var args = {
            "teas_zygl_jsk_id": pid,
            "zysj_sdate": sdate,
            "zysj_edate": edate,
            "relid": relid
        }
        dsf.http.request(url, args, "GET")
            .done(function(response) {
                if (response.success) {
                    var data = response.data;
                    callback(null, data);
                } else {
                    callback(response.data, null)
                }
            })
            .error(function(response) {
                callback(response);
            })
            .exec();
    }

    var attachEvent = function() {
        var ul = $("ul.jz");
        ul.on("click", "li", function(evt) {
            var target = $(evt.currentTarget);
            ul.children("li").removeClass("active");
            target.addClass("active");
            var loading_index = dsf.layer.loadding();
            loadZY(target.attr("id"), function(err, data) {
                renderZY(data, target.attr("id"));
                dsf.layer.close(loading_index);
                var timmer = setInterval(function() {
                    if ($(".ms").length > 0) {
                        clearInterval(timmer);
                        $(".roompic").on("click", function(evt) {
                            evt.stopPropagation();
                            var target = $(evt.currentTarget);
                            var data = target.closest('.zy_item').data("data");
                            previewImg(data);
                        })
                    }
                }, 200)
            });
        });
        var div = $("div.zy");
        div.on("click", ".zy_item:not('.disabled')", function(evt) {
            var target = $(evt.currentTarget);
            // var data = target.data("data");
            selectedZY(target);
        });
    }

    var renderJZ = function(data, selected) {
        if (data) {
            var ul = $("ul.jz");
            ul.html("")
            for (var i = 0; i < data.length; i++) {
                var li = $("<li id='" + data[i]["_id"] + "' type='jxl'><a>" + data[i]["teas_zygl_jsk.name"] + "</a></li>");
                if (selected == data[i]["_id"]) {
                    li.addClass("active");
                }
                ul.append(li);
            }

        }
        //强制增加教学基地
        // let jd = {
        //     name: "教学基地",
        //     type:"jd",
        //     teas_zygl_jsk_id: "10000000000000000000000000000000",
        //     treeinfo_globalid: "10000000000000000000000000000000",
        //     treeinfo_icon: null,
        //     treeinfo_level: 1,
        //     treeinfo_pid: null,
        //     _id:'10000000000000000000000000000000',
        //     _level: 1
        // }
        // var li = $("<li id='"+(jd.teas_zygl_jsk_id)+"' type='jd'><a>" + jd.name + "</a></li>");
        // ul.append(li);

        if (!selected) {
            ul.children("li").first().addClass("active");
        }
    }

    var renderZY = function(data) {
        var div = $("div.zy");
        div.html("");
        var sourceMap = {
            "1": {
                "title": "有话筒",
                "icon": "icon-huatong"
            },
            "2": {
                "title": "有投影",
                "icon": "icon-luxiangji"
            },
            "3": {
                "title": "有录播",
                "icon": "icon-shipinbofangyingpian"
            }
            // "4": {
            //     "title": "有茶歇",
            //     "icon": "icon-kafei"
            // }
        }

        var result = getCheckedData();
        var selectedMap = {};
        for (var i = 0; i < result.length; i++) {
            selectedMap[result[i].value] = result[i];
        }
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var html = "<div class='zy_item'>";
            html += "<div class='ds_icon_5'>" + (d["teas_zygl_jsk.alias"] || d["teas_zygl_jsk.name"]) + (d["teas_zygl_jsk.accommodate"] ? "(" + d["teas_zygl_jsk.accommodate"] + ")" : "") + "</div>";
            html += "<div class='ms'>";
            var mediaresource = d["teas_zygl_jsk.mediaresource"];
            if (!dsf.isEmpty(mediaresource)) {
                mediaresource = $.isArray(mediaresource) ? mediaresource : [mediaresource];
                for (var n = 0; n < mediaresource.length; n++) {
                    var m = mediaresource[n];
                    if (m.value) {
                        var temp1 = [],
                            temp2 = [],
                            obj = [];
                        temp1 = m.value.split("^");
                        temp2 = m.text.split("^");
                        for (var c = 0; c < temp1.length; c++) {
                            obj.push({
                                "value": temp1[c],
                                "text": temp2[c]
                            });
                        }
                        for (var c = 0; c < obj.length; c++) {
                            var map = sourceMap[obj[c].value];
                            if (map) {
                                html += "<i class='iconfont " + map.icon + " ds_icon_3' title='" + map.title + "'></i>";
                            }
                        }
                        html += (d["teas_zygl_jsk.roomimg"] ? "<i class='iconfont icon-charutupian ds_icon_3 roompic' title='照片'></i>" : "")
                    }
                }
            }
            html += "</div>"
            html += "</div>";
            var zy = $(html);
            zy.data("data", d);
            // var sd=dsf.date.parse("2019-01-02 09:00","yyyy-mm-dd");
            if (d.useinfo && d.useinfo.length > 0) {
                zy.addClass("collision");
                var title = ["该教室已经被占用"];
                for (var n = 0; n < d.useinfo.length; n++) {
                    var u = d.useinfo[n];
                    var sday = dsf.date.format(u["teas_jwgl_zyzy.zysj"].sdate, "yyyy-mm-dd");
                    var eday = dsf.date.format(u["teas_jwgl_zyzy.zysj"].edate, "yyyy-mm-dd");
                    var sd = dsf.date.parse(u["teas_jwgl_zyzy.zysj"].sdate, "yyyy-mm-dd hh:ii");
                    var ed = dsf.date.parse(u["teas_jwgl_zyzy.zysj"].edate, "yyyy-mm-dd hh:ii");
                    var zysj = "";
                    if (sday == eday) {
                        zysj = sday + " " + dsf.date.format(sd, "hh:ii") + "-" + dsf.date.format(ed, "hh:ii");
                    } else {
                        zysj = sday + " " + dsf.date.format(sd, "hh:ii") + "至" + eday + " " + dsf.date.format(ed, "hh:ii");
                    }
                    var str = "占用时间:" + zysj + "\r\n";
                    str += "占用原由:" + (u["teas_jwgl_zyzy.name"] || "无") + "\r\n";
                    str += "联系人:" + (u["teas_jwgl_zyzy.lxr"] || "无") + "\r\n";
                    str += "联系电话:" + (u["teas_jwgl_zyzy.lxdh"] || "无") + "\r\n";
                    title.push(str);
                }
                zy.attr("title", title.join("\r\n"));
            }
            if (d["teas_zygl_jsk.status"].value == "0" || d['teas_zygl_jsk.status'].value>1) {
                zy.addClass("disabled");
            }
            //选中
            if (selectedMap[d["teas_zygl_jsk.teas_zygl_jsk_id"]]) {
                zy.addClass("checked")
            }
            div.append(zy);
        }
    }

    var renderSelectItem = function(zy) {
        var name = zy.text;
        var id = zy.value;
        var div = $("<div class='selectitem'>" + name + "</div>");
        var closeBtn = $("<div class='clearbtn' title='移除'><i class='iconfont icon-guanbi2 ds_icon_6'></i></div>");
        div.append(closeBtn);
        div.data("data", { "text": name, "value": id });
        $("div.selectedzy").append(div);
        closeBtn.on("click", function(evt) {
            div.remove();
            uncheckedItem({ "text": name, "value": id })
        });
    }

    var selectedZY = function(zy) {
        var data = zy.data("data");
        var name = (data["teas_zygl_jsk.alias"] || data["teas_zygl_jsk.name"]);
        var id = data["teas_zygl_jsk.teas_zygl_jsk_id"];
        var items = $("div.selectedzy").children(".selectitem");
        var _el = null;
        if (!zy.hasClass("checked")) {
            items.each(function(i, el) {
                var d = $(el).data("data");
                if (d.value == id) {
                    _el = $(el);
                    return false;
                }
            });
            if (!_el) {
                var items = $("div.selectedzy").children(".selectitem");
                if (max && items.length >= max) {
                    dsf.layer.message("多只能选择" + max + "个",false);
                    return;
                }
                renderSelectItem({ "text": name, "value": id });
                zy.addClass("checked");
            }
        } else {
            items.each(function(i, el) {
                var d = $(el).data("data");
                if (d.value == id) {
                    el.remove();
                    return;
                }
            });
            zy.removeClass("checked");
        }


    }

    var previewImg = function(data) {
        $(".layui-carousel").length > 0 && $(".layui-carousel").remove();
        var id = data['teas_zygl_jsk.teas_zygl_jsk_id'];
        var imgs = JSON.parse(data['teas_zygl_jsk.roomimg']);
        var carousel = '<div class="layui-carousel ds_zy_carousel" id="' + id + '">';
        carousel += '<div carousel-item="">';
        for (var i = 0; i < imgs.length; i++) {
            carousel += '<div><img src="' + dsf.url.getWebPath(imgs[i].relativePath) + '"></div>';
        }
        carousel += '</div>';
        carousel += '</div>'
        var close_Btn = '<button class="layui-icon ds_layui_close" lay-type="close">&#x1006;</button>'
        $("body").append(carousel);
        $(".layui-carousel").append(close_Btn);
        layui.use('carousel', function() {
            var carousel = layui.carousel;
            carousel.render({
                elem: "#" + id,
                width: '100%',
                height: '100%',
                autoplay: false,
                arrow: "always",
                full: true
            });
        });
        $("[lay-type=close]").on("click", function() {
            $(".layui-carousel").remove();
        })
    }

    window.getCheckedData = function() {
        var items = $("div.selectedzy").children(".selectitem");
        var result = [];
        items.each(function(i, el) {
            var d = $(el).data("data");
            result.push(d);
        });
        return result;
    }

    window.setCheckedData = function(data) {
        if (data) {
            data = $.isArray(data) ? data : [data];
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                renderSelectItem({ "text": d.text, "value": d.value });
                checkedItem({ "text": d.text, "value": d.value });
            }
        }
    }

    function checkedItem(checked) {
        $(".zy_item").each(function(i, el) {
            var d = $(el).data("data");
            if (d["teas_zygl_jsk.teas_zygl_jsk_id"] == checked.value) {
                $(el).addClass("checked");
            }
        })
    }

    function uncheckedItem(checked) {
        $(".zy_item").each(function(i, el) {
            var d = $(el).data("data");
            if (d["teas_zygl_jsk.teas_zygl_jsk_id"] == checked.value) {
                $(el).removeClass("checked");
            }
        })
    }


}()