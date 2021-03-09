var tableResult, tabs, selectTab = 0,
    module = "assign",
    rangeType = 11;
var table0, positionParams, table0Loaded, positionParamsLoaded;
var peopleUL, peopleULLoaded, table1, table1Loaded, peopleParams, peopleParamsLoaded;
var orgUL, orgULLoaded, flowPositionUL, table2, table2Loaded, orgExpression, orgParams, orgParamsLoaded;
var table3, table3Loaded, peopleRelationUL, peopleRelationULLoaded, peopleRelationParams, peopleRelationParamsLoaded, peopleParams41, peopleParams41Loaded;

var _isNewFlow = parent.document.URL.indexOf("flow_index.html") > 0 ? true : false;

function init() {
    debugger;
    tableResult = $('#tableResult'), tabs = $('#tabs');
    table0 = $('#table0'), positionParams = $("#positionParams");
    peopleUL = $("#peopleUL"), table1 = $("#table1"), peopleParams = $("#peopleParams");
    orgUL = $("#orgUL"), flowPositionUL = $("#flowPositionUL"), table2 = $("#table2"), orgExpression = $("#orgExpression"), orgParams = $("#orgParams");
    table3 = $("#table3"), peopleRelationUL = $("#peopleRelationUL"), peopleRelationParams = $("#peopleRelationParams"), peopleParams41 = $("#peopleParams41");
    inittableResult();
    initTabs();
    initAssignDataForPosition();
    fillParamsData();
    var rangeRule = getRangeRule();
    if (rangeRule.IsUser == "1") {
        $("#tab" + selectTab).find(".toPeople").prop("checked", true);
    }
}

function updateRolePanel() {
    var name = $("#dapartrole").val();
    if (name && !orgULLoaded) {
        var queryData = [];
        getFlowPosition(function(data2) {
            var treeNodes = data2;
            for (var j = 0; j < treeNodes.length; j++) {
                var itemData = filterTree(treeNodes[j], function(node) {
                    if (node.text.indexOf(name) != -1) return true;
                    return false;
                });
                if (itemData) {
                    queryData.push(itemData);
                }
                flowPositionUL.tree({
                    animate: true,
                    data: queryData
                });
            }
        });

    } else {
        getFlowPosition(function(data2) {
            flowPositionUL.tree({
                animate: true,
                data: data2
            });
        });
    }
}


function getRangeRule() {
    var result = null;
    var data = dialogArgs.data;
    if (data) {
        result = data;
    } else {
        result = getOpenNodeValue(row, nodeObj);
    }
    return result;
}

function fillParamsData() {
    var rangeRule = getRangeRule();
    if (!rangeRule) return;
    var type = rangeRule.Type;
    rangeType = type;
    var rows = [];
    if (!rangeRule.RuleList) {
        return;
    }
    if (rangeRule.RuleList.Rule) {
        if (!$.isArray(rangeRule.RuleList.Rule)) {
            rangeRule.RuleList.Rule = [rangeRule.RuleList.Rule];
        }
    } else {
        rangeRule.RuleList.Rule = [];
    }
    //会写JS吗？什么傻逼判断，能不能用点脑子？
    // else if (rangeRule.RuleList.Rule && !rangeRule.RuleList.Rule.length) {
    //     rangeRule.RuleList.Rule = [rangeRule.RuleList.Rule];
    // }

    for (var i = 0; i < rangeRule.RuleList.Rule.length; i++) {
        var rule = rangeRule.RuleList.Rule[i];
        var obj = {};
        if (type == "11") {
            selectTab = 0;
            tabs.tabs("select", selectTab);
            checkModule("[name=positionModule]", "assign");
            changePositionModule();
            obj.id = rule.JobID;
            obj.name = rule.JobName;
            obj.IsSelected = rule.IsSelected;
        } else if (type == "12" || type == "23") {
            if (type == "12") {
                selectTab = 0;
                tabs.tabs("select", selectTab);
                checkModule("[name=positionModule]", "super");
                changePositionModule();
            } else {
                selectTab = 1;
                tabs.tabs("select", selectTab);
                checkModule("[name=peopleModule]", "super");
                changePeopleModule();
            }
            obj = rule;
            //            checkType(rule);
            //            obj.id = "";
            //            obj.name = rule.Expression.Content;
            //            obj.IsSelected = rule.IsSelected;
        } else if (type == "21") {
            selectTab = 1;
            tabs.tabs("select", selectTab);
            checkModule("[name=peopleModule]", "assign");
            changePeopleModule();
            obj.id = rule.UserID;
            obj.name = rule.UserName;
            obj.deptId = rule.DeptID;
            obj.deptName = rule.DeptName;
            obj.IsSelected = rule.IsSelected;
        } else if (type == "22") {
            selectTab = 1;
            tabs.tabs("select", selectTab);
            checkModule("[name=peopleModule]", "extend");
            changePeopleModule();
            obj.id = rule.NodeID;
            obj.name = rule.NodeName;
            obj.IsSelected = rule.IsSelected;
        } else if (type == "31") {
            selectTab = 2;
            tabs.tabs("select", selectTab);
            checkModule("[name=orgModule]", "assign");
            changeOrgModule();
            obj.deptId = rule.DeptID;
            obj.deptName = rule.DeptName;
            obj.ruleId = rule.RoleID;
            obj.ruleName = rule.RoleName;
            obj.IsDeep = rule.IsDeep;
            obj.IsSelected = rule.IsSelected;
            obj.id = rule.DeptID;
            obj.name = rule.DeptName + "-" + rule.RoleName;
        } else if (type == "32") {
            selectTab = 2;
            tabs.tabs("select", selectTab);
            checkModule("[name=orgModule]", "extend");
            changeOrgModule();
            obj.nodeId = rule.NodeID;
            obj.nodeName = rule.NodeName;
            obj.ruleId = rule.RoleID;
            obj.ruleName = rule.RoleName;
            obj.IsDeep = rule.IsDeep;
            obj.IsSelected = rule.IsSelected;
            obj.id = rule.NodeID;
            obj.level = rule.Level;
            obj.name = rule.NodeName + "-" + getDeptLevel(rule.Level) + "-" + rule.RoleName;
        } else if (type == "33") {
            selectTab = 2;
            tabs.tabs("select", selectTab);
            checkType(rule);
            checkModule("[name=orgModule]", "super");
            changeOrgModule();
            obj = rule;
            //            obj.RoleID = rule.RoleID;
            //            obj.RoleName = rule.RoleName;
            //            obj.IsDeep = rule.IsDeep;
            //            obj.IsSelected = rule.IsSelected;
            //            obj.id = rule.RoleID;
            //            obj.name = rule.Expression.Content;
        } else if (type == "41") {
            selectTab = 3;
            tabs.tabs("select", selectTab);
            checkModule("[name=peopleRelationModule]", "extend");
            changePeopleRelationModule();
            obj.nodeId = rule.NodeID;
            obj.nodeName = rule.NodeName;
            obj.RelationID = rule.RelationID;
            obj.RelationName = rule.RelationName;
            obj.IsSelected = rule.IsSelected;
            obj.id = rule.NodeID;
            obj.name = rule.NodeName + "-" + rule.RelationName;
        } else if (type == "42") {
            selectTab = 3;
            tabs.tabs("select", selectTab);
            checkModule("[name=peopleRelationModule]", "super");
            changePeopleRelationModule();
            obj = rule;
            //            checkType(rule);
            //            obj.RelationID = rule.RelationID;
            //            obj.RelationName = rule.RelationName;
            //            obj.IsSelected = rule.IsSelected;
            //            obj.id = rule.RelationID;
            //            obj.name = rule.Expression.Content;
        } else {
            alert("范围描述类型超出");
        }

        rows.push(obj);

    }
    tableResult.datagrid("loadData", rows);
}


