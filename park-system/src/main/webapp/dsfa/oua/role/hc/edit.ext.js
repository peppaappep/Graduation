! function() {
    var pri = null;
    var menu = null;
    var role = null;
    var pagePri = null;
    page.event.on("loaded", function(args) {
        //页面初始化完成

        // 功能权限范围
        pri = page.getControl('privilege');
        if (pri) {
            pri.event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (var i in d.data) {
                        var repeat = d.ui.value.filter(function(value, index) {
                            return value["dsfa_oua_role_privilege.dsfa_oua_privilege_id"] == d.data[i]._id;
                        });
                        if (repeat.length == 0) {
                            var obj = {};
                            obj["dsfa_oua_role_privilege.dsfa_oua_privilege_id"] = d.data[i]._id;
                            obj["dsfa_oua_role_privilege.privilegename"] = d.data[i]._name;
                            obj["dsfa_oua_role_privilege.privilegestatus"] = d.data[i].status_text;
                            obj["dsfa_oua_role_privilege.privilegelevel"] = d.data[i].level_text;
                            d.ui.value.push(obj);
                        }
                    }
                    d.ui.reload();
                }
            });
        }
        // 菜单权限范围
        menu = page.getControl('menu');
        if (menu) {
            menu.event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (var i in d.data) {
                        var repeat = d.ui.value.filter(function(value, index) {
                            return value["dsfa_oua_role_menu.dsfa_menu_id"] == d.data[i]._id;
                        });
                        if (repeat.length == 0) {
                            var obj = {};
                            obj["dsfa_oua_role_menu.dsfa_menu_id"] = d.data[i]._id;
                            obj["dsfa_oua_role_menu.menuname"] = d.data[i]._name;
                            obj["dsfa_oua_role_menu.menustatus"] = d.data[i].status_text;
                            obj["dsfa_oua_role_menu.menulevel"] = d.data[i].level_text;
                            d.ui.value.push(obj);
                        }
                    }
                    d.ui.reload();
                }
            });
        }

        role = page.getControl("role");
        if (role) {
            role.event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (var i = 0; i < d.data.length; i++) {
                        var atts = d.data[i].Atts;
                        var parentAtts=d.data[i].parentAtts;
                        var repeat = d.ui.value.filter(function(value, index) {
                            //判断部门ID和用户ID的唯一性
                            var deptId=value["dsfa_oua_user_role.dept"]?value["dsfa_oua_user_role.dept"].value:"";
                            var userId=value["dsfa_oua_user_role.dsfa_oua_user_id"]?value["dsfa_oua_user_role.dsfa_oua_user_id"]:"";
                            return deptId == parentAtts.ID && userId == atts.ID;
                        });
                        if (repeat.length <= 0) {
                            var obj = {};
                            obj["dsfa_oua_user_role.dsfa_oua_user_id"] = atts.ID;
                            obj["dsfa_oua_user_role.username"] = atts.NAME;
                            obj["dsfa_oua_user_role.userrank"] = atts.rank_text;
                            obj["dsfa_oua_user_role.userstatus"] = "有效";
                            obj["dsfa_oua_user_role.dept"] = { "text": parentAtts.NAME, "value": parentAtts.ID };
                            d.ui.value.push(obj);
                        }
                    }
                    d.ui.reload();
                }

            });
        }

        // 页面权限范围
        pagePri = page.getControl('page');
        if (pagePri) {
            pagePri.event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (var i in d.data) {
                        var repeat = d.ui.value.filter(function(value, index) {
                            return value["dsfa_oua_role_page.dsfa_rm_id"] == d.data[i]._id;
                        });
                        if (repeat.length == 0) {
                            var obj = {};
                            obj["dsfa_oua_role_page.dsfa_rm_id"] = d.data[i]._id;
                            obj["dsfa_oua_role_page.name"] = d.data[i]._name;
                            obj["dsfa_oua_role_page.path"] = d.data[i].path;
                            d.ui.value.push(obj);
                        }
                    }
                    d.ui.reload();
                }
            });
        }
    });


    page.event.on("save_before", function(ui, def) {
        try {
            var name = page.getControl('name').value;
            var level_v = page.getControl('level').value;
            var level_t = "";
            _.forEach(level_v,function(val,key){
                if (level_t != '') {
                    level_t += ',';
                }
                level_t += val.text;
            })

            var status = page.getControl('status').value.text;

            if (pri) {
                for (var i in pri.value) {
                    var obj = pri.value[i];
                    obj['dsfa_oua_role_privilege.rolename'] = name;
                    obj['dsfa_oua_role_privilege.rolestatus'] = status;
                    obj['dsfa_oua_role_privilege.rolelevel'] = level_t;
                }
                pri.reload();
            }
            if (menu) {
                for (var j in menu.value) {
                    var obj = menu.value[j];
                    obj['dsfa_oua_role_menu.rolename'] = name;
                    obj['dsfa_oua_role_menu.rolestatus'] = status;
                    obj['dsfa_oua_role_menu.rolelevel'] = level_t;
                }
                menu.reload();
            }

            if (role) {
                for (var y in role.value) {
                    var obj = role.value[y];
                    obj['dsfa_oua_user_role.rolename'] = name;
                    obj['dsfa_oua_user_role.rolestatus'] = status;
                    obj['dsfa_oua_user_role.rolelevel'] = level_t;
                }
                role.reload();
            }

            def.resolve();
        } catch (ex) {
            dsf.layer.message("保存出现错误", false);
            def.reject();
        }

    });



}();