!function () {
    page.event.on("loaded", function (args) {
        //页面初始化完成
    });
    window.setCheckedData = function (v) {
        for (let i in v) {
            v[i]._id = v[i]["dsfa_oua_user_menu.dsfa_menu_id"] || v[i]["dsfa_oua_role_menu.dsfa_menu_id"];
            v[i]._name = v[i]["dsfa_oua_user_menu.menuname"] || v[i]["dsfa_oua_role_menu.menuname"];
            v[i].status_text = v[i]["dsfa_oua_user_menu.menustatus"] || v[i]["dsfa_oua_role_menu.menustatus"];
            v[i].level_text = v[i]["dsfa_oua_user_menu.menulevel"] || v[i]["dsfa_oua_role_menu.menulevel"];
        }
        page.getControl('menuselect').value = v;
    }
    window.getCheckedData = function () {
        return page.getControl('menuselect').value;
    }
}();
