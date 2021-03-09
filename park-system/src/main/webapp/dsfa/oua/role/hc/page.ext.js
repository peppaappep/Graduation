!function () {
  page.event.on("loaded", function (args) {
    //页面初始化完成
  });
  window.setCheckedData = function (v) {
    var value = [];
    _.forEach(v, function (item, key) {
      if (!!item["dsfa_oua_role_page.name"] && !!item["dsfa_oua_role_page.dsfa_rm_id"]) {
        value.push({
          _name: item["dsfa_oua_role_page.name"],
          _id: item["dsfa_oua_role_page.dsfa_rm_id"]
        })
      }
    })
    page.getControl('pagePri').value = value;
  }
  window.getCheckedData = function () {
    return page.getControl('pagePri').value;
  }
}();