function checkModule(mod, val) {
    $(mod).each(function() {
        if ($(this).val() == val) {
            $(this).attr("checked", "checked");
        }
    });
}

function checkType(rule) {
    $("#tab" + selectTab).find(".superType").each(function() {
        if ($(this).val() == rule.Expression.Type) {
            $(this).attr("checked", "checked");
        }
    });
}

//初始化选人结果列表
function inittableResult() {
    tableResult.datagrid({
        rownumbers: true,
        singleSelect: true,
        fitColumns: true,
        columns: [
            [{
                field: 'id',
                checkbox: true
            }, {
                field: 'name',
                title: '范围',
                width: 200
            }, {
                field: 'IsDeep',
                title: '是否深度遍历',
                width: 150,
                formatter: function(value, rowData, rowIndex) {
                    return (value == 0) ? "否" : "是";
                },
                editor: {
                    type: "combobox",
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                            "value": 0,
                            "text": "否"
                        }, {
                            "value": 1,
                            "text": "是"
                        }]
                    }
                }
            }, {
                field: 'IsSelected',
                title: '状态',
                width: 140,
                formatter: function(value, rowData, rowIndex) {
                    if (value == 0) {
                        return "人工选择";
                    } else if (value == 1) {
                        return "默认选中";
                    } else {
                        return "必选";
                    }
                },
                editor: {
                    type: "combobox",
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: [{
                            "value": 0,
                            "text": "人工选择"
                        }, {
                            "value": 1,
                            "text": "默认选中"
                        }, {
                            "value": 2,
                            "text": "必选"
                        }]
                    }
                }
            }]
        ],
        onClickRow: function(rowIndex, rowData) {
            endEditTable(tableResult);
            tableResult.datagrid("beginEdit", rowIndex);
            if (rowData.script) {
                $("#tab" + selectTab).find("iframe")[0].contentWindow.flowGjSelect.initScriptConfig(rowData);
            }
        },
        onLoadSuccess: function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                var rowData = data.rows[i];
                if (rowData.script) {
                    setTimeout(function() {
                        $("#tab" + selectTab).find("iframe")[0].contentWindow.flowGjSelect.initScriptConfig(rowData);
                    }, 1000);
                }
            }
        }
    });
}

//初始化tab页面
function initTabs() {
    tabs.tabs({
        onSelect: function(title, index) {
            doClear();
            selectTab = index;
            if (index == 1) {
                rangeType = 21;
                module = "assign";
                initAssignDataForPeople();
                $("#tableResult").datagrid("hideColumn", "IsDeep");
            } else if (index == 2) {
                rangeType = 31;
                module = "assign";
                initAssignDataForOrg();
                $("#tableResult").datagrid("showColumn", "IsDeep");
            } else if (index == 3) {
                rangeType = 41;
                module = "extend";
                initExtendDataForPeopleRelation();
                $("#tableResult").datagrid("hideColumn", "IsDeep");
            } else if (index == 0) {
                rangeType = 11;
                module = "assign";
                initAssignDataForPosition();
                initPeopleRelation();
                $("#tableResult").datagrid("showColumn", "IsDeep");
            }
            $("#tab" + selectTab).find(".superType").each(function(k) {
                if (k == 0) {
                    $(this).attr("checked", "checked");
                }
            });
        }
    });
}


