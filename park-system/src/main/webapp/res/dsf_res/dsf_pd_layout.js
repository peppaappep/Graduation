var dsf;
(function(dsf) {
    if (!dsf.pdOptions) {
        dsf.pdOptions = {};
    }
    //是否是模板
    var isTpl = dsf.url.queryString("tpl") == "1"

    dsf.pdOptions = {
        //设计器默认布局
        "default": {
            //控件详情标记是否显示
            "controlMetadataInfo": {
                show: true
            },
            //按钮条
            "buttonBar": {
                show: true,
                buttons: [
                    { "text": "保存", "id": "btn_savelayout", "icon": "icon-baocun", "show": !isTpl },
                    { "text": "保存模板", "id": "btn_saveTpl", "icon": "icon-baocun", "show": isTpl },
                    { "text": "暂存", "id": "btn_savelayout_temp", "icon": "icon-baocun", "show": true },
                    { "text": "控件组", "id": "btn_ctrl", "icon": "icon-icon_shezhi", "show": true },
                    { "text": "元数据组", "id": "btn_addMd", "icon": "icon-icon_shezhi", "show": true },
                    { "text": "预览", "id": "btn_preview", "icon": "icon-icon_yulan", "show": true },
                    { "text": "布局模板", "id": "btn_useTpl", "icon": "icon-shebeikaifa1", "show": true },
                    { "text": "自定义扩展", "id": "btn_extjs", "icon": "icon-shebeikaifa1", "show": true },
                    { "text": "审核规则", "id": "btn_evrule", "icon": "icon-guize", "show": true }
                ]
            },
            //左侧工具箱
            "toolBar": {
                show: true,
                "tabs": [{
                        text: "基础控件",
                        id: "ds_tools_content",
                        filter: "control_tools",
                        show: true,
                    },
                    {
                        text: "元数据",
                        id: "ds_tools_content_meta",
                        filter: "control_tools_meta",
                        show: true
                    }
                ]
            },
            //右侧属性栏目
            "propertyBar": {
                show: true,
                propertyLevel: [1, 2, 3]
            },
            //页面类型
            "page": {
                control: "Page",
                useTpl:""
            }
        },
        //问卷配置（用户使用）
        "QIPage": {
            //控件详情标记是否显示
            "controlMetadataInfo": {
                show: false
            },
            "buttonBar": {
                show: true,
                buttons: [
                    { "text": "保存", "id": "btn_savelayout", "icon": "icon-baocun", "show": !isTpl },
                    { "text": "保存模板", "id": "btn_saveTpl", "icon": "icon-baocun", "show": isTpl },
                    { "text": "暂存", "id": "btn_savelayout_temp", "icon": "icon-baocun", "show": true },
                    { "text": "预览", "id": "btn_preview", "icon": "icon-icon_yulan", "show": true },
                    { "text": "发布", "id": "btn_publish", "icon": "icon-fabu1", "show": false },
                    { "text": "取消发布", "id": "btn_unPublish", "icon": "icon-fabusekuai", "show": false }
                ]
            },
            "toolBar": {
                show: true,
                "tabs": [{
                    text: "基础控件",
                    id: "ds_tools_content",
                    filter: "control_tools",
                    show: true,
                }]
            },
            "propertyBar": {
                show: false,
                propertyLevel: [1, 2, 3]
            },
            "page": {
                control: "QIPage",
                useTpl:"dsfa/qi/template/hc/general.layout.js"
            },
			"saveLayoutAfter": function(data){
				if(data.state==20000){
					if(data.state==20000 && window.parent && window.parent.location){
						window.parent.location.reload();
					}
				}
			}
        },
        //问卷高级配置(开发、配置人员使用)
        "QIPage_Debug": {
            //控件详情标记是否显示
            "controlMetadataInfo": {
                show: true
            },
            "buttonBar": {
                show: true,
                buttons: [
                    { "text": "保存", "id": "btn_savelayout", "icon": "icon-baocun", "show": !isTpl },
                    { "text": "保存模板", "id": "btn_saveTpl", "icon": "icon-baocun", "show": isTpl },
                    { "text": "暂存", "id": "btn_savelayout_temp", "icon": "icon-baocun", "show": true },
                    { "text": "控件组", "id": "btn_ctrl", "icon": "icon-icon_shezhi", "show": true },
                    { "text": "预览", "id": "btn_preview", "icon": "icon-icon_yulan", "show": true },
                    { "text": "发布", "id": "btn_publish", "icon": "icon-fabu1", "show": false },
                    { "text": "取消发布", "id": "btn_unPublish", "icon": "icon-fabusekuai", "show": false }
                ]
            },
            "toolBar": {
                show: true,
                "tabs": [{
                    text: "基础控件",
                    id: "ds_tools_content",
                    filter: "control_tools",
                    show: true,
                }]
            },
            "propertyBar": {
                show: true,
                propertyLevel: [1, 2, 3]
            },
            "page": {
                control: "QIPage",
                useTpl:"dsfa/qi/template/hc/general.layout.js"
            }
        },
        "ExamPage":{
             //控件详情标记是否显示
             "controlMetadataInfo": {
                show: true
            },
            "buttonBar": {
                show: true,
                buttons: [
                    { "text": "保存", "id": "btn_savelayout", "icon": "icon-baocun", "show": !isTpl },
                    { "text": "保存模板", "id": "btn_saveTpl", "icon": "icon-baocun", "show": isTpl },
                    { "text": "暂存", "id": "btn_savelayout_temp", "icon": "icon-baocun", "show": true },
                    { "text": "控件组", "id": "btn_ctrl", "icon": "icon-icon_shezhi", "show": true },
                    { "text": "预览", "id": "btn_preview", "icon": "icon-icon_yulan", "show": true },
                    { "text": "发布", "id": "btn_publish", "icon": "icon-fabu1", "show": false },
                    { "text": "取消发布", "id": "btn_unPublish", "icon": "icon-fabusekuai", "show": false }
                ]
            },
            "toolBar": {
                show: true,
                "tabs": [{
                    text: "基础控件",
                    id: "ds_tools_content",
                    filter: "control_tools",
                    show: true,
                }]
            },
            "propertyBar": {
                show: true,
                propertyLevel: [1, 2, 3]
            },
            "page": {
                control: "ExamPage",
                useTpl:"dsfa/exam/template/hc/general.layout.js"
                // useTpl:"dsfa/pd/tempdata/examgeneral.layout.js"
            }
        }
    }

})(dsf)