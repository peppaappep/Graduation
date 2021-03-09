
var flowGjSelect = function () {

    var appInfo=null;
    var currentRowIndex=-1;


    function getParamsTreeData(){
        // var data = appInfo.MetaData.ParameterList.Parameter;
        // for (var i = 0; i < data.length; i++) {
        //     data[i].text = data[i].name;
        // }
        // return data;
        // return data;
        return [];
    }

    function initFlowParams(){
        var data = getParamsTreeData();
        $("#flowParams").tree({
            animate: true,
            data: data,
            onClick: function(node){
                var key="<@"+node.id+">";
                var id="input[name='superType']:checked";
                var superType=$(id).val();
                if(superType=="0") {
                    $("#sql").val($("#sql").val()+key);
                }else if(superType=="1") {
                    updteRow("dataGrid1",key);
                }else if(superType=="2") {
                    updteRow("dataGrid2",key);
                }else if(superType=="3") {
                    updteRow("dataGrid3",key);
                }else if(superType=="4") {
                    $("#code").val($("#code").val()+key);
                }
            }
        });

        function updteRow(id,value) {
            $("#"+id).datagrid("endEdit", currentRowIndex);
            var rows=$("#"+id).datagrid("getRows");
            var currentRow=rows[currentRowIndex];
            currentRow.value=value;
            $("#"+id).datagrid("updateRow",{
                "index":currentRowIndex,
                "row":currentRow
            });
        }
    }


    function initSuperType() {
        $(".superPanel").hide();
        var id="input[name='superType']:checked";
        var superType=$(id).val();
        $("#superType"+superType).show();
        initParameterGird("dataGrid"+superType);
    }



    function initParameterGird(gridName) {

        var dataType=[{
            "value": "STRING",
            "text": "字符串"
        }, {
            "value": "NUMBER",
            "text": "浮点型"
        }, {
            "value": "DATE",
            "text": "日期"
        },{
            "value": "INT",
            "text": "整形"
        },{
            "value": "BOOLEAN",
            "text": "布尔型"
        },{
            "value": "TIMESTAMP",
            "text": "时间戳"
        },{
            "value": "OBJECT",
            "text": "OBJECT"
        },{
            "value": "HTTPSESSION",
            "text": "回话对象"
        }];

        $("#"+gridName).datagrid({
            border:false,
            fitColumns: true,
            singleSelect: true,
            striped: true,
            pagination:false,
            columns: [[{
                field: 'name',
                title: '参数名称',
                width: 150,
                editor: "text"
            },{
                field: 'type',
                title: '参数类型',
                width: 100,
                hidden:true,
                formatter: function(value, rowData, rowIndex){
                    return getDataTypeName(dataType,value);
                },
                editor: {
                    type: "combobox",
                    options: {
                        valueField: 'value',
                        textField: 'text',
                        data: dataType
                    }
                }
            }, {
                field: 'value',
                title: '值',
                width: 150,
                editor: "text"
            }]],
            rowStyler:function(index,row){
            },
            onClickRow: function (rowIndex) {
                var data = $("#"+gridName).datagrid("getData");
                for (var i = 0; i < data.rows.length; i++) {
                    $("#"+gridName).datagrid("endEdit", i);
                }
                $("#"+gridName).datagrid("beginEdit", rowIndex);
                currentRowIndex=rowIndex;
            },
            onDblClickRow: function (rowIndex, field, value) {
            },
            onAfterEdit: function (rowIndex, rowData, changes) {
            },
            onLoadSuccess: function (data) {
            }
        });
    }

    function getDataTypeName(dataType,type) {
        var result="";
        $.each(dataType,function(index,obj) {
            if(obj.value==type) {
                result=obj.text;
                return;
            }
        });
        return result;
    }

    function parameterSelect(name){
        $("#"+name).datagrid("appendRow", {
            "name":"请输入参数名称",
            "type":"STRING",
            "value":"参数值"
        });
    }

    function parameterRemove(name){
        var rows = $("#"+name).datagrid("getSelections");
        for (var i = 0; i < rows.length; i++) {
            var rIndex = $("#"+name).datagrid("getRowIndex", rows[i]);
            $("#"+name).datagrid("deleteRow", rIndex);
        }
    }

    function parameterClear(name){
        $("#"+name).datagrid("loadData", []);
    }

    function getSriptConfig() {
        var result={};
        var id="input[name='superType']:checked";
        var superType=$(id).val();
        result.type=superType;
        if(superType=="0") {
            result.dbName=$("#dbName").val();
            result.sql=$("#sql").val();
            result.name="sql";
        }else if(superType=="1") {
            result.className=$("#className").val();
            result.method=$("#method").val();
            $("#dataGrid1").datagrid("acceptChanges");
            result.parameters=$("#dataGrid1").datagrid("getRows");
            result.name="java method";
        }else if(superType=="2") {
            result.action=$("#action").val();
            result.dataSet=$("#dataSet").val();
            $("#dataGrid2").datagrid("acceptChanges");
            result.parameters=$("#dataGrid2").datagrid("getRows");
            result.name="actionXml";
        }else if(superType=="3") {
            result.url=$("#url").val();
            result.dataSet=$("#urlDataSet").val();
            $("#dataGrid3").datagrid("acceptChanges");
            result.parameters=$("#dataGrid3").datagrid("getRows") || [];
            $.each(result.parameters,function(i,obj) {
                obj.value="<![CDATA["+obj.value+"]]>";
            });
            result.name="resetful";
        }else if(superType=="4") {
            result.name="JavaScript";
            result.code=$("#code").val();
        }
        result.script="1";
        return result;
    }

    function initScriptConfig(result) {
        var superType=result.type;
        var id="input[name='superType'][value='"+superType+"']";
        $(id).prop("checked",true);
        $(id).trigger("click");
        if(superType=="0") {
            $("#dbName").val(result.dbName);
            $("#sql").val(result.sql);
        }else if(superType=="1") {
            $("#className").val( result.className);
            $("#method").val( result.method);
            var parameters=result.parameters || [];
            if(!$.isArray(parameters)) {
                parameters=[parameters];
            }
            $("#dataGrid1").datagrid("loadData", parameters);
        }else if(superType=="2") {
            $("#action").val( result.action);
            $("#dataSet").val( result.dataSet);
            var parameters=result.parameters || [];
            if(!$.isArray(parameters)) {
                parameters=[parameters];
            }
            $("#dataGrid2").datagrid("loadData", parameters);
        }else if(superType=="3") {
            $("#url").val( result.url);
            $("#urlDataSet").val( result.dataSet);
            var parameters=result.parameters || [];
            if(!$.isArray(parameters)) {
                parameters=[parameters];
            }
            $("#dataGrid3").datagrid("loadData", parameters);
        }else if(superType=="4") {
            $("#code").val(result.code);
        }
    }


    function initDBConnection() {
        // $("#dbName").html("");
        // var connections=getSystemConfig().DBConnections.DBConnection;
        // $.each(connections,function(i,obj) {
        //     $("<option value='"+obj.name+"'>"+"DBConnection name: "+obj.name+"</option>").appendTo($("#dbName"));
        // })
    }

    function init() {
        if(getUrlParam("w")) {
            $("#ctable").addClass("width_more");
        }
        appInfo=parent.appInfo;
        initDBConnection();
        initFlowParams();
        initSuperType();
        $("input[name='superType']").bind("click",function() {
            initSuperType();
        });
    }
    return {
        init:init,
        parameterSelect:parameterSelect,
        parameterRemove:parameterRemove,
        parameterClear:parameterClear,
        getSriptConfig:getSriptConfig,
        initScriptConfig:initScriptConfig
    }
}();
