function doSelect() {
    endEditTable(table2);
    if (selectTab == 0) { //行政岗位
        if (module == "assign") {
            rangeType = 11;
            var rows = table0.datagrid("getSelections");
            for (var i = 0; i < rows.length; i++) {
                rows[i].IsSelected = 0;
            }
            tableResult.datagrid("loadData", rows);
        } else {
            rangeType = 12;
            var scriptConfig = $("#tab" + selectTab).find("iframe")[0].contentWindow.flowGjSelect.getSriptConfig();
            scriptConfig.IsSelected = 0;
            scriptConfig.IsDeep = 1;
            tableResult.datagrid("loadData", []);
            tableResult.datagrid("appendRow", scriptConfig);
        }
    } else if (selectTab == 1) { //直接选人
        if (module == "assign") {
            rangeType = 21;
            var node = peopleUL.tree("getSelected");
            var parentNode = peopleUL.tree("getRoot");
            if (node && node.attributes.type == 1) {
                var parent = peopleUL.tree("getParent", node.target);
                var obj = {
                    id: node.id,
                    name: node.text,
                    deptId: parent.id,
                    deptName: parent.text || "",
                    IsSelected: 0
                };
                tableResult.datagrid("appendRow", obj);
            }
            // if (node && node.attributes.self.type == 1) {
            //     var obj = {
            //         id: node.attributes.self.id,
            //         name: node.text,
            //         deptId: node.attributes.pId,
            //         deptName: node.attributes.pName,
            //         IsSelected: 0
            //     };
            //     tableResult.datagrid("appendRow", obj);
            // }
        } else if (module == "extend") {
            rangeType = 22;
            var rows = table1.datagrid("getSelections");
            for (var i = 0; i < rows.length; i++) {
                rows[i].IsSelected = 0;
            }
            tableResult.datagrid("loadData", rows);
        } else {
            rangeType = 23;
            var scriptConfig = $("#tab" + selectTab).find("iframe")[0].contentWindow.flowGjSelect.getSriptConfig();
            scriptConfig.IsSelected = "0";
            tableResult.datagrid("loadData", []);
            tableResult.datagrid("appendRow", scriptConfig);
        }
    } else if (selectTab == 2) { //部门+角色
        if (module == "assign") {
            rangeType = 31;
            var node1 = orgUL.tree("getSelected");
            var node2 = flowPositionUL.tree("getSelected");
            writeLog(node2);
            if (node1 && node2 && node2.attributes.type == "2") {
            //if (node1 && node2 && node2.attributes.self.type == "2") {
                var obj = {
                    id: node1.id,
                    name: node1.text + "-" + node2.text,
                    IsDeep: 1,
                    IsSelected: 0,
                    deptId: node1.id,
                    ruleId: node2.id,
                    deptName: node1.text,
                    ruleName: node2.text
                };
                tableResult.datagrid("appendRow", obj);
            }
        } else if (module == "extend") {
            rangeType = 32;
            var rows = table2.datagrid("getSelections");
            var node = flowPositionUL.tree("getSelected");
            if (node) {
                for (var i = 0; i < rows.length; i++) {
                    var rowName = rows[i].name;
                    rows[i].name = rowName + "-" + getDeptLevel(rows[i].level) + "-" + node.text;
                    rows[i].nodeId = rows[i].id;
                    rows[i].nodeName = rowName;
                    rows[i].level = rows[i].level;
                    rows[i].ruleId = node.attributes.id;
                    rows[i].ruleName = node.text;
                    rows[i].IsDeep = 1;
                    rows[i].IsSelected = 0;
                }
                var oldRows = tableResult.datagrid("getRows") || [];
                $.merge(rows, oldRows);
                rows = $.unique(rows);
                tableResult.datagrid("loadData", rows);
            }
        } else {
            rangeType = 33;
            var scriptConfig = $("#tab" + selectTab).find("iframe")[0].contentWindow.flowGjSelect.getSriptConfig();
            var node = flowPositionUL.tree("getSelected");
            if (node) {
                scriptConfig.RoleID = node.attributes.self.id;
                scriptConfig.RoleName = node.text;
                scriptConfig.IsSelected = 0;
                scriptConfig.IsDeep = 1;
                tableResult.datagrid("loadData", []);
                tableResult.datagrid("appendRow", scriptConfig);
            }
        }
    } else if (selectTab == 3) { //人员+关系
        if (module == "extend") {
            rangeType = 41;
            var rows = table3.datagrid("getSelections");
            var node = peopleRelationUL.tree("getSelected");
            if (node) {
                for (var i = 0; i < rows.length; i++) {
                    var name = rows[i].name;
                    rows[i].name = name + "-" + node.text;
                    rows[i].nodeId = rows[i].id;
                    rows[i].nodeName = name;
                    rows[i].RelationID = node.attributes.id;
                    rows[i].RelationName = node.text;
                    rows[i].IsSelected = 0;
                }
                tableResult.datagrid("loadData", rows);
            }
        } else {
            rangeType = 42;
            var scriptConfig = $("#tab" + selectTab).find("iframe")[0].contentWindow.flowGjSelect.getSriptConfig();
            var node = peopleRelationUL.tree("getSelected");
            if (node) {
                scriptConfig.RelationID = node.attributes.self.id;
                scriptConfig.RelationName = node.text;
                scriptConfig.IsSelected = 0;
                tableResult.datagrid("loadData", []);
                tableResult.datagrid("appendRow", obj);
            }
        }
    }
}

