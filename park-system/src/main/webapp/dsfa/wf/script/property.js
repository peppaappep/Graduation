var table, curElement, dialog, curNodeObj, curWorkFlow, curAppInfo, curTableData;
var filterObj = {};
var currentRowIndex=null;

function getOpenNodeValue(row,nodeObj) {
    var result=null;
    if (row.nodeLevel == 1) {
        result=nodeObj[row.nodeName];
    }
    else if (row.nodeLevel == 2) {
        if(!nodeObj[row.nodeName1]) exAction=nodeObj[row.nodeName1];
        result=nodeObj[row.nodeName1][row.nodeName2];
    }
    else if (row.nodeLevel == 3) {
        result=nodeObj[row.nodeName1][row.nodeName2][row.nodeName3];
    }
    return result;
}


$(document).ready(function(){
    $("body").layout("resize");
    table = $('#table');
    table.propertygrid({
        showGroup: true,
        fitColumns: true,
        fit: true,
        border: false,
        scrollbarSize: 18,
        idField: "name",
        columns: [[{
            field: 'name',
            title: '属性',
            width: 100
        }, {
            field: 'value',
            title: '值',
            width: 100,
            formatter: function(value, rowData, rowIndex){
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
                    return GetYNData1(rowData.vlaue);
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
                }else if("选择子流程"==rowData.name) {
                    return rowData.value?rowData.value.WFName:"";
                }
                return rowData.value;
            }
        }]],
        onClickRow: function(rowIndex, rowData){
            $("#desc").html(rowData.desc);
            if (rowData.type && rowData.type == "dialog") {
                doOpenDialog(rowData);
            }
            //解决不能编辑的问题 解决难以获得焦点的问题 duankg
            table.propertygrid("beginEdit",rowIndex);
            $("#datagrid-row-r1-2-"+rowIndex+" input").focus();
            if (rowData.nodeName && rowData.nodeName == "Name") {//keyup的时候触发修改工作区的节点名称动作
                $("#datagrid-row-r1-2-"+rowIndex+" input").bind("keyup",function() {
                    window.parent.setElementTextName(curElement, $(this).val());
                })
            }
        },
        onAfterEdit: function(rowIndex, rowData, changes){
            if (changes && changes.value) {
                if (rowData.nodeLevel == 1) {
                    curNodeObj[rowData.nodeName] = changes.value;
                }
                else if (rowData.nodeLevel == 2) {
                    curNodeObj[rowData.nodeName1][rowData.nodeName2] = changes.value;
                }
                else if (rowData.nodeLevel == 3) {
                    curNodeObj[rowData.nodeName1][rowData.nodeName2][rowData.nodeName3] = changes.value;
                }
                else {
                }
                if (rowData.nodeName && rowData.nodeName == "Name") {
                    window.parent.setElementTextName(curElement, changes.value);

                    //如果节点的名字发生改变，所有连线的名字也要发生改变 duankg
                    if(curWorkFlow.LineList && curWorkFlow.LineList.Line) {
                        for(var i=0;i<curWorkFlow.LineList.Line.length;i++) {
                            var splitIndex=curWorkFlow.LineList.Line[i].Name.indexOf("→");
                            if(curWorkFlow.LineList.Line[i].StartNodeID==curNodeObj.ID && splitIndex!=-1) {
                                curWorkFlow.LineList.Line[i].Name=rowData.value+"→"+curWorkFlow.LineList.Line[i].Name.substring(splitIndex+1);
                            }
                            if(curWorkFlow.LineList.Line[i].EndNodeID==curNodeObj.ID && splitIndex!=-1) {
                                curWorkFlow.LineList.Line[i].Name=curWorkFlow.LineList.Line[i].Name.substring(0,splitIndex)+"→"+rowData.value;
                            }
                        }
                    }
                }
                window.parent.flow.get(0).contentWindow.propertyChange(curElement,rowData,changes.value);

                if (rowData.nodeName && rowData.nodeName == "Type" && rowData.name == "连线类型") {
                    if (changes.value == "1") {
                        window.parent.setElementColor(curElement, "blue");
                    }
                }
                if (rowData.nodeName && rowData.nodeName == "Type" && rowData.name == "连线类型") {
                    if (changes.value == "0") {
                        filterObj.hzfw = null;
                    }
                    else {
                        filterObj.hzfw = true;
                    }
                    filterData();
                }
                
                if (rowData.nodeName1 && rowData.nodeName1 == "SendParameter" && rowData.nodeName2 == "IsEnabled") {
                    if (changes.value == "0") {
                        filterObj.cxxx = null;
                    }
                    else {
                        filterObj.cxxx = true;
                    }
                    filterData();
                }
            }
           
        },
        onBeforeEdit:function(rowIndex, rowData, changes) {
            currentRowIndex=rowIndex;
            resizefun();
        }
    });

});
function loadElement(el, obj, workFlow, appInfo){
    if(currentRowIndex || "0"==currentRowIndex) table.propertygrid("endEdit",currentRowIndex);

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
    }else if (attributes.xmlType == "Image") {
        pro = new NodeProperties();
    }
    pro = setPropertyData(pro);
    laodTableData(pro);
    filterData();
    resizefun();
}

