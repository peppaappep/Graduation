var DSFA;
(function () {
    var table, curElement, dialog, curNodeObj, curWorkFlow, curAppInfo, curTableData;
    var filterObj = {};
    var currentRowIndex = null;
    var rowBak = null;

    function getOpenNodeValue(row, nodeObj) {
        var result = null;
        if (row.nodeLevel == 1) {
            result = nodeObj[row.nodeName];
        }
        else if (row.nodeLevel == 2) {
            if (!nodeObj[row.nodeName1]) exAction = nodeObj[row.nodeName1];
            result = nodeObj[row.nodeName1][row.nodeName2];
        }
        else if (row.nodeLevel == 3) {
            result = nodeObj[row.nodeName1][row.nodeName2][row.nodeName3];
        }
        return result;
    }
    $(document).ready(function () {
        $('#property').on("keyup", "input", function (evt) {
            if (evt.keyCode == "13") {
                table.propertygrid("endEdit", currentRowIndex);
            }
        });
    })
    function loadElement(el, obj, workFlow, appInfo) {
        if (currentRowIndex || "0" == currentRowIndex) table.propertygrid("endEdit", currentRowIndex);

        writeLog("loadElement");
        $("#desc").html("");
        curElement = el;
        curNodeObj = obj;
        curWorkFlow = workFlow;
        curAppInfo = appInfo;
        var pro = null;
        var attributes = el.data("attributes");
        if (attributes.xmlType == "Panel") {
            pro = new BaseInfoProperties();
        }
        else if (attributes.xmlType == "Rect") {
            pro = new NodeProperties();
        }
        else if (attributes.xmlType == "Line") {
            pro = new LineProperties();
        }
        else if (attributes.xmlType == "Stack") {
            pro = new CorridorProperties();
        }
        else if (attributes.xmlType == "Stage") {
            pro = new CorridorProperties();
        } else if (attributes.xmlType == "Image") {
            pro = new NodeProperties();
        }
        pro = setPropertyData(pro);
        laodTableData(pro);
        filterData();
        resizefun();
    }

    function resizefun() {
        //    $(".datagrid-body").height($("body").layout("panel", "center").height()-105);

        setTimeout(function () {
            $(".datagrid-body").height($("body").layout("panel", "center").height() - 105);
        }, 200);

    }

    function setPropertyData(obj) {
        var pro = null;
        if (obj instanceof DSFA.Node) {
            if (obj.type == "6") {
                pro = JudgementNodeProperties();
            }
            else {
                pro = NodeProperties();
            }
        }
        else if (obj instanceof DSFA.Line) {
            pro = LineProperties();
        }
        else if (obj instanceof DSFA.Flow) {
            pro = BaseInfoProperties();
        }
        else if (obj instanceof DSFA.Lane) {
            pro = CorridorProperties();
        }
        var attr = obj.attributes;
        for (var i = 0; i < pro.rows.length; i++) {
            if (pro.rows[i].nodeLevel == 1) {
                pro.rows[i].value = attr[pro.rows[i].nodeName];
            }
            else if (pro.rows[i].nodeLevel == 2) {
                if (attr[pro.rows[i].nodeName1]) {
                    pro.rows[i].value = attr[pro.rows[i].nodeName1][pro.rows[i].nodeName2];
                } else {
                    pro.rows[i].value = "";
                }
            }
            else if (pro.rows[i].nodeLevel == 3) {
                if (attr[pro.rows[i].nodeName1] && attr[pro.rows[i].nodeName1][pro.rows[i].nodeName2]) {
                    pro.rows[i].value = attr[pro.rows[i].nodeName1][pro.rows[i].nodeName2][pro.rows[i].nodeName3];
                } else {
                    pro.rows[i].value = "";
                }
            }
            else {
                //目前已知最多三层，多了在进行修改
            }
            //特送信息无法维护  duankg
            /*        if (pro.rows[i].nodeName1 == "OutLine" && pro.rows[i].nodeName2 == "SpecialSendRange") {
                        curNodeObj[pro.rows[i].nodeName1][pro.rows[i].nodeName2] = {
                            IsEnabled: 0
                        };
                    }*/
        }
        return pro;
    }

    function laodTableData(data) {
        table.propertygrid("loadData", data);
        curTableData = table.propertygrid("getData");
    }



    function filterData() {
        var data2 = [];
        var data = table.propertygrid("getData");
        curTableData = $.extend(true, curTableData, data);
        if (getValueByRowName("连线类型", curTableData.rows) == "0") {
            filterObj.hzfw = null;
        }
        else {
            filterObj.hzfw = true;
        }
        if (getValueByRowName("是否启用", curTableData.rows) == "0") {
            filterObj.cxxx = null;
        }
        else {
            filterObj.cxxx = true;
        }
        for (var i = 0; i < curTableData.rows.length; i++) {
            if (curTableData.rows[i].group == "汇总信息") {
                if (!filterObj.hzfw) {

                }
                else {
                    data2.push(curTableData.rows[i]);
                }
            }
            else if (curTableData.rows[i].group == "发送参数" && curTableData.rows[i].name != "是否启用") {
                /*            if (!filterObj.cxxx) {
                            
                            }
                            else {
                                data2.push(curTableData.rows[i]);
                            }*/

                data2.push(curTableData.rows[i]);

            }
            else {
                data2.push(curTableData.rows[i]);
            }
            curTableData.rows[i].id = i;
        }
        table.propertygrid("loadData", data2);
    }

    function getValueByRowName(name, rows) {
        for (var i = 0; i < rows.length; i++) {
            if (name == rows[i].name) {
                return rows[i].value;
            }
        }
    }

    window.getAttributes = function (objectPorperty) {
        var attr = {};
        for (var i = 0; i < objectPorperty.rows.length; i++) {
            var row = objectPorperty.rows[i];
            if (row.nodeLevel == 1) {
                attr[row.nodeName] = row.value;
            }
            else {
                var temp = attr;
                for (var n = 0; n < row.nodeLevel; n++) {
                    var index = n + 1;
                    var key = row["nodeName" + index];
                    if (n < row.nodeLevel - 1) {
                        if (temp[key] === undefined) {
                            temp[key] = {};
                        }
                        temp = temp[key];
                    }
                    else {
                        if (temp[key] === undefined) {
                            temp[key] = row.value;
                        }
                    }
                }
            }
        }
        return attr;
    }
    window.loadPropertyWindow = function (obj) {
        table = $('#pg');
        if (currentRowIndex) {
            table.propertygrid("endEdit", currentRowIndex);
            curNodeObj = (!obj ? null : obj.attributes);
            initPropertyWindow(obj);
        }
        else {
            curNodeObj = (!obj ? null : obj.attributes);
            initPropertyWindow(obj);
        }


    }

    window.doOpenDialog = function (rowData) {
        if (!rowData.href) {
            return;
        }
        var width = 600, height = 500;
        if (rowData.width) {
            width = rowData.width;
        }
        if (rowData.height) {
            height = rowData.height;
        }
        dialog = window.parent.OpenDialog({
            "draggable": true,
            "resizable": false,
            "width": width,
            "height": height,
            "title": rowData.name,
            "url": rowData.href,
            "isFrame": true,
            "dialogArgs": {
                rowData: rowData,
                el: curElement,
                workFlow: flowInfo,
                nodeObj: curNodeObj,
                appInfo: AppInfo,
                classid: getUrlParam("classid") || "",
                flowPlugin: flow
            },
            "cancelButton": false,
            "buttons": [{
                text: '确定',
                iconCls: 'icon-ok',
                handler: function (evt) {
                    //table.propertygrid("beginEdit", currentRowIndex);
                    var iframe = dialog.find("iframe").get(0).contentWindow;
                    var obj = iframe.getReturnValue();
                    rowData.value = obj;
                    //2017-0205 翁，发送条件设置后节点图片变化
                    // if (rowData.name == "发送条件" || rowData.nodeName2 == "SendConditions") {
                    //     window.parent.flow.get(0).contentWindow.propertyChange(curElement, rowData, obj);
                    // }
                    $("body").unbind("mousedown.dialog");
                    changeProperty(curNodeObj, rowData);
                    dialog.dialog("close");
                    return false;
                }
            }, {
                text: '取消',
                iconCls: 'icon-cancel',
                handler: function () {
                    $("body").unbind("mousedown.dialog");
                    dialog.dialog("close");
                }
            }]
        });
        $("body").bind("mousedown.dialog", function (evt) {
            return false;
        })
    }
    function initPropertyWindow(obj) {
        currentRowIndex = null;
        table.propertygrid({
            showGroup: true,
            fitColumns: true,
            fit: true,
            border: false,
            scrollbarSize: 18,
            idField: "name",
            columns: [[{
                field: 'name',
                title: '名称',
                width: 100
            }, {
                field: 'value',
                title: '值',
                width: 100,
                formatter: function (value, rowData, rowIndex) {
                    if (typeof (rowData.value) == "object") {
                        return "<a href='javascript:void(0)'>设置</a>"
                    }
                    if ($.inArray(rowData.name, KeysQXLX) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetQXLXData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysJDLX) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetJDLXData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysFZ) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetFZData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysYN) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetYNData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysSF) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetSFData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysAutoSend) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetAutoSendData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysExtend) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetExtendData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysExpand) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetExpandData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysAlowMore) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetAlowMoreData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysSendModule) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetSendModuleData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysLineType) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetLineTypeData1(rowData.value);
                    }
                    else if ($.inArray(rowData.name, KeysIsEnabled) != -1) {
                        if (!rowData.value) {
                            rowData.value = "0";
                        }
                        return GetIsEnabledData1(rowData.value);
                    }
                    return rowData.value;
                }
            }]],
            onClickRow: function (rowIndex, rowData) {
                $("#desc").html(rowData.desc);
                // if (rowData.type && rowData.type == "dialog") {
                //     doOpenDialog(rowData);
                // }
                // //解决不能编辑的问题 解决难以获得焦点的问题 duankg
                // table.propertygrid("beginEdit", rowIndex);
                beginEditPropty(rowData);
            },
            rowStyler: function (index, row) {
                if (row.hide) {
                    //return "rowHidden";
                    return "display:none";//"background-color:red"
                }
            },
            onBeginEdit: function (index, row) {

            },
            onAfterEdit: function (rowIndex, rowData, changes) {
                var attr = obj.attributes;
                //节点名称为空直接回滚
                if (rowData.nodeName && rowData.nodeName == "Name") {
                    if (!$.trim(rowData.value)) {
                        table.propertygrid("rejectChanges");
                        return;
                    }
                }
                if (rowData.nodeName && rowData.nodeName == "Name") {
                    if (obj instanceof DSFA.Node) {
                        obj.name = changes.value;
                        obj.render();
                    }
                    if (obj instanceof DSFA.Lane) {
                        obj.name = changes.value;
                        obj.render();
                    }
                }
                if (rowData.nodeName && rowData.nodeName == "Type") {
                    //连线类型
                    if (obj instanceof DSFA.Line) {
                        obj.type = changes.value;
                        obj.render();
                    }
                }
                table.propertygrid("acceptChanges");
                changeProperty(curNodeObj, rowData);
                currentRowIndex = null;
                return;

                // if (changes) {
                //     if (!changes.value) {
                //         //节点名称为空直接回滚
                //         if (rowData.nodeName && rowData.nodeName == "Name") {
                //             table.propertygrid("rejectChanges");
                //             return;
                //         }
                //     }
                //     if (rowData.nodeLevel == 1) {
                //         attr[rowData.nodeName] = changes.value;
                //     }
                //     else if (rowData.nodeLevel == 2) {
                //         attr[rowData.nodeName1][rowData.nodeName2] = changes.value;
                //     }
                //     else if (rowData.nodeLevel == 3) {
                //         attr[rowData.nodeName1][rowData.nodeName2][rowData.nodeName3] = changes.value;
                //     }
                //     else {
                //     }

                //     if (rowData.nodeName && rowData.nodeName == "Name") {
                //         obj.name = changes.value;
                //         obj.render();
                //     }
                //     //window.parent.flow.get(0).contentWindow.propertyChange(curElement, rowData, changes.value);

                //     if (rowData.nodeName && rowData.nodeName == "Type" && rowData.name == "连线类型") {
                //         if (changes.value == "1") {
                //             window.parent.setElementColor(curElement, "blue");
                //         }
                //     }
                //     if (rowData.nodeName && rowData.nodeName == "Type" && rowData.name == "连线类型") {
                //         if (changes.value == "0") {
                //             filterObj.hzfw = null;
                //         }
                //         else {
                //             filterObj.hzfw = true;
                //         }
                //         filterData();
                //     }

                //     if (rowData.nodeName1 && rowData.nodeName1 == "SendParameter" && rowData.nodeName2 == "IsEnabled") {
                //         if (changes.value == "0") {
                //             filterObj.cxxx = null;
                //         }
                //         else {
                //             filterObj.cxxx = true;
                //         }
                //         filterData();
                //     }

                // }
            },
            onBeforeEdit: function (rowIndex, rowData, changes) {
                currentRowIndex = rowIndex;
                rowBak = $.extend(true, {}, rowData);
            }
        });
        var data = { "rows": [] };
        if (obj) {
            var d = setPropertyData(obj);
            data.rows = d.rows;
        }
        table.propertygrid("loadData", data)
    }
    window.getProptyRows = function () {
        var data = table.propertygrid("getRows");
        return data;
    }
    window.getProptyRowIndex = function (row) {
        var index = table.propertygrid("getRowIndex", row);
        return index;
    }

    window.beginEditPropty = function (rowData) {
        var rowIndex = table.propertygrid("getRowIndex", rowData);
        if (rowData.type && rowData.type == "dialog") {
            doOpenDialog(rowData);
        }
        //解决不能编辑的问题 解决难以获得焦点的问题 duankg
        table.propertygrid("beginEdit", rowIndex);
    }

    function changeProperty(curNodeObj, rowData) {
        var attr = curNodeObj;
       
        if (rowData.nodeLevel == 1) {
            attr[rowData.nodeName] = rowData.value;
        }
        else if (rowData.nodeLevel == 2) {
            attr[rowData.nodeName1][rowData.nodeName2] = rowData.value;
        }
        else if (rowData.nodeLevel == 3) {
            attr[rowData.nodeName1][rowData.nodeName2][rowData.nodeName3] = rowData.value;
        }
        else {
        }
        // table.propertygrid("updateRow",{
        //     index: 2,
        //     row:rowData
        // })
        table.propertygrid("acceptChanges");
    }

   
})(DSFA || (DSFA = {}))

