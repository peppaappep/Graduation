! function () {
    var DataGrid1 = null,
        loadIndex = null;
    page.event.on("loaded", function (args) {
        //页面初始化完成
        DataGrid1 = page.getControl('DataGrid1');
        DataGrid1.event.on('buttonbar_click', function (args) {
            if (args.actionName == 'fpjs') {
                var user_d = DataGrid1.getCheckedData();
                if (user_d.length > 0) {
                    dsf.layer.openDialog({
                        title: '请选择',
                        area: ['1000px', '650px'],
                        content: dsf.url.getWebPath('dsfa/oua/role/views/fp_role.html'),
                        btn: [{
                            "text": "确定",
                            "handler": function handler(index, layero, win) {
                                var role_d = win.page.getControl('RoleSelector').value;
                                if (role_d.length == 0) {
                                    dsf.layer.message("请先选择角色", false);
                                    return false;
                                }
                                var userIds = [];
                                var roleIds = [];
                                _.forEach(role_d, function (val, key) {
                                    roleIds.push(val._id);
                                })
                                _.forEach(user_d, function (val, key) {
                                    userIds.push(val._id);
                                })
                                var loadIndex = dsf.layer.loadding(true);
                                var param = {
                                    userIds: userIds.join(','),
                                    roleIds: roleIds.join(',')
                                }
                                dsf.http.request(dsf.url.getWebPath("oua/saveBatchUserRole"), param, "post")
                                    .done(function (response) {
                                        if (response.success) {
                                            dsf.layer.close(index);
                                            if (window.self && window.self.top && window.self.top.layui) {
                                                window.self.top.layui.layer.close(index)
                                            }
                                        } else if (response.state == '20001') {
                                            dsf.layer.message("分配角色失败", false);
                                        } else {
                                            dsf.layer.message(response.message, false);
                                        }
                                    })
                                    .error(function (response) {
                                        dsf.layer.message(response.responseJSON.message, false);
                                    })
                                    .always(function () {
                                        dsf.layer.close(loadIndex, true);
                                        return false;
                                    })
                                    .exec();
                                return false;
                            }
                        }, {
                            "text": "取消",
                            "handler": function handler(index, layero, win) {
                                return true;
                            }
                        }]
                    });
                } else {
                    dsf.layer.message("请先选择用户", false);
                }
            } else if (args.actionName == 'delUser') {
                dsf.layer.confirm("确定要删除吗?", function () {
                    var user_d = DataGrid1.getCheckedData();
                    if (user_d.length > 0) {
                        var userIds = [];
                        _.forEach(user_d, function (val, key) {
                            userIds.push(val._id);
                        })
                        var loadIndex = dsf.layer.loadding(true);
                        var param = {
                            userIds: userIds.join(','),
                        }
                        dsf.http.request(dsf.url.getWebPath("oua/deleteUser"), param, "post")
                            .done(function (response) {
                                if (response.success == true) {
                                    dsf.layer.message("删除成功！", true);
                                    page.event.trigger('ready');
                                } else {
                                    dsf.layer.message(response.message, false);
                                }
                            })
                            .error(function (response) {
                                dsf.layer.message(response.responseJSON.message, false);
                            })
                            .always(function () {
                                dsf.layer.close(loadIndex, true);
                            }).exec();
                    }
                });
            }
        });
        DataGrid1.event.on("row_buttonbar_click", function (button) {
            if (button.actionName == 'delUser') {
                dsf.layer.confirm("确定要删除吗?", function () {
                    var loadIndex = dsf.layer.loadding();
                    var param = new Object();
                    param.userIds = button.data["_id"];
                    dsf.http.request(dsf.url.getWebPath("oua/deleteUser"), param, "post")
                        .done(function (response) {
                            if (response.success == true) {
                                dsf.layer.message("删除成功！", true);
                                page.event.trigger('ready');
                            } else {
                                dsf.layer.message(response.message, false);
                            }
                        })
                        .error(function (response) {
                            dsf.layer.message(response.responseJSON.message, false);
                        })
                        .always(function () {
                            dsf.layer.close(loadIndex, true);
                        }).exec();
                });
            }
        });

        /**
         * 读取excel
         * 预导入验证
         * 导入
         */
        DataGrid1.event.on("uploadDone", function (args) {
			debugger;
			
            console.log(args)
            var ydrlbControl = null,
                excel_data = args.data.array;

            loadIndex = dsf.layer.loadding();

            dsf.layer.openDialog({
                title: '预导入列表验证',
                area: ["1200px", "620px"],
                content: dsf.url.getWebPath('dsfa/oua/user/views/importdialog.html'),
                dialogLoaded: function (layero, index, win) {
                    win.page.event.on("loaded", function (evt) {
                        ydrlbControl = win.page.getControl('ydrlb');
                        /** 
                         * sex_obj：性别词典
                         * title_obj：职称词典
                         * rank_obj：职级词典
                         * status_obj：状态词典
                         */
                        var sex_obj = {},
                            title_obj = {},
                            rank_obj = {},
                            status_obj = {};

                        var dataSourceData = ydrlbControl._root._initData.dataSourceData;
                        _.forEach(dataSourceData['dsfa_oua_user_ydrlb.sex'], function (val, key) {
                            sex_obj[val.text] = val;
                        })
                        _.forEach(dataSourceData['dsfa_oua_user_ydrlb.title'], function (val, key) {
                            title_obj[val.text] = val;
                        })
                        _.forEach(dataSourceData['dsfa_oua_user_ydrlb.rank'], function (val, key) {
                            rank_obj[val.text] = val;
                        })
                        _.forEach(dataSourceData['dsfa_oua_user_ydrlb.status'], function (val, key) {
                            status_obj[val.text] = val;
                        })
                        if (ydrlbControl && excel_data && excel_data.length > 0) {
                            _.forEach(excel_data, function (item, i) {
                                console.log(item)
                                var obj = {
                                    "dsfa_oua_user_ydrlb.username": item[1] || '',
                                    "dsfa_oua_user_ydrlb.sex": sex_obj[item[2]] || {
                                        text: '',
                                        value: ''
                                    },
                                    "dsfa_oua_user_ydrlb.loginname": item[3] || '',
                                    "dsfa_oua_user_ydrlb.phone": item[4] || '',
                                    "dsfa_oua_user_ydrlb.status": status_obj[item[5]] || {
                                        text: '',
                                        value: ''
                                    },
                                    "dsfa_oua_user_ydrlb.rank": rank_obj[item[6]] || {
                                        text: '',
                                        value: ''
                                    },
                                    "dsfa_oua_user_ydrlb.title": title_obj[item[7]] || {
                                        text: '',
                                        value: ''
                                    },
									
                                    "dsfa_oua_user_ydrlb.post": item[8] || '',
									 "dsfa_oua_user_ydrlb.pxm": item[9] || '',
                                    "dsfa_oua_user_ydrlb.deptLevelOne": item[10] || '',
                                    "dsfa_oua_user_ydrlb.deptLevelTwo": item[11] || '',
                                    "dsfa_oua_user_ydrlb.deptLevelThree": item[12] || '',
                                    "dsfa_oua_user_ydrlb.deptLevelFour": item[13] || ''
                                }
                                ydrlbControl.value.push(obj);
                            });
                            ydrlbControl.reload();
                        }

                        regFun(ydrlbControl, loadIndex, win, excel_data);

                        ydrlbControl.event.on(SubTableEvent.UPDATEDATA, function (args) {
                            // 子表数据变化事件，验证
                            if (args.ui == undefined) {
                                regFun(ydrlbControl, true, win, excel_data);
                            }
                        });
                        ydrlbControl.event.on(SubTableEvent.ENDEDIT, function (args) {
                            // 子表行编辑完成，验证
                            regFun(ydrlbControl, true, win, excel_data);
                        });
                    });
                },
                btn: [{
                    "text": "导入并生成账号",
                    "handler": function (index, layero, win) {
                        if (!ydrlbControl) {
                            dsf.layer.message("页面还在加载中请稍候", false);
                            return false;
                        }
                        var ds_row_error = ydrlbControl.element.find('.ds_row_error');
                        if (ds_row_error.length > 0) {
                            var error_index = "";
                            _.forEach(ds_row_error, function (elem, key) {
                                key = $(elem).attr('row-index') * 1 + 1;
                                if (error_index == '') {
                                    error_index = key;
                                } else {
                                    error_index += "," + key;
                                }
                            })
                            dsf.layer.confirm("第" + error_index + "行数据格式存在问题，请检查！", ['知道啦']);
                            return false;
                        }
                        if (isError) {
                            dsf.layer.message("与已存在的用户验证失败，请刷新页面重新导入！", false);
                            return false;
                        }
                        if (ydrlbControl.value.length == 0) {
                            dsf.layer.message("请导入正确的Excel", false);
                            return false;
                        }
                        var data = [];
                        _.forEach(ydrlbControl.value, function (val, key) {
                            data.push({
                                "username": val["dsfa_oua_user_ydrlb.username"] || '',
                                "sex": val["dsfa_oua_user_ydrlb.sex"] || {
                                    text: '',
                                    value: ''
                                },
                                "loginname": val["dsfa_oua_user_ydrlb.loginname"] || '',
                                "phone": val["dsfa_oua_user_ydrlb.phone"] || '',
                                "status": val["dsfa_oua_user_ydrlb.status"] || {
                                    text: '',
                                    value: ''
                                },
                                "rank": val["dsfa_oua_user_ydrlb.rank"] || {
                                    text: '',
                                    value: ''
                                },
                                "title": val["dsfa_oua_user_ydrlb.title"] || {
                                    text: '',
                                    value: ''
                                },
                                "post": val["dsfa_oua_user_ydrlb.post"] || '',
								"pxm":val["dsfa_oua_user_ydrlb.pxm"] || '',
                                "deptLevelOne": val["dsfa_oua_user_ydrlb.deptLevelOne"] || '',
                                "deptLevelTwo": val["dsfa_oua_user_ydrlb.deptLevelTwo"] || '',
                                "deptLevelThree": val["dsfa_oua_user_ydrlb.deptLevelThree"] || '',
                                "deptLevelFour": val["dsfa_oua_user_ydrlb.deptLevelFour"] || ''
                            })
                        });
                        loadIndex = dsf.layer.loadding(true);
                        dsf.http.request(dsf.url.getWebPath("oua/userImport"), {
                            useList: JSON.stringify(data)
                        }, "post")
                            .done(function (response) {
                                console.log(response)
                                if (response.success) {
                                    DataGrid1._root.event.trigger(PageEvent.READY);
                                    setTimeout(function () {
                                        dsf.layer.message("导入成功", true);
                                    }, 600);
                                    if (window.top && window.top.layer) {
                                        window.top.layer.close(window.top.layer.getFrameIndex(win.name));
                                    }
                                } else if (response.state == '20001') {
                                    dsf.layer.message("未导入成功", false);
                                } else if (response.state == '23004') {
                                    var data = [];
                                    _.forEach(response.data, function (val, key) {
                                        data.push({
                                            "dsfa_oua_user_ydrlb.username": val.username,
                                            "dsfa_oua_user_ydrlb.sex": val.sex,
                                            "dsfa_oua_user_ydrlb.loginname": val.loginname,
                                            "dsfa_oua_user_ydrlb.phone": val.phone,
                                            "dsfa_oua_user_ydrlb.status": val.status,
                                            "dsfa_oua_user_ydrlb.rank": val.rank,
                                            "dsfa_oua_user_ydrlb.title": val.title,
                                            "dsfa_oua_user_ydrlb.post": val.post,
                                            "dsfa_oua_user_ydrlb.deptLevelOne": val.deptLevelOne,
                                            "dsfa_oua_user_ydrlb.deptLevelTwo": val.deptLevelTwo,
                                            "dsfa_oua_user_ydrlb.deptLevelThree": val.deptLevelThree,
                                            "dsfa_oua_user_ydrlb.deptLevelFour": val.deptLevelFour
                                        });
                                    })
                                    ydrlbControl.value = data;
                                    ydrlbControl.reload();
                                    _.forEach(response.data, function (val, key) {
                                        ydrlbControl.showErrorRow(key, {errorMsg:val.msg});
                                    });
                                } else {
                                    dsf.layer.message(response.message, false);
                                }
                            })
                            .error(function (response) {
                                dsf.layer.message(response.responseJSON.message, false);
                            })
                            .always(function () {
                                dsf.layer.close(loadIndex, true);
                            })
                            .exec();
                        return false;
                    }
                }, {
                    "text": "关闭",
                    "handler": function (index, layero, win) {
                        dsf.layer.close(loadIndex, true);
                        return true;
                    }
                }]
            });
        });
    });

    // 读取Excel的预导入页面的数据验证
    function regFun(ctr, loadIndex, win, _data) {
        console.log(ctr)
        var data = ctr.value;
        var errorData = [];
        isError = false;
        for (var i in data) {
            ctr.hideErrorRow(i);
            var errorMsg = "";
            var obj = data[i];
            var _obj = _data[i];
            // 姓名
            if (!obj["dsfa_oua_user_ydrlb.username"] || obj["dsfa_oua_user_ydrlb.username"] == '') {
                if (errorMsg != '') {
                    errorMsg += "、姓名不能为空";
                } else {
                    errorMsg = '姓名不能为空';
                }
            }
            // 性别
            if (_obj[2] && _obj[2] != '' && (obj['dsfa_oua_user_ydrlb.sex'] == '' || obj['dsfa_oua_user_ydrlb.sex'].value == '')) {
                errorMsg += (errorMsg != '' ? '、' : '') + "性别导入数据不正确";
            }
            // 登录名
            if (!obj["dsfa_oua_user_ydrlb.loginname"] || obj["dsfa_oua_user_ydrlb.loginname"] == '') {
                if (errorMsg != '') {
                    errorMsg += "、登录名不能为空";
                } else {
                    errorMsg = '登录名不能为空';
                }
            } else {
                var name_state = 0;
                ctr.value.filter(function (value, index) {
                    if (value["dsfa_oua_user_ydrlb.loginname"] == obj["dsfa_oua_user_ydrlb.loginname"] && i != index) {
                        name_state++;
                        if (errorMsg != '') {
                            if (name_state == 1) {
                                errorMsg += ('登录名与第' + (index + 1) + '行')
                            } else {
                                errorMsg += ('、第' + (index + 1) + '行');
                            }
                        } else {
                            errorMsg = ('登录名与第' + (index + 1) + '行');
                        }
                    }
                });
                if (name_state > 0) {
                    errorMsg += "重复"
                }
            }

            // 手机号处理---start

            if (!obj["dsfa_oua_user_ydrlb.phone"] || obj["dsfa_oua_user_ydrlb.phone"] == '') {
                if (errorMsg != '') {
                    errorMsg += "、手机号不能为空";
                } else {
                    errorMsg = '手机号不能为空';
                }
            } else if (!(/^1\d{10}$/.test(obj["dsfa_oua_user_ydrlb.phone"]))) {
                if (errorMsg != '') {
                    errorMsg += "、手机号格式不正确";
                } else {
                    errorMsg = '手机号格式不正确';
                }
            } else {
                var cf_state = 0;
                ctr.value.filter(function (value, index) {
                    if (value["dsfa_oua_user_ydrlb.phone"] == obj["dsfa_oua_user_ydrlb.phone"] && i != index) {
                        cf_state++;
                        if (errorMsg != '') {
                            if (cf_state == 1) {
                                errorMsg += ('、手机号与第' + (index + 1) + '行')
                            } else {
                                errorMsg += ('、第' + (index + 1) + '行');
                            }
                        } else {
                            errorMsg = ('手机号与第' + (index + 1) + '行');
                        }
                    }
                });
                if (cf_state > 0) {
                    errorMsg += "重复"
                }
            }
            // 手机号处理---end
            // 状态
            if (_obj[5] && _obj[5] != '' && (obj['dsfa_oua_user_ydrlb.status'] == '' || obj['dsfa_oua_user_ydrlb.status'].value == '')) {
                errorMsg += (errorMsg != '' ? '、' : '') + "状态导入数据不正确";
            }
            // 职级
            if (_obj[6] && _obj[6] != '' && (obj['dsfa_oua_user_ydrlb.rank'] == '' || obj['dsfa_oua_user_ydrlb.rank'].value == '')) {
                errorMsg += (errorMsg != '' ? '、' : '') + "职级导入数据不正确";
            }
            // 职称
            if (_obj[7] && _obj[7] != '' && (obj['dsfa_oua_user_ydrlb.title'] == '' || obj['dsfa_oua_user_ydrlb.title'].value == '')) {
                errorMsg += (errorMsg != '' ? '、' : '') + "职称导入数据不正确";
            }
            // 一级部门
            if (!obj["dsfa_oua_user_ydrlb.deptLevelOne"] || obj["dsfa_oua_user_ydrlb.deptLevelOne"] == '') {
                if (errorMsg != '') {
                    errorMsg += "、一级部门不能为空";
                } else {
                    errorMsg = '一级部门不能为空';
                }
            }

            if (errorMsg != '') errorData.push({
                index: i,
                errorMsg: {
                    errorMsg: errorMsg
                }
            });
        }

        _.forEach(errorData, function (obj, i) {
            obj.errorMsg.errorMsg = '检测结果：' + obj.errorMsg.errorMsg;
            ctr.showErrorRow(obj.index, obj.errorMsg)
        })

        var msg = "共" + ctr.value.length + "条记录 正确数据" + (ctr.value.length - ctr.element.find("tr.error_row").length) + "条 错误数据" + ctr.element.find("tr.error_row").length + "条。<span class='error_row'>上传前请检测是否有空行</span>";
        var _ds_sub_table = ctr.element.find(".ds_sub_table");
        if (_ds_sub_table.find("caption").length == 0) {
            var caption = $("<caption>");
            caption.html(msg);
            _ds_sub_table.prepend(caption);
        } else {
            _ds_sub_table.find("caption").html(msg);
        }

        dsf.layer.close(loadIndex);
    }

}();