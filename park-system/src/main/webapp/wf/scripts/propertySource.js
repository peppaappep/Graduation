/**
 * Page=>属性面板的数据
 */
// 基本信息属性设置，点击面板显示的属性
var BaseInfoProperties = function () {
    return {
        "total": 15,
        "rows": [{
            "name": "标识",
            "value": "",
            "hide": true,
            "group": "流程基本信息",
            "nodeLevel": 1,
            "nodeName": "ID",
            "desc": "流程的唯一标识"
        }, {
            "name": "名称",
            "value": "",
            "group": "流程基本信息",
            "editor": "text",
            "nodeLevel": 1,
            "nodeName": "Name",
            "desc": "流程的名称"
        }, {
            "name": "版本",
            "value": "",
            "group": "流程基本信息",
            "nodeLevel": 1,
            "nodeName": "Version",
            "desc": "流程的版本号"
        }, {
            "name": "备注",
            "value": "",
            "group": "流程基本信息",
            "editor": "textarea",
            "nodeLevel": 1,
            "nodeName": "Desc",
            "desc": "流程的备注"
        }, {
            "name": "办理期限类型",
            "value": "",
            "group": "流程基本信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetQXLXData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "TimeLimit",
            "nodeName2": "Type",
            "desc1": "流程的办理期限",
            "desc": "期限类型:0：无限制，1:自然日，2:工作日，13:(自然日)时，14:(自然日)分，23:(工作日)时，24:(工作日)分"
        }, {
            "name": "办理期限值",
            "value": "",
            "group": "流程基本信息",
            "editor": "numberbox",
            "nodeLevel": 2,
            "nodeName1": "TimeLimit",
            "nodeName2": "Value",
            "desc": "流程的办理期限:限制值"
        }, {
            "name": "消息配置",
            "value": "",
            "group": "流程基本信息",
            "nodeLevel": 1,
            "nodeName": "Message",
            "desc": "流程发送公用消息配置",
            "type": "dialog",
            "href": "property_dialog_message_content.htm?type=w"
        }, {
            "name": "销毁后的额外操作",
            "value": "",
            "group": "流程基本信息",
            "nodeLevel": 1,
            "nodeName": "afterDestroy",
            "desc": "销毁后的额外操作",
            "type": "dialog",
            "href": "iframe_gjSelect.html",
            "height": "300",
        }, {
            "name": "强制办结后的额外操作",
            "value": "",
            "group": "流程基本信息",
            "nodeLevel": 1,
            "nodeName": "afterForceClose",
            "desc": "强制办结后的额外操作",
            "type": "dialog",
            "href": "iframe_gjSelect.html",
            "height": "300",
        }, {
            "name": "厂商ID",
            "value": "",
            "group": "厂商信息",
            "nodeLevel": 2,
            "nodeName1": "Vendor",
            "nodeName2": "ID",
            "desc1": "厂商信息",
            "desc": "厂商ID"
        }, {
            "name": "厂商名称",
            "value": "",
            "group": "厂商信息",
            "nodeLevel": 2,
            "nodeName1": "Vendor",
            "nodeName2": "Name",
            "desc": "厂商信息"
        }, {
            "name": "厂商备注",
            "value": "",
            "group": "厂商信息",
            "nodeLevel": 2,
            "nodeName1": "Vendor",
            "nodeName2": "Desc",
            "desc": "厂商备注"
        }, {
            "name": "应用ID",
            "value": "",
            "group": "厂商信息",
            "nodeLevel": 3,
            "nodeName1": "Vendor",
            "nodeName2": "APP",
            "nodeName3": "ID",
            "desc2": "应用信息",
            "desc": "应用ID"
        }, {
            "name": "应用名称",
            "value": "",
            "group": "厂商信息",
            "nodeLevel": 3,
            "nodeName1": "Vendor",
            "nodeName2": "APP",
            "nodeName3": "Name",
            "desc": "应用的名称"
        }, {
            "name": "应用模板配置信息",
            "value": "",
            "group": "厂商信息",
            "nodeLevel": 3,
            "nodeName1": "Vendor",
            "nodeName2": "APP",
            "nodeName3": "Template",
            "desc": "应用模板配置信息"
        }, {
            "name": "应用备注",
            "value": "",
            "group": "厂商信息",
            "nodeLevel": 3,
            "nodeName1": "Vendor",
            "nodeName2": "APP",
            "nodeName3": "Desc",
            "desc": "应用的备注"
        }, {
            "name": "应用厂商自己定义的流程ID",
            "value": "",
            "group": "厂商信息",
            "nodeLevel": 2,
            "nodeName1": "Vendor",
            "nodeName2": "WFID",
            "desc": "应用厂商自己定义的流程ID"
        }]
    }
};

