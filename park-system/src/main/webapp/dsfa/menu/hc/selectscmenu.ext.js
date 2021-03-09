!function () {
    var scSelecter = null;
    page.event.on("loaded", function (args) {
        //页面初始化完成
        scSelecter = page.getControl("scSelecter");
    });
    window.getCheckedData = function () {
        var value = [];
        for (var i in scSelecter.value) {
            var obj = scSelecter.value[i];
            value.push({
                "dsfa_oua_user_scmenu.dsfa_menu_id": obj._id,
                "dsfa_oua_user_scmenu.name": obj._name,
                "dsfa_oua_user_scmenu.scicon": obj.scicon,
                "dsfa_oua_user_scmenu.ds_order": i * 1 + 1
            })
        }
        return value;
    }
    window.setCheckedData = function (data) {
        var value = [];
        for (var i in data) {
            var obj = data[i];
            value.push({
                _id: obj["dsfa_oua_user_scmenu.dsfa_menu_id"],
                _name: obj["dsfa_oua_user_scmenu.name"],
                scicon: obj["dsfa_oua_user_scmenu.scicon"]
            })
        }
        page.getControl("scSelecter").value = value;
    }
}();