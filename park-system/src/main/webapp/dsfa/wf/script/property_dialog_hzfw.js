$(document).ready(function() {
    initHzfw();
    var vs = [];
    if (nodeObj.GatherRule.Proportion) {
        $("#Proportion").val(nodeObj.GatherRule.Proportion);
        if (nodeObj.GatherRule.GatherRange) {
            vs = nodeObj.GatherRule.GatherRange.split(",");
        }
    }
    checkNodes(vs);
});

function initHzfw(vs) {
    $("#GatherRange").datagrid({
        rownumbers: true,
        title: "汇总范围",
        height: 260,
        columns: [
            [{
                field: 'value',
                checkbox: true
            }, {
                field: 'text',
                title: '连线名称',
                width: 150
            }]
        ],
        data: GetAllLineObj(vs)
    });
}

function checkNodes(vs) {
    var data = $("#GatherRange").datagrid("getData");
    for (var i = 0; i < vs.length; i++) {
        for (var k = 0; k < data.rows.length; k++) {
            if (vs[i] == data.rows[k].value) {
                $("#GatherRange").datagrid("checkRow", k);
            }
        }
    }
}

function GetAllLineObj() {
    var data = [];
    for (var i = 0; i < flow.lines.length; i++) {
        var line = flow.lines[i];
        if (line.id != nodeObj.ID) {
            data.push({
                value: line.id,
                text: line.name
            });
        }
    }
    // for (var i = 0; i < workFlow.LineList.Line.length; i++) {
    //     var line=workFlow.LineList.Line[i];
    //     if(line.ID!=nodeObj.ID){
    //         data.push({
    //             value: workFlow.LineList.Line[i].ID,
    //             text: workFlow.LineList.Line[i].Name
    //         });
    //     }
    // }
    return data;
}

function getReturnXml() {
    var rows = $('#GatherRange').datagrid("getChecked");
    var vals = [];
    for (var i = 0; i < rows.length; i++) {
        vals.push(rows[i].value);
    }
    var GatherRule = {
        Proportion: $('#Proportion').val(),
        GatherRange: vals.join(",")
    };
    return GatherRule;
}