// 普通节点属性
var NodeProperties = function () {
    return {
        "total": 15,
        "rows": [{
            "name": "标识",
            "value": "",
            "hide": true,
            "group": "节点基本信息",
            "nodeLevel": 1,
            "nodeName": "ID",
            "desc": "节点的唯一标识"
        }, {
            "name": "名称",
            "value": "",
            "group": "节点基本信息",
            "editor": "text",
            "nodeLevel": 1,
            "nodeName": "Name",
            "desc": "节点的名称"
        }, {
            "name": "节点类型",
            "value": "0",
            "hide": true,
            "group": "节点基本信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetJDLXData1()
                }
            },
            "nodeLevel": 1,
            "nodeName": "Type",
            "desc": "节点类型,0：开始节点，1：一般节点，2：结束节点，3：跳转节点，4：子流程，5：自动流"
        }, {
            "name": "选择子流程",
            "value": "",
            "group": "节点基本信息",
            "nodeLevel": 1,
            "nodeName": "subFlow",
            "desc": "选择子流程",
            "type": "dialog",
            "href": "selectFlow.htm",
            "width": 300,
            "height": 400
        },
        {
            "name": "备注",
            "value": "",
            "group": "节点基本信息",
            "editor": "textarea",
            "nodeLevel": 1,
            "nodeName": "Desc",
            "desc": "节点的备注"
        }, {
            "name": "节点期限类型",
            "value": "0",
            "group": "节点基本信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetQXLXData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "TimeLimit",
            "nodeName2": "Type",
            "desc1": "节点的办理期限",
            "desc": "期限类型:0：无限制，1:自然日，2:工作日，13:(自然日)时，14:(自然日)分，23:(工作日)时，24:(工作日)分"
        }, {
            "name": "办理期限值",
            "value": "",
            "group": "节点基本信息",
            "editor": "numberbox",
            "nodeLevel": 2,
            "nodeName1": "TimeLimit",
            "nodeName2": "Value",
            "desc": "节点的办理期限:限制值"
        },
        {
            "name": "消息配置信息",
            "value": "",
            "group": "消息配置信息",
            "nodeLevel": 1,
            "nodeName": "Message",
            "desc": "消息配置信息",
            "type": "dialog",
            "href": "property_dialog_message_content.htm",
        }, {
            "name": "出线信息类型",
            "value": "0",
            "group": "出线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetFZData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "Type",
            "desc1": "出线信息",
            "desc": "出线信息类型：0，或分支，1，与分支"
        }, {
            "name": "是否可以批量发送",
            "value": "0",
            "group": "出线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetYNData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "IsEnableBatch",
            "desc": "是否可以批量发送,  0：不可以，1，可以"
        }, {
            "name": "是否启用前置条件",
            "value": "0",
            "group": "出线信息",
            "nodeLevel": 3,
            "nodeName1": "OutLine",
            "nodeName2": "SendPreConditions",
            "nodeName3": "IsEnabled",
            "desc": "是否启用前置条件，0：不启用，1：启用",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetIsEnabledData1()
                }
            }
        }, {
            "name": "是否必填意见",
            "value": "0",
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "RequiredOpinion",
            "desc": "是否必填意见，0：否，1：是",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": [{
                        "value": 0,
                        "text": "否"
                    }, {
                        "value": 1,
                        "text": "是"
                    }]
                }
            }
        }, {
            "name": "退回控制",
            "value": "0",
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "SendBackType",
            "desc": "退回控制，0：退回到上一节点，1：按路径退回，2：按环节退回",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetBackType()
                }
            }
        }, {
            "name": "发送前置条件",
            "value": "",
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "SendPreConditions",
            "desc": "发送前置条件，如果不满足，则提示用户并终止发送操作",
            "type": "dialog",
            "href": "property_dialog_sendPreTerm.html"
        }, {
            "name": "是否启用发送条件",
            "value": "0",
            "hide": true,
            "group": "出线信息",
            "nodeLevel": 3,
            "nodeName1": "OutLine",
            "nodeName2": "SendConditions",
            "nodeName3": "IsEnabled",
            "desc": "是否启用发送条件，0：不启用，1：启用",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetIsEnabledData1()
                }

            }
        }, {
            "name": "发送条件",
            "value": "",
            "hide": true,
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "SendConditions",
            "desc": "发送条件，判断哪些发送路线有效",
            "type": "dialog",
            "href": "property_dialog_send1.htm"
        }, {
            "name": "自动处理规则",
            "value": "",
            "hide": true,
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "AutoDo",
            "desc": "自动处理规则",
            "type": "dialog",
            "href": "property_dialog3.htm",
            "width": 300,
            "height": 300
        }, {
            "name": "特送的子流程",
            "value": "",
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "SpecialSendRange",
            "desc": "特送的节点范围",
            "type": "dialog",
            "href": "property_dialog_tsjd.htm",
            "width": 300,
            "height": 400
        }, {
            "name": "是否为抄送",
            "value": "0",
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetSFData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "IsCC",
            "desc1": "入线信息",
            "desc": "是否为抄送，0：否，1：是"
        }, {
            "name": "是否自动发送",
            "value": "0",
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetAutoSendData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "IsAutoSend",
            "desc": "是否自动发送：0，不自动发送，1，自动发送;满足自动发送的条件：1、IsAutoSend=1,2、选择范围只有一个选项或选择范围为必选,3、继承节点经办人"
        }, {
            "name": "继承节点经办人",
            "value": "0",
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetExtendData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "IsInherit",
            "desc": "继承节点经办人：0，不继承，1，继承;当该节点已经流转过，则再次发送默认发给最近一次的经办人，否则根据发送范围选择。"
        }, {
            "name": "用户选择树的展开级别",
            "value": -1,
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetExpandData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "ExpandLevel",
            "desc": "用户选择树的展开级别，-1:全部展开，0:不展开，1：一级，2:2级，3:3级。。。"
        }, {
            "name": "是否允许多人办理",
            "value": "0",
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetAlowMoreData1()
                }
            },
            "nodeLevel": 3,
            "nodeName1": "InLine",
            "nodeName2": "Multiplayer",
            "nodeName3": "IsEnabled",
            "desc2": "多人办理",
            "desc": "是否允许多人办理：0，不允许，1，允许"
        }, {
            "name": "发送模式",
            "value": "0",
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetSendModuleData1()
                }
            },
            "nodeLevel": 3,
            "nodeName1": "InLine",
            "nodeName2": "Multiplayer",
            "nodeName3": "SendMode",
            "desc": "发送模式：0，并行，1，串行，2，两者皆可，默认并行，3，两者皆可，默认串行"
        }, {
            "name": "发送范围",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "RangeRule",
            "desc": "发送范围",
            "type": "dialog",
            "width": "800",
            "height": "600",
            "href": "property_dialog_sendScope.html"
        }, {
            "name": "发送后额外操作",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "ExAction",
            "href": "iframe_gjSelect.html",
            "height": "300",
            "desc": "发送到当前环节后需要做的额外操作",
            "type": "dialog",
        }, {
            "name": "退回后额外操作",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "SendBackAction",
            "href": "iframe_gjSelect.html",
            "height": "300",
            "desc": "退回或被回收需要执行的额外操作",
            "type": "dialog"
        }, {
            "name": "额外的配置信息",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "ExInfo",
            "href": "form_ext.htm",
            "desc": "额外的配置信息，有业务系统自定义，自解析",
            "type": "dialog"
        }, {
            "name": "自动处理环节的业务逻辑",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "AutoAction",
            "desc": "自动处理环节的业务逻辑",
            "type": "dialog",
            "href": "iframe_gjSelect.html",
            "height": "300",
            "href": "iframe_gjSelect.html",
            "height": "300"
        }]
    }
};

