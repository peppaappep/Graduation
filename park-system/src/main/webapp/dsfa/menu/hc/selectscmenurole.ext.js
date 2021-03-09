!function(){
    var selectscMenu = null;
    page.event.on("loaded", function (args) {
        //页面初始化完成
        selectscMenu = page.getControl("selectscMenu");
    });
    window.getCheckedData = function () {
        var value = [];
        for (var i in selectscMenu.value) {
            var obj = selectscMenu.value[i];
            value.push({
                "dsfa_oua_role_scmenu.dsfa_menu_id": obj._id,
                "dsfa_oua_role_scmenu.name": obj._name,
                "dsfa_oua_role_scmenu.scicon": obj.scicon,
                "dsfa_oua_role_scmenu.ds_order": i * 1 + 1
            })
        }
        return value;
    }
    window.setCheckedData = function (data) {
        var value = [];
        for (var i in data) {
            var obj = data[i];
            value.push({
                _id: obj["dsfa_oua_role_scmenu.dsfa_menu_id"],
                _name: obj["dsfa_oua_role_scmenu.name"],
                scicon: obj["dsfa_oua_role_scmenu.scicon"]
            })
        }
        page.getControl("selectscMenu").value = value;
    }
}();