function doRemove() {
    var rows = tableResult.datagrid("getSelections");
    for (var i = 0; i < rows.length; i++) {
        var rIndex = tableResult.datagrid("getRowIndex", rows[i]);
        tableResult.datagrid("deleteRow", rIndex);
    }
}

function doClear() {
    tableResult.datagrid("loadData", []);
}

function getReturnXml() {
    endEditTable(tableResult);
    var obj = {
        Type: rangeType,
        IsUser: ($("#tab" + selectTab).find(".toPeople").prop("checked")) ? 1 : 0,
        RuleList: {
            Rule: []
        }
    };
    var data = tableResult.datagrid("getData");
    for (var i = 0; i < data.rows.length; i++) {
        var row = data.rows[i];
        var Rule = {};
        if (selectTab == 0) {
            if (module == "assign") {
                Rule = {
                    JobID: row.id,
                    JobName: row.name,
                    IsSelected: row.IsSelected
                }
            } else {
                Rule = row;
            }
        } else if (selectTab == 1) {
            if (module == "assign") {
                Rule = {
                    UserID: row.id,
                    UserName: row.name,
                    DeptID: row.deptId,
                    DeptName: row.deptName,
                    IsSelected: row.IsSelected
                }
            } else if (module == "extend") {
                Rule = {
                    NodeID: row.id,
                    NodeName: row.name,
                    IsSelected: row.IsSelected
                }
            } else {
                Rule = row;
            }
        } else if (selectTab == 2) {
            if (module == "assign") {
                Rule = {
                    DeptID: row.deptId,
                    DeptName: row.deptName,
                    RoleID: row.ruleId,
                    RoleName: row.ruleName,
                    IsDeep: row.IsDeep,
                    IsSelected: row.IsSelected
                }
            } else if (module == "extend") {
                Rule = {
                    NodeID: row.nodeId,
                    NodeName: row.nodeName,
                    Level: row.level,
                    RoleID: row.ruleId,
                    RoleName: row.ruleName,
                    IsDeep: row.IsDeep,
                    IsSelected: row.IsSelected,
                    Level: row.level
                }
            } else {
                Rule = row;
            }
        } else if (selectTab == 3) {
            if (module == "extend") {
                Rule = {
                    NodeID: row.nodeId,
                    NodeName: row.nodeName,
                    RelationID: row.RelationID,
                    RelationName: row.RelationName,
                    IsDeep: row.IsDeep,
                    IsSelected: row.IsSelected
                }
            } else {
                Rule = row;
            }
        }
        obj.RuleList.Rule.push(Rule);
    }
    return obj;
}

//--------------------------------Position--------------------------------------------------------
function initAssignDataForPosition() {
    if (!table0Loaded) {
        table0.datagrid({
            rownumbers: true,
            singleSelect: false,
            height: 180,
            fitColumns: true,
            columns: [
                [{
                    field: 'id',
                    title: "序号",
                    checkbox: true
                }, {
                    field: 'name',
                    title: '岗位名称',
                    width: 200
                }, {
                    field: 'desc',
                    title: '备注',
                    width: 290
                }]
            ]
        });
        loadAssignDataForPosition();
        table0Loaded = true;
    }
}

function loadAssignDataForPosition() {
    var data = getAssignDataForPosition();
    table0.datagrid("loadData", data);
}

function getAssignDataForPosition() {
    return [];
    // return appInfo.JobList.Node[0].Node;
    //    var data = [];
    //    var xml = getXmlObj("admin_client/workflow/xml/datasource/assign_position.xml");
    //    if (!xml.Node) {
    //    }
    //    else {
    //        if (!xml.Node.length) {
    //            xml.Node = [xml.Node];
    //        }
    //        for (var i = 0; i < xml.Node.length; i++) {
    //            var node = xml.Node[i];
    //            data.push({
    //                id: node.id,
    //                name: node.name,
    //                desc: node.desc
    //            });
    //        }
    //    }
    //    return data;
}

function initSuperDatForPosition() {
    defaultChecks();
    if (!positionParamsLoaded) {
        var data = getSuperDataPosition();
        positionParams.tree({
            animate: true,
            data: data,
            onDblClick: function(node) {
                var text = $("#positionExpression").val();
                $("#positionExpression").val(text + "[" + node.id + "]");
            }
        });
        positionParamsLoaded = true;
    }
}

function getSuperDataPosition() {
    var data = appInfo.MetaData.ParameterList.Parameter;
    for (var i = 0; i < data.length; i++) {
        data[i].text = data[i].name;
    }
    return data;
    //    var data = [];
    //    var xml = getXmlObj("admin_client/workflow/xml/datasource/position_params.xml");
    //    if (xml.System && xml.System.Parameter) {
    //        if (!xml.System.Parameter.length) {
    //            xml.System.Parameter = [xml.System.Parameter];
    //        }
    //        var system = {
    //            id: 1,
    //            text: "系统参数",
    //            children: []
    //        }
    //        for (var i = 0; i < xml.System.Parameter.length; i++) {
    //            system.children.push({
    //                id: system.id * 100 + i,
    //                text: xml.System.Parameter[i].name,
    //                attributes: {
    //                    key: xml.System.Parameter[i].key
    //                }
    //            });
    //        }
    //        data.push(system);
    //    }
    //    if (xml.Application && xml.Application.Parameter) {
    //        if (!xml.Application.Parameter.length) {
    //            xml.Application.Parameter = [xml.Application.Parameter];
    //        }
    //        var application = {
    //            id: 1,
    //            text: "应用参数",
    //            children: []
    //        }
    //        for (var i = 0; i < xml.Application.Parameter.length; i++) {
    //            application.children.push({
    //                id: application.id * 100 + i,
    //                text: xml.Application.Parameter[i].name,
    //                attributes: {
    //                    key: xml.Application.Parameter[i].key
    //                }
    //            });
    //        }
    //        data.push(application);
    //    }
    //    return data;
}