// 结束节点
var endNodeProperties = function () {
    return {
        "total": 15,
        "rows": [{
            "name": "标识",
            "value": "",
            "hide": true,
            "group": "节点基本信息",
            "nodeLevel": 1,
            "nodeName": "ID",
            "desc": "节点的唯一标识"
        }, {
            "name": "名称",
            "value": "",
            "group": "节点基本信息",
            "editor": "text",
            "nodeLevel": 1,
            "nodeName": "Name",
            "desc": "节点的名称"
        }, {
            "name": "节点类型",
            "value": "0",
            "hide": true,
            "group": "节点基本信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetJDLXData1()
                }
            },
            "nodeLevel": 1,
            "nodeName": "Type",
            "desc": "节点类型,0：开始节点，1：一般节点，2：结束节点，3：跳转节点，4：子流程，5：自动流"
        }, {
            "name": "选择子流程",
            "value": "",
            "group": "节点基本信息",
            "nodeLevel": 1,
            "nodeName": "subFlow",
            "desc": "选择子流程",
            "type": "dialog",
            "href": "selectFlow.htm",
            "width": 300,
            "height": 400,
            "hide": true,
        },
        {
            "name": "备注",
            "value": "",
            "group": "节点基本信息",
            "editor": "textarea",
            "nodeLevel": 1,
            "nodeName": "Desc",
            "desc": "节点的备注"
        }, {
            "name": "消息配置信息",
            "value": "",
            "group": "消息配置信息",
            "nodeLevel": 1,
            "nodeName": "Message",
            "desc": "消息配置信息",
            "type": "dialog",
            "href": "property_dialog_message_content.htm",
        }, {
            "name": "是否为抄送",
            "hide": true,
            "value": "0",
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetSFData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "IsCC",
            "desc1": "入线信息",
            "desc": "是否为抄送，0：否，1：是"
        }, {
            "name": "是否自动发送",
            "hide": true,
            "value": "0",
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetAutoSendData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "IsAutoSend",
            "desc": "是否自动发送：0，不自动发送，1，自动发送;满足自动发送的条件：1、IsAutoSend=1,2、选择范围只有一个选项或选择范围为必选,3、继承节点经办人"
        }, {
            "name": "继承节点经办人",
            "hide": true,
            "value": "0",
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetExtendData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "IsInherit",
            "desc": "继承节点经办人：0，不继承，1，继承;当该节点已经流转过，则再次发送默认发给最近一次的经办人，否则根据发送范围选择。"
        }, {
            "name": "用户选择树的展开级别",
            "value": -1,
            "hide": true,
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetExpandData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "ExpandLevel",
            "desc": "用户选择树的展开级别，-1:全部展开，0:不展开，1：一级，2:2级，3:3级。。。"
        }, {
            "name": "是否允许多人办理",
            "value": "0",
            "hide": true,
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetAlowMoreData1()
                }
            },
            "nodeLevel": 3,
            "nodeName1": "InLine",
            "nodeName2": "Multiplayer",
            "nodeName3": "IsEnabled",
            "desc2": "多人办理",
            "desc": "是否允许多人办理：0，不允许，1，允许"
        }, {
            "name": "发送模式",
            "value": "0",
            "hide": true,
            "group": "入线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetSendModuleData1()
                }
            },
            "nodeLevel": 3,
            "nodeName1": "InLine",
            "nodeName2": "Multiplayer",
            "nodeName3": "SendMode",
            "desc": "发送模式：0，并行，1，串行，2，两者皆可，默认并行，3，两者皆可，默认串行"
        }, {
            "name": "发送范围",
            "value": "",
            "hide": true,
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "RangeRule",
            "desc": "发送范围",
            "type": "dialog",
            "width": "800",
            "height": "600",
            "href": "property_dialog_sendScope.html"
        }, {
            "name": "发送后额外操作",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "ExAction",
            "href": "iframe_gjSelect.html",
            "desc": "发送到当前环节后需要做的额外操作",
            "height": "300",
            "type": "dialog"
        }, {
            "name": "退回后额外操作",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "SendBackAction",
            "href": "iframe_gjSelect.html",
            "height": "300",
            "desc": "退回或被回收需要执行的额外操作",
            "type": "dialog"
        }, {
            "name": "额外的配置信息",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "ExInfo",
            "href": "form_ext.htm",
            "desc": "额外的配置信息，有业务系统自定义，自解析",
            "type": "dialog"
        }, {
            "name": "自动处理环节的业务逻辑",
            "value": "",
            "group": "入线信息",
            "nodeLevel": 2,
            "nodeName1": "InLine",
            "nodeName2": "AutoAction",
            "desc": "自动处理环节的业务逻辑",
            "type": "dialog",
            "href": "iframe_gjSelect.html",
            "height": "300"
        }]
    }
};

