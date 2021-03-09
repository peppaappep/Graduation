!function () {
    page.event.on("loaded", function (args) {
        //页面初始化完成
    });
    window.setCheckedData = function (v) {
        for (let i in v) {
            v[i]._id = v[i]['dsfa_oua_user_userdept.dsfa_oua_unit_id'];
            v[i]._name = v[i]['dsfa_oua_user_userdept.deptname'];
        }

        page.getControl('deptSelector').value = v;
    }
    window.getCheckedData = function () {
        return page.getControl('deptSelector').value;
    }
}();