function changePositionModule() {
    var assignDiv = $("#tab" + selectTab).find(".assignDiv"),
        superDiv = $("#tab" + selectTab).find(".superDiv");
    module = $("[name=positionModule]:checked").val();
    if (module == "super") {
        assignDiv.addClass("hideDiv");
        superDiv.removeClass("hideDiv");
        superDiv.layout("resize")
        initSuperDatForPosition();
        rangeType = 12;
    } else {
        assignDiv.removeClass("hideDiv");
        superDiv.addClass("hideDiv");
        assignDiv.layout("resize")
        rangeType = 11;
    }
}

//--------------------------------People-----------------------------------------------

function initAssignDataForPeople() {
    if (!peopleULLoaded) {
        var data = getAssignDataForPeople(function(data) {
            peopleUL.tree({
                animate: true,
                data: data,
                onBeforeExpand: function(node) {
                    var childArr = peopleUL.tree('getChildren', node.target);
                    if (childArr.length == 0) {
                        var sVentorID = workFlow.BaseInfo.Vendor.ID;
                        var sAPPID = workFlow.BaseInfo.Vendor.APP.ID;
                        var rows = getServerData({
                            VentordID: sVentorID,
                            APPID: sAPPID,
                            FID: node.id
                        }, "admin_client/workflow/interface/getDeptChildren.xml").OrgTree.Node[0].Node;
                        debugger;
                        fillDepartmentUser(node, rows);
                        if (node.children && node.children.length > 0) {
                            peopleUL.tree('append', {
                                parent: node.target,
                                data: node.children
                            });
                        } else {
                            $.messager.alert("提示", "没有子节点", "info", function() {});
                        }
                    }
                }
            });
        });
        peopleULLoaded = true;
    }
}

function getAssignDataForPeople(callback) {
    var url = dsf.url.getWebPath("oua/getUserByCurUnit");
    dsf.http.request(url, null, "GET")
        .done(function(response) {
            if (response.success) {
                function fn(data) {
                    data.text = data._name;
                    data.id = data._id;
                    data.attributes = data.Atts;
                    data.attributes.type = data._type;
                    data.attributes.FID = data.FID;
                    delete data._name;
                    delete data._id;
                    delete data.Atts;
                    delete data._type;
                    delete data.FID;
                    if (data.children) {
                        for (var i = 0; i < data.children.length; i++) {
                            fn(data.children[i])
                        }
                    }
                }
                fn(response.data)
                callback([response.data])
            }
        })
        .error(function() {

        })
        .exec();
    // var data = appInfo.OrgTree.Node[0];
    // var root = {
    //     id: data.id,
    //     text: data.name,
    //     attributes: {
    //         self: data
    //     },
    //     children: []
    // }
    // fillChildren(root, data.Node, 1);
    // return [root];
    //    var data = [];
    //    var xml = getXmlObj("admin_client/workflow/xml/datasource/assign_people.xml");
    //    var root = {
    //        id: 1,
    //        text: xml.name,
    //        attributes: {},
    //        children: []
    //    };
    //    fillChildren(root, xml.Node);
    //    data.push(root);
    //    return data;

}

function fillDepartmentUser(fn, n) {
    if (n) {
        if (!n.length) {
            n = [n];
        }
        for (var i = 0; i < n.length; i++) {
            if (n[i].type == "0" || n[i].type == "1") {
                var node = {
                    id: n[i].id,
                    text: n[i].name,
                    attributes: {
                        self: n[i],
                        pId: fn.id,
                        pName: fn.text
                    },
                    state: n[i].state,
                    children: []
                }
                if (n[i].Node) {
                    fillDepartmentUser(node, n[i].Node);
                }
                fn.children.push(node);
            }
        }
    }
}


function fillChildren(fn, n, nt) {
    if (n) {
        if (!n.length) {
            n = [n];
        }
        for (var i = 0; i < n.length; i++) {
            if ((nt + "") && fn.attributes.self && fn.attributes.self.type && fn.attributes.self.type == nt) {
                //                continue;
            }
            var node = {
                id: n[i].id,
                text: n[i].name,
                attributes: {
                    self: n[i],
                    pId: fn.id,
                    pName: fn.text
                },
                state: n[i].state,
                children: []
            }
            if (n[i].Node) {
                fillChildren(node, n[i].Node, nt);
            }
            fn.children.push(node);
        }
    }
}


function fillDepChildren(fn, n, nt) {
    if (n) {
        if (!n.length) {
            n = [n];
        }
        for (var i = 0; i < n.length; i++) {
            var node = {
                id: n[i].id,
                text: n[i].name,
                attributes: {
                    self: n[i],
                    pId: fn.id,
                    pName: fn.text
                },
                state: n[i].state,
                children: []
            }
            if (n[i].Node) {
                fillDepChildren(node, n[i].Node, nt);
            }
            if (n[i].type == "0") {
                fn.children.push(node);
            }
        }
    }
}