// 跳转节点
var JumpNodeProperties = function () {
    return {
        "total": 15,
        "rows": [{
            "name": "标识",
            "value": "",
            "hide": true,
            "group": "节点基本信息",
            "nodeLevel": 1,
            "nodeName": "ID",
            "desc": "节点的唯一标识"
        }, {
            "name": "名称",
            "value": "",
            "group": "节点基本信息",
            "editor": "text",
            "nodeLevel": 1,
            "nodeName": "Name",
            "desc": "节点的名称"
        }, {
            "name": "节点类型",
            "value": "0",
            "hide": true,
            "group": "节点基本信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetJDLXData1()
                }
            },
            "nodeLevel": 1,
            "nodeName": "Type",
            "desc": "节点类型,0：开始节点，1：一般节点，2：结束节点，3：跳转节点，4：子流程，5：自动流"
        }, {
            "name": "选择子流程",
            "value": "",
            "hide": true,
            "group": "节点基本信息",
            "nodeLevel": 1,
            "nodeName": "subFlow",
            "desc": "选择子流程",
            "type": "dialog",
            "href": "selectFlow.htm",
            "width": 300,
            "height": 400
        },
        {
            "name": "备注",
            "value": "",
            "group": "节点基本信息",
            "editor": "textarea",
            "nodeLevel": 1,
            "nodeName": "Desc",
            "desc": "节点的备注"
        }, {
            "name": "节点期限类型",
            "value": "0",
            "group": "节点基本信息",
            "hide": true,
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetQXLXData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "TimeLimit",
            "nodeName2": "Type",
            "desc1": "节点的办理期限",
            "desc": "期限类型:0：无限制，1:自然日，2:工作日，13:(自然日)时，14:(自然日)分，23:(工作日)时，24:(工作日)分"
        }, {
            "name": "办理期限值",
            "value": "",
            "hide": true,
            "group": "节点基本信息",
            "editor": "numberbox",
            "nodeLevel": 2,
            "nodeName1": "TimeLimit",
            "nodeName2": "Value",
            "desc": "节点的办理期限:限制值"
        },
        {
            "name": "消息配置信息",
            "value": "",
            "group": "消息配置信息",
            "nodeLevel": 1,
            "nodeName": "Message",
            "desc": "消息配置信息",
            "type": "dialog",
            "href": "property_dialog_message_content.htm",
        }, {
            "name": "出线信息类型",
            "value": "0",
            "group": "出线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetFZData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "Type",
            "desc1": "出线信息",
            "desc": "出线信息类型：0，或分支，1，与分支"
        }, {
            "name": "是否可以批量发送",
            "value": "0",
            "group": "出线信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetYNData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "IsEnableBatch",
            "desc": "是否可以批量发送,  0：不可以，1，可以"
        }, {
            "name": "是否启用前置条件",
            "value": "0",
            "group": "出线信息",
            "nodeLevel": 3,
            "nodeName1": "OutLine",
            "nodeName2": "SendPreConditions",
            "nodeName3": "IsEnabled",
            "desc": "是否启用前置条件，0：不启用，1：启用",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetIsEnabledData1()
                }
            }
        }, {
            "name": "是否必填意见",
            "value": "0",
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "RequiredOpinion",
            "desc": "是否必填意见，0：否，1：是",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": [{
                        "value": 0,
                        "text": "否"
                    }, {
                        "value": 1,
                        "text": "是"
                    }]
                }
            }
        }, {
            "name": "退回控制",
            "value": "0",
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "SendBackType",
            "desc": "退回控制，0：退回到上一节点，1：按路径退回，2：按环节退回",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetBackType()
                }
            }
        }, {
            "name": "发送前置条件",
            "value": "",
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "SendPreConditions",
            "desc": "发送前置条件，如果不满足，则提示用户并终止发送操作",
            "type": "dialog",
            "href": "property_dialog_sendPreTerm.html"
        }, {
            "name": "是否启用发送条件",
            "value": "0",
            "hide": true,
            "group": "出线信息",
            "nodeLevel": 3,
            "nodeName1": "OutLine",
            "nodeName2": "SendConditions",
            "nodeName3": "IsEnabled",
            "desc": "是否启用发送条件，0：不启用，1：启用",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetIsEnabledData1()
                }

            }
        }, {
            "name": "发送条件",
            "value": "",
            "hide": true,
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "SendConditions",
            "desc": "发送条件，判断哪些发送路线有效",
            "type": "dialog",
            "href": "property_dialog_send1.htm"
        }, {
            "name": "自动处理规则",
            "value": "",
            "hide": true,
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "AutoDo",
            "desc": "自动处理规则",
            "type": "dialog",
            "href": "property_dialog3.htm",
            "width": 300,
            "height": 300
        }, {
            "name": "特送的子流程",
            "value": "",
            "group": "出线信息",
            "nodeLevel": 2,
            "nodeName1": "OutLine",
            "nodeName2": "SpecialSendRange",
            "desc": "特送的节点范围",
            "type": "dialog",
            "href": "property_dialog_tsjd.htm",
            "width": 300,
            "height": 400
        }]
    }
};

