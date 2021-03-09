!function () {
    page.event.on("loaded", function (args) {
        //页面初始化完成
    });
    window.setCheckedData = function (v) {
        for (var i in v) {
            v[i]._id = v[i]["dsfa_oua_user_privilege.dsfa_oua_privilege_id"] || v[i]["dsfa_oua_role_privilege.dsfa_oua_privilege_id"];
            v[i]._name = v[i]["dsfa_oua_user_privilege.privilegename"] || v[i]["dsfa_oua_role_privilege.privilegename"];
            v[i].status_text = v[i]["dsfa_oua_user_privilege.privilegestatus"] || v[i]["dsfa_oua_role_privilege.privilegestatus"];
            v[i].level_text = v[i]["dsfa_oua_user_privilege.privilegelevel"] || v[i]["dsfa_oua_role_privilege.privilegelevel"];
        }
        page.getControl('priSelector').value = v;
    }
    window.getCheckedData = function () {
        return page.getControl('priSelector').value;
    }
}();