function fillChildrenExitType(fn, n, nt) {
    if (n) {
        if (!n.length) {
            n = [n];
        }
        for (var i = 0; i < n.length; i++) {
            if ((nt + "") && n[i].type && n[i].type != nt) {
                continue;
            }
            var node = {
                id: n[i].id,
                text: n[i].name,
                attributes: {
                    self: n[i],
                    pId: fn.id,
                    pName: fn.text
                },
                state: n[i].state,
                children: []
            }
            if (n[i].Node) {
                fillChildrenExitType(node, n[i].Node, nt);
            }
            fn.children.push(node);
        }
    }
}

function initExtendDataForPeople() {
    if (!table1Loaded) {
        table1.datagrid({
            rownumbers: true,
            singleSelect: false,
            fitColumns: true,
            rowStyler: function(index, row) {
                if (row.id == 'DS_CUR_SEND_NODE') {
                    return 'background-color:#5BC0DE;color:#fff;';
                }
            },
            columns: [
                [{
                    field: 'id',
                    title: "序号",
                    checkbox: true
                }, {
                    field: 'name',
                    title: '岗位名称',
                    width: 200
                }, {
                    field: 'desc',
                    title: '备注',
                    width: 290
                }]
            ]
        });
        loadExtendDataForPeople();
        table1Loaded = true;
    }
}

function loadExtendDataForPeople() {
    var els = _isNewFlow ? getAllElement_v3("node") : getAllElement("Rect");
    var rows = [];
    rows.push({
        id: 'DS_CUR_SEND_NODE',
        name: '当前发送节点',
        desc: ''
    })
    for (var i = 0; i < els.length; i++) {
        if (!_isNewFlow) {
            var attr = els[i].data("attributes");
            var nodeInfo = getNodeInfo(attr.eid);
            rows.push({
                id: attr.cid,
                name: nodeInfo.Name,
                desc: nodeInfo.Desc
            });
        } else {

            rows.push({
                id: els[i].id,
                name: els[i].name,
                desc: els[i].attributes.Desc
            });
        }

    }
    table1.datagrid("loadData", rows);
}

function getAllElement(xmlType) {
    var els = [];
    element.paper.forEach(function(el) {
        if (el.data("attributes").xmlType == xmlType) {
            els.push(el);
        }
    });
    return els;
}

function getAllElement_v3(type) {
    var els = [];
    if (type == "node") {
        els = flow.getPanelInfo()["nodes"];
    }
    if (type == "line") {
        els = flow.getPanelInfo()["lines"];
    }
    return els;
}


function changePeopleModule() {
    var assignDiv = $("#tab" + selectTab).find(".assignDiv"),
        extendDiv = $("#tab" + selectTab).find(".extendDiv"),
        superDiv = $("#tab" + selectTab).find(".superDiv");
    module = $("[name=peopleModule]:checked").val();
    //高级模式
    if (module == "super") {
        assignDiv.addClass("hideDiv");
        extendDiv.addClass("hideDiv");
        superDiv.removeClass("hideDiv");
        superDiv.layout("resize")
        initSuperDataForPeople();
        rangeType = 23;
    }
    //继承节点经办人
    else if (module == "extend") {
        assignDiv.addClass("hideDiv");
        extendDiv.removeClass("hideDiv");
        superDiv.addClass("hideDiv");
        extendDiv.layout("resize")
        initExtendDataForPeople();
        rangeType = 22;
    } else {
        assignDiv.removeClass("hideDiv");
        extendDiv.addClass("hideDiv");
        superDiv.addClass("hideDiv");
        assignDiv.layout("resize")
        initAssignDataForPeople();
        rangeType = 21;
    }
}

function initSuperDataForPeople() {
    defaultChecks();
    if (!peopleParamsLoaded) {
        var data = getSuperDataPosition();
        peopleParams.tree({
            animate: true,
            data: data,
            onDblClick: function(node) {
                var text = $("#peopleExpression").val();
                $("#peopleExpression").val(text + "[" + node.id + "]");
            }
        });
        peopleParamsLoaded = true;
    }
}

//------------------------------------------Org-----------------------------------------
function changeOrgModule() {
    var assignDiv = $("#tab" + selectTab).find(".assignDiv"),
        extendDiv = $("#tab" + selectTab).find(".extendDiv"),
        superDiv = $("#tab" + selectTab).find(".superDiv");
    module = $("[name=orgModule]:checked").val();
    if (module == "super") {
        assignDiv.addClass("hideDiv");
        extendDiv.addClass("hideDiv");
        superDiv.removeClass("hideDiv");
        superDiv.layout("resize");
        initSuperDataForOrg();
        rangeType = 33;
    } else if (module == "extend") {
        assignDiv.addClass("hideDiv");
        extendDiv.removeClass("hideDiv");
        superDiv.addClass("hideDiv");
        extendDiv.layout("resize");
        initExtendDataForOrg();
        rangeType = 32;
    } else {
        assignDiv.removeClass("hideDiv");
        extendDiv.addClass("hideDiv");
        superDiv.addClass("hideDiv");
        assignDiv.layout("resize");
        initAssignDataForOrg();

        rangeType = 31;
    }
}