// 连线属性
var LineProperties = function () {
    return {
        "total": 15,
        "rows": [{
            "name": "标识",
            "value": "",
            "group": "连线基本信息",
            "nodeLevel": 1,
            "nodeName": "ID",
            "desc": "连线的唯一标识"
        }, {
            "name": "名称",
            "value": "",
            "hide": true,
            "group": "连线基本信息",
            "editor": "text",
            "nodeLevel": 1,
            "nodeName": "Name",
            "desc": "连线的名称"
        }, {
            "name": "连线开始节点ID",
            "value": "",
            "hide": true,
            "group": "连线基本信息",
            "nodeLevel": 1,
            "nodeName": "StartNodeID",
            "desc": "连线的开始节点ID"
        }, {
            "name": "连线结束节点ID",
            "value": "",
            "hide": true,
            "group": "连线基本信息",
            "nodeLevel": 1,
            "nodeName": "EndNodeID",
            "desc": "连线的结束节点ID"
        }, {
            "name": "连线类型",
            "value": "0",
            "group": "连线基本信息",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetLineTypeData1()
                }
            },
            "nodeLevel": 1,
            "nodeName": "Type",
            "desc": "连线类型,0:一般线，1：汇总线，2：退回线"
        }, {
            "name": "备注",
            "value": "",
            "group": "连线基本信息",
            "editor": "textarea",
            "nodeLevel": 1,
            "nodeName": "Desc",
            "desc": "连线的备注"
        }, {
            "name": "是否启用",
            "value": "0",
            "group": "发送参数",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": GetSFData1()
                }
            },
            "nodeLevel": 2,
            "nodeName1": "SendParameter",
            "nodeName2": "IsEnabled",
            "desc1": "发送参数，是否启用发线信息",
            "desc": "是否启用，0：否，1：是"
        }, {
            "name": "是否自动发送",
            "value": "0",
            "group": "发送参数",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": [{
                        "value": 0,
                        "text": "不自动发送"
                    }, {
                        "value": 1,
                        "text": "自动发送"
                    }]
                }
            },
            "nodeLevel": 2,
            "nodeName1": "SendParameter",
            "nodeName2": "IsAutoSend",
            "desc": "是否自动发送：0，不自动发送，1，自动发送;满足自动发送的条件：1、IsAutoSend=1,2、选择范围只有一个选项或选择范围为必选,3、继承节点经办人"
        },
        {
            "name": "是否为抄送",
            "value": "0",
            "group": "发送参数",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": [{
                        "value": 0,
                        "text": "否"
                    }, {
                        "value": 1,
                        "text": "是"
                    }]
                }
            },
            "nodeLevel": 2,
            "nodeName1": "SendParameter",
            "nodeName2": "IsCC",
            "desc1": "发送参数，与节点的InLine配置信息互斥并优先",
            "desc": "是否为抄送，0：否，1：是"
        }, {
            "name": "继承节点经办人",
            "value": "0",
            "group": "发送参数",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": [{
                        "value": 0,
                        "text": "不继承"
                    }, {
                        "value": 1,
                        "text": "继承"
                    }]
                }
            },
            "nodeLevel": 2,
            "nodeName1": "SendParameter",
            "nodeName2": "IsInherit",
            "desc": "继承节点经办人：0，不继承，1，继承;当该节点已经流转过，则再次发送默认发给最近一次的经办人，否则根据发送范围选择。"
        }, {
            "name": "用户选择树的展开级别",
            "value": -1,
            "group": "发送参数",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": [{
                        "value": -1,
                        "text": "全部展开"
                    }, {
                        "value": 0,
                        "text": "不展开"
                    }, {
                        "value": 1,
                        "text": "一级"
                    }, {
                        "value": 2,
                        "text": "二级"
                    }, {
                        "value": 3,
                        "text": "三级"
                    }]
                }
            },
            "nodeLevel": 2,
            "nodeName1": "SendParameter",
            "nodeName2": "ExpandLevel",
            "desc": "用户选择树的展开级别，-1:全部展开，0:不展开，1：一级，2：2级，3，3级。。。"
        }, {
            "name": "是否允许多人办理",
            "value": "0",
            "group": "发送参数",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": [{
                        "value": 0,
                        "text": "不允许"
                    }, {
                        "value": 1,
                        "text": "允许"
                    }]
                }
            },
            "nodeLevel": 3,
            "nodeName1": "SendParameter",
            "nodeName2": "Multiplayer",
            "nodeName3": "IsEnabled",
            "desc1": "多人办理",
            "desc": "是否允许多人办理：0，不允许，1，允许"
        }, {
            "name": "发送模式",
            "value": "0",
            "group": "发送参数",
            "editor": {
                "type": "combobox",
                "options": {
                    "data": [{
                        "value": 0,
                        "text": "并行"
                    }, {
                        "value": 1,
                        "text": "串行"
                    }, {
                        "value": 2,
                        "text": "两者皆可，默认并行"
                    }, {
                        "value": 3,
                        "text": "两者皆可，默认串行"
                    }]
                }
            },
            "nodeLevel": 3,
            "nodeName1": "SendParameter",
            "nodeName2": "Multiplayer",
            "nodeName3": "SendMode",
            "desc": "发送模式：0，并行，1，串行，2，两者皆可，默认并行，3，两者皆可，默认串行"
        }, {
            "name": "发送范围",
            "value": "",
            "group": "发送参数",
            "nodeLevel": 2,
            "nodeName1": "SendParameter",
            "nodeName2": "RangeRule",
            "desc": "发送范围",
            "width": "800",
            "height": "600",
            "type": "dialog",
            "href": "property_dialog_sendScope.html"
        }, {
            "name": "发送后额外操作",
            "value": "",
            "group": "发送参数",
            "nodeLevel": 2,
            "nodeName1": "SendParameter",
            "nodeName2": "ExAction",
            "href": "iframe_gjSelect.html",
            "height": "300",
            "desc": "发送到当前环节后需要做的额外操作",
            "type": "dialog",
        }, {
            "name": "退回后额外操作",
            "value": "",
            "group": "发送参数",
            "nodeLevel": 2,
            "nodeName1": "SendParameter",
            "nodeName2": "SendBackAction",
            "href": "iframe_gjSelect.html",
            "height": "300",
            "desc": "退回或被回收需要执行的额外操作",
            "type": "dialog"
        }, {
            "name": "汇总信息",
            "value": "",
            "group": "汇总信息",
            "nodeLevel": 1,
            "nodeName": "GatherRule",
            "desc": "汇总，当连线类型为汇总线时有效",
            "type": "dialog",
            "href": "property_dialog_hzxx.html",
            "width": 300,
            "height": 400
        }]
    }
};

