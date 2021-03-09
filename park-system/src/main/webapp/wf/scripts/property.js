/**
 * Page=>属性面板的一些方法
 */
var DSFA;
(function() {
	var curNodeObj, curSelectObj, dialog, curWorkFlow, curAppInfo, curTableData, curElement;
	var filterObj = {};
	var rowBak = null;
	
	// 加载右侧窗口
	window.loadPropertyWindow = function(obj) {
		curSelectObj = obj || null;
		curNodeObj = (!obj ? null : obj.attributes);
		loadPropertyDom(obj?setPropertyData(obj):[]);
		layui.form.on('select(attr_select)', function(data) {
			var obj = $(data.elem.parentElement).data("data");
			obj.value = data.value;
			changeProperty(obj);
		});
	}
	$('#propertyBox').on("keyup", "input,textarea", function(evt) {
		var obj = $(evt.target.parentElement).data("data");
		obj.value = evt.target.value;
		changeProperty(obj);
	});
	
	// 把propertySource.js中的值转成想要得
	function setPropertyData(obj) {
		var pro = null;
		if (obj instanceof DSFA.Node) {
			if (obj.type == "6") {
				pro = JudgementNodeProperties();
			} else if(obj.type == "2"){
				pro = endNodeProperties();
			} else if(obj.type == "3"){
				pro = JumpNodeProperties();
			} else {
				pro = NodeProperties();
			}
		} else if (obj instanceof DSFA.Line) {
			pro = LineProperties();
		} else if (obj instanceof DSFA.Flow) {
			pro = BaseInfoProperties();
		} else if (obj instanceof DSFA.Lane) {
			pro = CorridorProperties();
		}
		var attr = obj.attributes;
		// 转成平台要的样子
		var group = null;
		var groupIndex = -1;
		pro.json = [];
		for (var i = 0; i < pro.rows.length; i++) {
			if(obj.type!='4' && pro.rows[i].nodeName == "subFlow"){
				// 除了子流程节点,都不要选择子流程
				pro.rows[i].hide = true;
			}
			if (pro.rows[i].nodeLevel == 1) {
				// 类似文本框
				pro.rows[i].value = attr[pro.rows[i].nodeName];
			} else if (pro.rows[i].nodeLevel == 2) {
				// 期限类型-会根据流程信息去取值
				if (attr[pro.rows[i].nodeName1]) {
					pro.rows[i].value = attr[pro.rows[i].nodeName1][pro.rows[i].nodeName2];
				} else {
					pro.rows[i].value = "";
				}
			} else if (pro.rows[i].nodeLevel == 3) {
				// 应用名称应用信息 - 初步认为是只读
				if (attr[pro.rows[i].nodeName1] && attr[pro.rows[i].nodeName1][pro.rows[i].nodeName2]) {
					pro.rows[i].value = attr[pro.rows[i].nodeName1][pro.rows[i].nodeName2][pro.rows[i].nodeName3];
				} else {
					pro.rows[i].value = "";
				}
			}
			if (pro.rows[i].group != group) {
				groupIndex++;
				group = pro.rows[i].group;
				pro.json[groupIndex] = {
					name: group,
					attributes: []
				}
			}
			pro.json[groupIndex]['attributes'].push(pro.rows[i]);
		}
		console.log(pro.json);
		return pro.json;
	}

	// 右侧属性加载
	function loadPropertyDom(data) {
		var des_right = $("#propertyBox");
		des_right.html("");

		var root = $("<DIV class='ds_attr_root'/>");
		var form = $("<form class='layui-form' lay-filter='attr_form' action=''/>").appendTo(root);
		var collapse = $("<div class='layui-collapse lay-accordion' lay-filter='controls_attrs'/>").appendTo(form);

		function fn(attrs, content) {
			_.forEach(attrs, function(obj, index) {
				if (obj.hide) {
					return;
				}
				var item = $("<div class='layui-form-item ds_attr_item'/>");
				item.data("data", obj); 
				var desc = obj.desc ?
					"&nbsp;<i class='desc_icon iconfont icon-color icon-yiwen' title='" + obj.desc + "'></i>" :
					"";
				var label = $("<label>" + obj.name + desc + "</label>");
				var editor = $("<input " +
					(!obj.editor ? "disabled" : "") +
					" name='" + obj.nodeName +
					"' type='" + (obj.editor == 'numberox' ? 'number' : 'text') +
					"' value='" + obj.value +
					"' placeholder='" + (!obj.editor ? "" : "请输入") +
					"' autocomplete='off' class='layui-input'>");
				if (obj.type == 'dialog') {
					// 弹出框
					editor = $("<a class='ds_button ds_button_auxiliary'>设置</a>");
					editor.on('click',doOpenDialog.bind(this,obj))
				} else if (obj.editor == 'textarea') {
					// 文本域
					editor = $("<textarea name='" + obj.nodeName +
						"' placeholder='请输入内容' rows='3' class='layui-textarea'></textarea>");
					editor.val(obj.value);
				} else if (obj.editor && obj.editor.options) {
					// 下拉框
					editor = $("<select lay-filter='attr_select'>" +
						" name='" + obj.nodeName1 + "_" + obj.nodeName2 + "'");

					var options = obj.editor.options.data;
					_.forEach(options, function(opt, key) {
						editor.append($("<option value='" + opt.value + "'>" + opt.text + "</option>"));
					})
					editor.val(obj.value)
				}
				item.append(label);
				item.append(editor);
				content.append(item);
			})
		}

		_.forEach(data,function(obj,key){
			var item = $("<div class='layui-colla-item'>").appendTo(collapse);
			var title = $("<h2 class='layui-colla-title'>" + obj.name + "</h2>").appendTo(item);
			var content = $('<div class="layui-colla-content">').appendTo(item);
			if(key==0){
				content.addClass('layui-show')
			}
			fn(obj.attributes, content);
		})

		des_right.append(root);
		layui.form.render(null, 'attr_form');
		layui.element.render("collapse", "controls_attrs");
		
		if(curSelectObj instanceof DSFA.Line && !data[0]['attributes'][4].value=='0'){
			$(".desginer_right .layui-colla-item:last-child").hide();
		}

		des_right.find('.desc_icon').click(function(evt) {
			if(tipDom==evt.target){
				layui.layer.closeAll('tips');
				tipDom = null;
			}else{
				tipDom = evt.target;
				layui.layer.tips(evt.target.title, evt.target, {
					time: 0,
					skin: 'wf_tip'
				});
			}
		})
		$(document).click(function(evt){
			if($(evt.target).closest(".desc_icon").length==0){
				layui.layer.closeAll('tips');
				tipDom = null;
			}
		})
	}
	
	var tipDom = null;

	// 改变值
	function changeProperty(rowData) {
		if (rowData.nodeName && rowData.nodeName == "Name") {
			if (curSelectObj instanceof DSFA.Node) {
				curSelectObj.name = rowData.value;
				curSelectObj.render();
			}
			if (curSelectObj instanceof DSFA.Lane) {
				curSelectObj.name = rowData.value;
				curSelectObj.render();
			}
		}
		if (rowData.nodeName && rowData.nodeName == "Type") {
			if (curSelectObj instanceof DSFA.Line) {
				if(rowData.value=="0"){
					$(".desginer_right .layui-colla-item:last-child").hide();
				}else{
					$(".desginer_right .layui-colla-item:last-child").show();
				}
				curSelectObj.type = rowData.value;
				curSelectObj.render();
			}
		}
		
		if (rowData.nodeLevel == 1) {
			curNodeObj[rowData.nodeName] = rowData.value;
		} else if (rowData.nodeLevel == 2) {
			curNodeObj[rowData.nodeName1][rowData.nodeName2] = rowData.value;
		} else if (rowData.nodeLevel == 3) {
			curNodeObj[rowData.nodeName1][rowData.nodeName2][rowData.nodeName3] = rowData.value;
		}
	}
	
	window.doOpenDialog = function(rowData) {
		if (!rowData.href) {
			return;
		}
		var data = $.extend({},rowData)
		data.rowData = rowData;
		data.el = curElement;
		data.workFlow = flowInfo;
		data.nodeObj = curNodeObj;
		data.appInfo = AppInfo;
		data.classid = getUrlParam("classid") || "";
		data.flowPlugin = flow;
		console.log(data)
		OpenDialog(data,function(data){
			rowData.value = data;
			changeProperty(rowData);
		});
	}
	
	
	function filterData() {
		var data2 = [];
		var data = table.propertygrid("getData");
		curTableData = $.extend(true, curTableData, data);
		if (getValueByRowName("连线类型", curTableData.rows) == "0") {
			filterObj.hzfw = null;
		} else {
			filterObj.hzfw = true;
		}
		if (getValueByRowName("是否启用", curTableData.rows) == "0") {
			filterObj.cxxx = null;
		} else {
			filterObj.cxxx = true;
		}
		for (var i = 0; i < curTableData.rows.length; i++) {
			if (curTableData.rows[i].group == "汇总信息") {
				if (!filterObj.hzfw) {

				} else {
					data2.push(curTableData.rows[i]);
				}
			} else if (curTableData.rows[i].group == "发送参数" && curTableData.rows[i].name != "是否启用") {
				data2.push(curTableData.rows[i]);
			} else {
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

	window.getAttributes = function(objectPorperty) {
		var attr = {};
		for (var i = 0; i < objectPorperty.rows.length; i++) {
			var row = objectPorperty.rows[i];
			if (row.nodeLevel == 1) {
				attr[row.nodeName] = row.value;
			} else {
				var temp = attr;
				for (var n = 0; n < row.nodeLevel; n++) {
					var index = n + 1;
					var key = row["nodeName" + index];
					if (n < row.nodeLevel - 1) {
						if (temp[key] === undefined) {
							temp[key] = {};
						}
						temp = temp[key];
					} else {
						if (temp[key] === undefined) {
							temp[key] = row.value;
						}
					}
				}
			}
		}
		return attr;
	}

	window.getProptyRows = function() {
		var data = table.propertygrid("getRows");
		return data;
	}
	window.getProptyRowIndex = function(row) {
		var index = table.propertygrid("getRowIndex", row);
		return index;
	}

	window.beginEditPropty = function(rowData) {
		var rowIndex = table.propertygrid("getRowIndex", rowData);
		if (rowData.type && rowData.type == "dialog") {
			doOpenDialog(rowData);
		}
		//解决不能编辑的问题 解决难以获得焦点的问题 duankg
		table.propertygrid("beginEdit", rowIndex);
	}

	


})(DSFA || (DSFA = {}))