function initAssignDataForOrg() {
    if (!orgULLoaded) {
        var nt = 1;
        //var data = getAssignDataForOrg(nt);
        var data = getAssignDataForOrg2(function(data) {
            orgUL.tree({
                animate: true,
                data: data,
                onBeforeExpand: function(node) {
                    var childArr = orgUL.tree('getChildren', node.target);
                    if (childArr.length == 0) {
                        var sVentorID = workFlow.BaseInfo.Vendor.ID;
                        var sAPPID = workFlow.BaseInfo.Vendor.APP.ID;
                        var rows = getServerData({
                            VentordID: sVentorID,
                            APPID: sAPPID,
                            FID: node.id
                        }, "admin_client/workflow/interface/getDeptChildren.xml").OrgTree.Node[0].Node;
                        fillDepChildren(node, rows, 0);
                        if (node.children && node.children.length > 0) {
                            orgUL.tree('append', {
                                parent: node.target,
                                data: node.children
                            });
                        } else {
                            $.messager.alert("提示", "没有子节点", "info", function() {
                                orgUL.tree("update", {
                                    "target": node.target,
                                    "state": "closed"
                                });
                            });
                        }

                    }
                }
            });
            getFlowPosition(function(data2){
                flowPositionUL.tree({
                    animate: true,
                    data: data2
                });
            });
        });
        // orgULLoaded = true;
    }
}

function getAssignDataForOrg(nt) {
    var data = appInfo.OrgTree.Node[0];
    var root = {
        id: data.id,
        text: data.name,
        attributes: {
            self: data
        },
        children: []
    }
    fillChildren(root, data.Node, nt);
    return [root];
}

function getAssignDataForOrg2(callback) {
    // http://10.128.2.103:8081/dsfa/oua/getDeptByCurUnit
    var url = dsf.url.getWebPath("oua/getDeptByCurUnit");
    dsf.http.request(url, null, "GET")
        .done(function(response) {
            if (response.success) {
                function fn(data) {
                    data.text = data._name;
                    data.id = data._id;
                    data.attributes = data.Atts;
                    data.attributes.type = data._type;
                    data.attributes.FID = data.FID;
                    delete data._name;
                    delete data._id;
                    delete data.Atts;
                    delete data._type;
                    delete data.FID;
                    if (data.children) {
                        for (var i = 0; i < data.children.length; i++) {
                            fn(data.children[i])
                        }
                    }
                }
                fn(response.data)
                callback([response.data])
                    // fillChildrenExitType(root, data.Node, nt);
            }
        }).error(function() {

        }).exec();
    // var data = appInfo.OrgTree.Node[0];
    // var root = {
    //     id: data.id,
    //     text: data.name,
    //     attributes: {
    //         self: data
    //     },
    //     children: []
    // }

    // return [root];
}

function getFlowPosition(callback) {
    var url = dsf.url.getWebPath("oua/getRole");
    dsf.http.request(url, null, "GET")
        .done(function(response) {
            if (response.success) {
                function fn(data) {
                    data.text = data.NAME;
                    data.id = data.id;
                    data.attributes = {"NAME":data.NAME,"id":data.id,"FID":data.pid,"type":data.TYPE};
                    delete data.NAME;
                    delete data.Atts;
                    delete data.TYPE;
                    delete data.FID;
                    if (data.children) {
                        for (var i = 0; i < data.children.length; i++) {
                            fn(data.children[i])
                        }
                    }
                }
                fn(response.data[0])
                callback(response.data)
                    // fillChildrenExitType(root, data.Node, nt);
            }
        }).error(function() {

        }).exec();
    // var data = appInfo.RoleList.Node[0];
    // var root = {
    //     id: data.id,
    //     text: data.name,
    //     attributes: {
    //         self: data
    //     },
    //     children: []
    // }
    // fillChildren(root, data.Node);
    // return [root];
    //    var data = [];
    //    var xml = getXmlObj("admin_client/workflow/xml/datasource/flow_position.xml");
    //    var root = {
    //        id: 1,
    //        text: xml.name,
    //        attributes: {},
    //        children: []
    //    };
    //    fillChildren(root, xml.Node);
    //    data.push(root);
    //    return data;
}

function initExtendDataForOrg() {
    if (!table2Loaded) {
        table2.datagrid({
            rownumbers: true,
            singleSelect: false,
            fitColumns: true,
            rowStyler: function(index, row) {
                if (row.id == 'DS_CUR_SEND_NODE') {
                    return 'background-color:#5BC0DE;color:#fff;';
                }
            },
            columns: [
                [{
                    field: 'id',
                    title: "序号",
                    checkbox: true
                }, {
                    field: 'name',
                    title: '范围',
                    width: 120
                }, {
                    field: 'level',
                    title: '级别',
                    width: 120,
                    formatter: function(value, rowData, rowIndex) {
                        if (value == -1) {
                            return "当前部门";
                        } else if (value == 0) {
                            return "子机构";
                        } else if (value == 1) {
                            return "一级部门";
                        } else if (value == 2) {
                            return "二级部门";
                        } else if (value == 3) {
                            return "三级部门";
                        }
                    },
                    editor: {
                        "type": "combobox",
                        "valueField": 'value',
                        "textField": 'text',
                        "options": {
                            "data": [{
                                "value": -1,
                                "text": "当前部门"
                            }, {
                                "value": 0,
                                "text": "子机构"
                            }, {
                                "value": 1,
                                "text": "一级部门"
                            }, {
                                "value": 2,
                                "text": "二级部门"
                            }, {
                                "value": 3,
                                "text": "三级部门"
                            }]
                        }
                    }
                }, {
                    field: 'desc',
                    title: '备注',
                    width: 100
                }]
            ],
            onClickRow: function(rowIndex, rowData) {
                endEditTable(table2);
                table2.datagrid("beginEdit", rowIndex);
            }
        });
        loadExtendDataForOrg();
        table2Loaded = true;
    }
}