// 判断节点属性
var JudgementNodeProperties = function () {
    return {
        total: 2,
        rows: [
            {
                "name": "标识",
                "value": "",
                "hide": true,
                "group": "节点基本信息",
                "nodeLevel": 1,
                "nodeName": "ID",
                "desc": "节点的唯一标识"
            }, {
                "name": "名称",
                "value": "",

                "group": "节点基本信息",
                "editor": "text",
                "nodeLevel": 1,
                "nodeName": "Name",
                "desc": "节点的名称"
            }, {
                "name": "节点类型",
                "value": "0",
                "hide": true,
                "group": "节点基本信息",
                "editor": {
                    "type": "combobox",
                    "options": {
                        "data": GetJDLXData1()
                    }
                },
                "nodeLevel": 1,
                "nodeName": "Type",
                "desc": "节点类型,0：开始节点，1：一般节点，2：结束节点，3：跳转节点，4：子流程，5：自动流"
            }, {
                "name": "是否启用发送条件",
                "value": "1",
                //"hide":true,
                "group": "判断规则",
                "nodeLevel": 3,
                "nodeName1": "OutLine",
                "nodeName2": "SendConditions",
                "nodeName3": "IsEnabled",
                "desc": "是否启用发送条件，0：不启用，1：启用",
                "editor": {
                    "type": "combobox",
                    "options": {
                        "data": GetIsEnabledData1()
                    }

                }
            }, {
                "name": "发送条件",
                "value": "",
                "group": "判断规则",
                "nodeLevel": 2,
                "nodeName1": "OutLine",
                "nodeName2": "SendConditions",
                "desc": "发送条件，判断哪些发送路线有效",
                "type": "dialog",
                "href": "property_dialog_sendCondition.html",
                "isDefault": true
            }
        ]
    }
}

