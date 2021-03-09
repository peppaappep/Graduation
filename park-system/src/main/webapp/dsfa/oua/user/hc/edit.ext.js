! function() {
    var role = null;
    var pri = null;
    var menu = null;
    var unit = null;
    var userdept = null;
    var IdCtrl = null;
    var birthCtrl = null;
    var formatTime = null;
    page.event.on("loaded", function(args) {
        //页面初始化完成
        unit = page.getControl('userdept');
        var deptid = dsf.url.queryString("deptid");
        var deptname = dsf.url.queryString("deptname");
        if (deptid && deptname) {
            var mydata = {};
            mydata['dsfa_oua_user_userdept.dsfa_oua_unit_id'] = deptid;
            mydata['dsfa_oua_user_userdept.deptname'] = deptname;
            mydata['dsfa_oua_user_userdept.ismain'] = { text: '是', value: '1' };
            unit.value.push(mydata);
            unit.reload();
        }

        userdept = page.getControl("userdept");

        // 角色信息
        role = page.getControl('role');
        if (role) {
            role.event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (let i in d.data) {
                        let repeat = d.ui.value.filter(function(value, index) {
                            return value['dsfa_oua_user_role.dsfa_oua_role_id'] == d.data[i]._id;
                        });
                        if (repeat.length == 0) {
                            let obj = {};
                            obj['dsfa_oua_user_role.dsfa_oua_role_id'] = d.data[i]._id;
                            obj['dsfa_oua_user_role.rolename'] = d.data[i]._name;
                            obj['dsfa_oua_user_role.rolestatus'] = d.data[i].status_text;
                            obj['dsfa_oua_user_role.rolelevel'] = d.data[i].level_text;
                            d.ui.value.push(obj);
                           
                        }
                    }
                    d.ui.reload();
                }
                updateRoleByDept();
            });
        }
        // 权限信息
        pri = page.getControl('privilege');
        if (pri) {
            pri.event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (let i in d.data) {
                        let repeat = d.ui.value.filter(function(value, index) {
                            return value["dsfa_oua_user_privilege.dsfa_oua_privilege_id"] == d.data[i]._id;
                        });
                        if (repeat.length == 0) {
                            let obj = {};
                            obj["dsfa_oua_user_privilege.dsfa_oua_privilege_id"] = d.data[i]._id;
                            obj["dsfa_oua_user_privilege.privilegename"] = d.data[i]._name;
                            obj["dsfa_oua_user_privilege.privilegestatus"] = d.data[i].status_text;
                            obj["dsfa_oua_user_privilege.privilegelevel"] = d.data[i].level_text;
                            d.ui.value.push(obj);
                        }
                    }
                    d.ui.reload();
                }
            });
        }
        // 菜单信息
        menu = page.getControl('menu');
        if (menu) {
            menu.event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (let i in d.data) {
                        let repeat = d.ui.value.filter(function(value, index) {
                            return value["dsfa_oua_user_menu.dsfa_menu_id"] == d.data[i]._id;
                        });
                        if (repeat.length == 0) {
                            let obj = {};
                            obj["dsfa_oua_user_menu.dsfa_menu_id"] = d.data[i]._id;
                            obj["dsfa_oua_user_menu.menuname"] = d.data[i]._name;
                            obj["dsfa_oua_user_menu.menustatus"] = d.data[i].status_text;
                            obj["dsfa_oua_user_menu.menulevel"] = d.data[i].level_text;
                            d.ui.value.push(obj);
                            
                        }
                    }
                    d.ui.reload();
                }
            });
        }
        // 部门信息
        if (unit) {
            unit.event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (let i in d.data) {
                        let repeat = d.ui.value.filter(function(value, index) {
                            return value['dsfa_oua_user_userdept.dsfa_oua_unit_id'] == d.data[i]._id;
                        });
                        if (repeat.length == 0) {
                            let obj = {};
                            obj['dsfa_oua_user_userdept.dsfa_oua_unit_id'] = d.data[i]._id;
                            obj['dsfa_oua_user_userdept.deptname'] = d.data[i]._name;
                            obj['dsfa_oua_user_userdept.ismain'] = { text: '否', value: '0' };
                            d.ui.value.push(obj);
                        }
                    }
                    d.ui.reload();
                }
            });
        }

        //通过部门数据刷新角色数据选项
        updateRoleByDept();
        //绑定部门子表刷新数据事件
        userdept.event.on("subtable_updatedata", function(args) {
            updateRoleByDept();
        })
        IdCtrl = page.getControl('ID');
        birthCtrl = page.getControl('birthday');
        IdCtrl.event.on(FormControlEvent.VALUECHANGE,function(args){
            var birthdayVal = getBirthdayFromIdCard(args.ui.value);
            birthCtrl.value = birthdayVal;
        })
    });

    page.event.on("save_before", function(ui, def) {
        try {
            let username = page.getControl('name').value;
            let userrank = page.getControl('rank').value.text;
            let userstatus = page.getControl('status').value.text;
            if (role) {
                for (let i in role.value) {
                    let obj = role.value[i];
                    obj['dsfa_oua_user_role.username'] = username;
                    obj['dsfa_oua_user_role.userrank'] = userrank;
                    obj['dsfa_oua_user_role.userstatus'] = userstatus;
                }
                role.reload();
            }
            if (pri) {
                for (let i in pri.value) {
                    let obj = pri.value[i];
                    obj['dsfa_oua_user_privilege.username'] = username;
                    obj['dsfa_oua_user_privilege.userrank'] = userrank;
                    obj['dsfa_oua_user_privilege.userstatus'] = userstatus;
                    obj['dsfa_oua_user_privilege.source'] = '手选';
                }
                pri.reload();
            }
            if (menu) {
                for (let i in menu.value) {
                    let obj = menu.value[i];
                    obj['dsfa_oua_user_menu.username'] = username;
                    obj['dsfa_oua_user_menu.userrank'] = userrank;
                    obj['dsfa_oua_user_menu.userstatus'] = userstatus;
                    obj['dsfa_oua_user_menu.source'] = '手选';
                }
                menu.reload();
            }


            if (unit) {
                let ismain = false;
                for (let i in unit.value) {
                    let obj = unit.value[i];
                    obj['dsfa_oua_user_userdept.username'] = username;
                    obj['dsfa_oua_user_userdept.userrank'] = userrank;
                    obj['dsfa_oua_user_userdept.userstatus'] = userstatus;

                    if (obj['dsfa_oua_user_userdept.ismain'] && obj['dsfa_oua_user_userdept.ismain'].value == '1') {
                        if (!ismain) {
                            ismain = true;
                        } else {
                            dsf.layer.message("部门信息中有且只能有一个主部门", false);
                            def.reject();
                        }
                    }
                }
                unit.reload();


                if (!ismain) {
                    dsf.layer.message("部门信息未设置主部门", false);
                    def.reject();
                }
            }

            def.resolve();
        } catch (ex) {
            dsf.layer.message("保存出现错误", false);
            def.reject();
        }

    });


    function updateRoleByDept() {
        //如果数据中没有主部门强行修改第一个部门为主部门
        let result = userdept.value.filter(function(v) {
            return v["dsfa_oua_user_userdept.ismain"].value == "1"
        });
        if (result.length <= 0 && userdept.value.length > 0) {
            userdept.value[0]["dsfa_oua_user_userdept.ismain"] = { "text": "是", "value": "1" };
            userdept.reload();
            return;
        }

        //获取部门信息子表数据
        // var deptRows = page.getControl("userdept");
        var items = [];
        for (var i = 0; i < userdept.value.length; i++) {
            var item = {
                "text": userdept.value[i]["dsfa_oua_user_userdept.deptname"],
                "value": userdept.value[i]["dsfa_oua_user_userdept.dsfa_oua_unit_id"],
            }
            items.push(item);
        }
        //获取角色子表的行
        var rows = role.rows;
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i].findControls("[ds-data-bind='dsfa_oua_user_role.dept']");
            role.beginEditor(i);
            if (r.length > 0) {
                var select = r[0];
                select.items = items;
                var selectValue = select.value || {};
                var value = select.items.filter(function(v) {
                    return v.value == selectValue.value;
                });
                //如果选中的值还在枚举中则使用选中值，否则强制变更为主部门
                if (value.length > 0 && value[0].value) {
                    select.value = value[0];
                } else if (result.length > 0) {
                    select.value = { "text": result[0]["dsfa_oua_user_userdept.deptname"], "value": result[0]["dsfa_oua_user_userdept.dsfa_oua_unit_id"] }
                } else {
                    select.value = ""
                }
            }
            role.endEditor();
        }

    }
    function getBirthdayFromIdCard(idCard,format) {  
        var birthday = "";  
        if(idCard != null && idCard != ""){  
            if(idCard.length == 15){  
                birthday = "19"+idCard.substr(6,6);  
            } else if(idCard.length == 18){  
                birthday = idCard.substr(6,8);  
            } 
            birthday = birthday.replace(/(.{4})(.{2})(.{2})/,"$1-$2-$3");  
        }  
          
        return birthday;  
      }

   
}();