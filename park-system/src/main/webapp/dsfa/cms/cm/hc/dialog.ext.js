!function () {
    var auth_status = null,
        userId = null,
        username = null;

    page.event.on("loaded", function (args) {
        //页面初始化完成
        userId = dsf.url.queryString('userId');
        username = dsf.url.queryString('username');
        auth_status = dsf.url.queryString('auth_status');
    });
    window.setCheckedData = function (data, control) {
        var dialog_data = [];
        _.forEach(data, function (val, key) {
            dialog_data.push({
                code: val['dsfa_cms_auth.code'],
                _id: val["dsfa_cms_auth.dsfa_cms_auth_id"],
                _name: val["dsfa_cms_auth.name"],
                treeinfo_globalid: val["dsfa_cms_auth.treeinfo_globalid"],
                treeinfo_icon: val["dsfa_cms_auth.treeinfo_icon"],
                treeinfo_level: val["dsfa_cms_auth.treeinfo_level"],
                treeinfo_pid: val["dsfa_cms_auth.treeinfo_pid"],
                _id:val["dsfa_cms_auth.dsfa_cms_cm_id"]
            })
        })
        page.getControl('cm').value = dialog_data;
    }

    window.getCheckedData = function () {
        var dialog_data = page.getControl('cm').value;
        var subtable_data = [];
        _.forEach(dialog_data, function (val, key) {
            subtable_data.push({
                "dsfa_cms_auth.auth_status": auth_status,
                "dsfa_cms_auth.code": val.code,
                "dsfa_cms_auth.dsfa_oua_user_id": userId,
                "dsfa_cms_auth.name": val._name,
                "dsfa_cms_auth.treeinfo_globalid": val.treeinfo_globalid,
                "dsfa_cms_auth.treeinfo_icon": val.treeinfo_icon,
                "dsfa_cms_auth.treeinfo_level": val.treeinfo_level,
                "dsfa_cms_auth.treeinfo_name": val._name,
                "dsfa_cms_auth.treeinfo_pid": val.treeinfo_pid,
                "dsfa_cms_auth.user_name": username,
                "dsfa_cms_auth.dsfa_cms_cm_id": val._id
            })
        })
        return subtable_data;
    }
}();