// 泳道属性
var CorridorProperties = function () {
    return {
        "total": 3,
        "rows": [{
            "name": "标识",
            "value": "",
            "hide": true,
            "group": "基本信息",
            "nodeLevel": 1,
            "nodeName": "ID",
            "desc": "标示"
        }, {
            "name": "名称",
            "value": "",
            "group": "基本信息",
            "editor": "text",
            "nodeLevel": 1,
            "nodeName": "Name",
            "desc": "名称"
        }, {
            "name": "描述",
            "value": "",
            "group": "基本信息",
            "editor": "text",
            "nodeLevel": 1,
            "nodeName": "Desc",
            "desc": "描述"
        }]
    }
};

var KeysQXLX = ["办理期限类型", "节点期限类型"];
var KeysJDLX = ["节点类型"];
var KeysFZ = ["出线信息类型"];
var KeysYN = ["是否可以批量发送"];
var KeysSF = ["是否为抄送", "是否启用"];
var KeysAutoSend = ["是否自动发送"];
var KeysExtend = ["继承节点经办人"];
var KeysExpand = ["用户选择树的展开级别"];
var KeysAlowMore = ["是否允许多人办理"];
var KeysSendModule = ["发送模式"];
var KeysLineType = ["连线类型"];
var KeysIsEnabled = ["是否启用前置条件", "是否启用发送条件"];

