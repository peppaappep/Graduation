!function () {
    page.event.on("loaded", function (args) {
        //页面初始化完成
    });
    window.setCheckedData = function (v) {
        for (let i in v) {
            v[i]._id = v[i]['dsfa_oua_user_role.dsfa_oua_role_id'];
            v[i]._name = v[i]['dsfa_oua_user_role.rolename'];
            v[i].status_text = v[i]['dsfa_oua_user_role.rolestatus'];
            v[i].level_text = v[i]['dsfa_oua_user_role.rolelevel'];
        }
        page.getControl('RoleSelector').value = v;
    }
    window.getCheckedData = function () {
        return page.getControl('RoleSelector').value;
    }
}();