function resizefun() {
//    $(".datagrid-body").height($("body").layout("panel", "center").height()-105);

    setTimeout(function() {
        $(".datagrid-body").height($("body").layout("panel", "center").height()-105);
    },200);

}

function setPropertyData(pro){
    for (var i = 0; i < pro.rows.length; i++) {
        if (pro.rows[i].nodeLevel == 1) {
            pro.rows[i].value = curNodeObj[pro.rows[i].nodeName];
        }
        else if (pro.rows[i].nodeLevel == 2) {
            if(curNodeObj[pro.rows[i].nodeName1]) {
                pro.rows[i].value = curNodeObj[pro.rows[i].nodeName1][pro.rows[i].nodeName2];
            }else {
                pro.rows[i].value="";
            }
        }
        else if (pro.rows[i].nodeLevel == 3) {
            if(curNodeObj[pro.rows[i].nodeName1] && curNodeObj[pro.rows[i].nodeName1][pro.rows[i].nodeName2]) {
                pro.rows[i].value = curNodeObj[pro.rows[i].nodeName1][pro.rows[i].nodeName2][pro.rows[i].nodeName3];
            }else {
                pro.rows[i].value="";
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

function laodTableData(data){
    table.propertygrid("loadData", data);
    curTableData = table.propertygrid("getData");
}

function doOpenDialog(rowData){
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
            workFlow: curWorkFlow,
            nodeObj: curNodeObj,
            appInfo: curAppInfo,
            classid:getUrlParam("classid") || ""
        },
        "cancelButton": false,
        "buttons": [{
            text: '确定',
            iconCls: 'icon-ok',
            handler: function(){
                var iframe = dialog.find("iframe").get(0).contentWindow;
                var obj = iframe.getReturnValue();
                if (rowData.nodeLevel == 1) {
                    curNodeObj[rowData.nodeName] = obj;
                    //table.propertygrid("beginEdit", rowData.id);
                }
                else if (rowData.nodeLevel == 2) {
                    if (!curNodeObj[rowData.nodeName1]) curNodeObj[rowData.nodeName1] = {};
                    //table.propertygrid("beginEdit", rowData.id);
                    curNodeObj[rowData.nodeName1][rowData.nodeName2] = obj;
                }
                else if (rowData.nodeLevel == 3) {
                    curNodeObj[rowData.nodeName1][rowData.nodeName2][rowData.nodeName3] = obj;
                    //table.propertygrid("beginEdit", rowData.id);
                }
                else {
                }
                //table.propertygrid("beginEdit", rowData.id);
                rowData.value = obj;
                table.propertygrid("endEdit", rowData.id);
                //table.propertygrid("reload", rowData.id);
                //2017-0205 翁，发送条件设置后节点图片变化
                if (rowData.name == "发送条件" || rowData.nodeName2 == "SendConditions") {
                    window.parent.flow.get(0).contentWindow.propertyChange(curElement, rowData, obj);
                }
                dialog.dialog("close");
            }
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function(){
                dialog.dialog("close");
            }
        }]
    });
}

function filterData(){
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

function getValueByRowName(name, rows){
    for (var i = 0; i < rows.length; i++) {
        if (name == rows[i].name) {
            return rows[i].value;
        }
    }
}