function loadExtendDataForOrg() {
    var els = _isNewFlow ? getAllElement_v3("node") : getAllElement("Rect");
    var rows = [];

    rows.push({
        id: 'DS_CUR_SEND_NODE',
        name: '当前发送节点',
        level: 1,
        desc: ''
    })
    for (var i = 0; i < els.length; i++) {
        if (!_isNewFlow) {
            var attr = els[i].data("attributes");
            var nodeInfo = getNodeInfo(attr.eid);
            rows.push({
                id: attr.cid,
                name: nodeInfo.Name,
                level: 1,
                desc: nodeInfo.Desc
            });
        } else {
            rows.push({
                id: els[i].id,
                name: els[i].name,
                level: 1,
                desc: els[i].attributes.Desc
            });
        }

    }
    table2.datagrid("loadData", rows);
}

function initSuperDataForOrg() {
    defaultChecks();
    if (!orgParamsLoaded) {
        var data = getSuperDataPosition();
        orgParams.tree({
            animate: true,
            data: data,
            onDblClick: function(node) {
                var text = $("#orgExpression").val();
                $("#orgExpression").val(text + "[" + node.id + "]");
            }
        });
        orgParamsLoaded = true;
    }
}

//--------------------------------PeopleRelation--------------------------------------------------
function changePeopleRelationModule() {
    var extendDiv = $("#tab" + selectTab).find(".extendDiv"),
        superDiv = $("#tab" + selectTab).find(".superDiv");
    module = $("[name=peopleRelationModule]:checked").val();
    if (module == "super") {
        extendDiv.addClass("hideDiv");
        superDiv.removeClass("hideDiv");
        superDiv.layout("resize");
        initSuperDataForPeopleRelation();
        rangeType = 42;
    } else if (module == "extend") {
        extendDiv.removeClass("hideDiv");
        superDiv.addClass("hideDiv");
        extendDiv.layout("resize");
        initExtendDataForPeopleRelation();
        rangeType = 41;
    }
}

function initExtendDataForPeopleRelation() {
    module = "extend";
    if (!table3Loaded) {
        table3.datagrid({
            rownumbers: true,
            singleSelect: false,
            fitColumns: true,
            rowStyler: function(index, row) {
                if (row.id == 'DS_CUR_SEND_NODE') {
                    return 'background-color:#5BC0DE;color:#fff;';
                }
            },
            columns: [
                [{
                    field: 'id',
                    title: "序号",
                    checkbox: true
                }, {
                    field: 'name',
                    title: '节点名称',
                    width: 120
                }, {
                    field: 'desc',
                    title: '备注',
                    width: 100
                }]
            ]
        });
        loadExtendDataForPeopleRelation();
        table3Loaded = true;
    }
}

function loadExtendDataForPeopleRelation() {
    var els = _isNewFlow ? getAllElement_v3("node") : getAllElement("Rect");
    var rows = [];
    rows.push({
        id: 'DS_CUR_SEND_NODE',
        name: '当前发送节点',
        level: 1,
        desc: ''
    })
    for (var i = 0; i < els.length; i++) {
        if (!_isNewFlow) {
            var attr = els[i].data("attributes");
            var nodeInfo = getNodeInfo(attr.eid);
            rows.push({
                id: attr.cid,
                name: nodeInfo.Name,
                level: 1,
                desc: nodeInfo.Desc
            });
        } else {
            rows.push({
                id: els[i].id,
                name: els[i].name,
                level: 1,
                desc: els[i].attributes.Desc
            });
        }

    }
    table3.datagrid("loadData", rows);
}

function initPeopleRelation() {
    defaultChecks();
    if (!peopleRelationULLoaded) {
        var data = getPeopleRelationData();
        peopleRelationUL.tree({
            animate: true,
            data: data
        });
        peopleRelationULLoaded = true;
    }
}

function getPeopleRelationData() {
    var data = appInfo.RelationList.Node[0];
    var root = {
        id: data.id,
        text: data.name,
        attributes: {
            self: data
        },
        children: []
    }
    fillChildren(root, data.Node);
    return [root];
    //    var data = [];
    //    var xml = getXmlObj("admin_client/workflow/xml/datasource/people_relation.xml");
    //    var root = {
    //        id: 1,
    //        text: xml.name,
    //        attributes: {},
    //        children: []
    //    };
    //    fillChildren(root, xml.Node);
    //    data.push(root);
    //    return data;
}

function initSuperDataForPeopleRelation() {
    defaultChecks();
    if (!peopleRelationParamsLoaded) {
        var data = getSuperDataPosition();
        peopleRelationParams.tree({
            animate: true,
            data: data,
            onDblClick: function(node) {
                var text = $("#peopleRelationExpression").val();
                $("#peopleRelationExpression").val(text + "[" + node.id + "]");
            }
        });
        peopleRelationParamsLoaded = true;
    }
}

function defaultChecks() {
    $("#tab" + selectTab).find(".superType").each(function() {
        if ($(this).val() == "SQL") {
            $(this).prop("checked", "checked");
        }
    });
}

function getDeptLevel(index) {
    var deptArray = ["子机构", "一级部门", "二级部门", "三级部门", "四级部门"];
    if (index == -1) {
        return "当前部门";
    } else {
        return deptArray[index];
    }
}

function getNodeInfo(eid) {
    for (var i = 0; i < workFlow.NodeList.Node.length; i++) {
        var node = workFlow.NodeList.Node[i];
        if (node.ID == eid) {
            return $.extend({}, node);
        }
    }
}

function endEditTable(table) {
    try {
        var data = table.datagrid("getData");
        if (data && data.rows) {
            for (var i = 0; i < data.rows.length; i++) {
                table.datagrid("endEdit", i);
            }
        }
    } catch (e) {

    }

}