/**
 * 办理期限类型、节点期限类型
 */
function GetQXLXData1(v) {
    var data = [{
        "value": 0,
        "text": "无限制"
    }, {
        "value": 1,
        "text": "自然日"
    }, {
        "value": 2,
        "text": "工作日"
    }, {
        "value": 13,
        "text": "(自然日)时"
    }, {
        "value": 14,
        "text": "(自然日)分"
    }, {
        "value": 23,
        "text": "(工作日)时"
    }, {
        "value": 34,
        "text": "(工作日)分"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetJDLXData1(v) {
    var data = [{
        "value": 0,
        "text": "开始节点"
    }, {
        "value": 1,
        "text": "一般节点"
    }, {
        "value": 2,
        "text": "结束节点"
    }, {
        "value": 3,
        "text": "跳转节点"
    }, {
        "value": 4,
        "text": "子流程"
    }, {
        "value": 5,
        "text": "自动流"
    }, {
        "value": 6,
        "text": "判断节点"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetFZData1(v) {
    var data = [{
        "value": 0,
        "text": "或分支"
    }, {
        "value": 1,
        "text": "与分支"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetYNData1(v) {
    var data = [{
        "value": 0,
        "text": "不可以"
    }, {
        "value": 1,
        "text": "可以"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

//是 否
function GetSFData1(v) {
    var data = [{
        "value": 0,
        "text": "否"
    }, {
        "value": 1,
        "text": "是"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

//是否自动发送
function GetAutoSendData1(v) {
    var data = [{
        "value": 0,
        "text": "不自动发送"
    }, {
        "value": 1,
        "text": "自动发送"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetExtendData1(v) {
    var data = [{
        "value": 0,
        "text": "不继承"
    }, {
        "value": 1,
        "text": "继承"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetExpandData1(v) {
    var data = [{
        "value": -1,
        "text": "全部展开"
    }, {
        "value": 0,
        "text": "不展开"
    }, {
        "value": 1,
        "text": "一级"
    }, {
        "value": 2,
        "text": "二级"
    }, {
        "value": 3,
        "text": "三级"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetAlowMoreData1(v) {
    var data = [{
        "value": 0,
        "text": "不允许"
    }, {
        "value": 1,
        "text": "允许"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetSendModuleData1(v) {
    var data = [{
        "value": 0,
        "text": "并行"
    }, {
        "value": 1,
        "text": "串行"
    }, {
        "value": 2,
        "text": "两者皆可，默认并行"
    }, {
        "value": 3,
        "text": "两者皆可，默认串行"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetLineTypeData1(v) {
    var data = [{
        "value": 0,
        "text": "一般线"
    }, {
        "value": 1,
        "text": "汇总线"
    }, {
        "value": 2,
        "text": "退回线"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

function GetIsEnabledData1(v) {
    var data = [{
        "value": 0,
        "text": "不启用"
    }, {
        "value": 1,
        "text": "启用"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}
function GetBackType(v) {
    var data = [{
        "value": 0,
        "text": "退回到上一节点"
    }, {
        "value": 1,
        "text": "按路径退回"
    }, {
        "value": 2,
        "text": "按环节退回"
    }];
    if ((v + "") && $.isNumeric(v)) {
        for (var i = 0; i < data.length; i++) {
            if (v == data[i].value) {
                return data[i].text;
            }
        }
    }
    return data;
}

var nodeTypeInfo = {
    "0": {
        "name": "开始节点",
        "img": "/dsfa/res/dsf_styles/themes/workFlow/0.png"
    },
    "1": {
        "name": "一般节点",
        "img": "/dsfa/res/dsf_styles/themes/workFlow/1.png",
    },
    "2": {
        "name": "结束节点",
        "img": "/dsfa/res/dsf_styles/themes/workFlow/2.png"
    },
    "3": {
        "name": "跳转节点",
        "img": "/dsfa/res/dsf_styles/themes/workFlow/3.png"
    },
    "4": {
        "name": "子流程",
        "img": "/dsfa/res/dsf_styles/themes/workFlow/4.png"
    },
    "5": {
        "name": "自动流",
        "img": "/dsfa/res/dsf_styles/themes/workFlow/5.png"
    },
    "6": {
        "name": "判断节点",
        "img": "/dsfa/res/dsf_styles/themes/workFlow/6.png"
    }
}