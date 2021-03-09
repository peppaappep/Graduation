/**
 * flow：流程画布对象
 * flowInfo: 进入页面后获取到的流程信息
 * nodePro：'节点'的右侧属性
 * linePro：'连线'的右侧属性
 * flowPro：'面板'的右侧属性
 * lanePro：'泳道'的右侧属性
 * judgementNodePro：'判断节点'右侧属性,其余节点的属性都是nodePro
 */
var isMyTest = false;
var flow = null,
	AppInfo = null,
	flowInfo = null,
	nodePro = NodeProperties(),
	linePro = LineProperties(),
	flowPro = BaseInfoProperties(),
	lanePro = CorridorProperties(),
	judgementNodePro = JudgementNodeProperties(),
	xmlId = isMyTest ? '5b2d48d830c44b509d4fa730fa9d0b9b' : getUrlParam("id"),
	btnParams = {};

//获取此页面的流程信息
$(function() {
	if (!xmlId) {
		layer_message("缺少流程id", false);
		console.error("缺少流程id");
		return
	}
	dsf.queue().step(function(def) {
		var param = {
			sID: xmlId
		}
		dsf.http.request(getWebPath("wfm/getWFDefinition"), param, "GET")
			.done(function(response) {
				if (response.success) {
					flowInfo = response.data.WorkFlow;
					btnParams = {
						sVendorID: flowInfo.BaseInfo.Vendor.ID,
						sAPPID: flowInfo.BaseInfo.Vendor.APP.ID
					}
					def.resolve();
				} else {
					def.reject();
				}
			})
			.error(function() {
				def.reject();
			}).exec();

	}).catch(function() {
		layer_message("流程信息获取不完整", false);
	}).finally(function() {
		flowInit();
	}).exec();
})

// 初始化
function flowInit() {
	//流程插件初始化
	flow = new DSFA.Flow({
		configPath: "wf/scripts/flow.json",
		container: document.getElementById("flow_box"),
		attributes: $.extend(getAttributes(flowPro), flowInfo.BaseInfo)
	});
	flow.init();

	// 绑定流程画布上的事件
	initEvent();

	//加载元素
	if (flowInfo.ElementList && flowInfo.ElementList.Element) {
		var nodes = [],
			lines = [],
			lanes = [],
			Nodes = [],
			Lines = [];
		if (flowInfo.NodeList && flowInfo.NodeList.Node) {
			Nodes = $.isArray(flowInfo.NodeList.Node) ? flowInfo.NodeList.Node : [flowInfo.NodeList.Node];
		}
		if (flowInfo.LineList && flowInfo.LineList.Line) {
			Lines = $.isArray(flowInfo.LineList.Line) ? flowInfo.LineList.Line : [flowInfo.LineList.Line];
		}
		var dataMap = {};
		for (var i = 0; i < Nodes.length; i++) {
			dataMap[Nodes[i].ID] = Nodes[i];
		}
		for (var i = 0; i < Lines.length; i++) {
			dataMap[Lines[i].ID] = Lines[i];
		}
		flowInfo.ElementList.Element = $.isArray(flowInfo.ElementList.Element) ? flowInfo.ElementList.Element : [flowInfo.ElementList
			.Element
		];
		for (var i = 0; i < flowInfo.ElementList.Element.length; i++) {
			var element = flowInfo.ElementList.Element[i];
			//节点
			if (element.nodeType == "node") {
				nodes.push(element);
			}
			//线
			else if (element.nodeType == "line") {
				lines.push(element);
			}
			//泳道
			else if (element.nodeType == "lane") {
				lanes.push(element);
			}
		}
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var attributes = {};
			node["in"] = $.isArray(node["in"]) ? node["in"] : (node["in"] ? [node["in"]] : []);
			node["out"] = $.isArray(node["out"]) ? node["out"] : (node["out"] ? [node["out"]] : []);
			node.point.x = parseFloat(node.point.x);
			node.point.y = parseFloat(node.point.y);

			node = flow.execCommand("addNode", {
				"id": node.id,
				"name": node.name,
				"type": node.type,
				"x": node.point.x,
				"y": node.point.y,
				"attributes": node.attributes
			});
		}
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var attributes = {};
			if (dataMap[node.id]) {
				attributes = dataMap[line.id];
			}
			if (line.linkInfo) {
				line.linkInfo.fromOffset = parseFloat(line.linkInfo.fromOffset);
				line.linkInfo.toOffset = parseFloat(line.linkInfo.toOffset);
			}
			line = flow.execCommand("addLine", {
				id: line.id,
				type: line.type,
				name: line.name,
				path: line.path,
				from: line.from,
				to: line.to,
				linkInfo: line.linkInfo,
				attributes: line.attributes
			});
		}
		for (var i = 0; i < lanes.length; i++) {
			var lane = lanes[i];
			flow.execCommand("addLane", {
				id: lane.id,
				name: lane.name,
				size: lane.size,
				index: lane.index,
				direction: lane.direction,
				attributes: lane.attributes
			});
		}
	}

	//左侧节点拖拽
	$(".ds_tool_item").draggable({
		'helper': "clone",
		'appendTo': "body",
		'revert': function(dropUi) {
			if (dropUi) {
				if (dropUi.hasClass("svgRoot")) {
					return false;
				}
			}
			return true;
		},
		'drag': function(evt, ui) {
			//console.log("a")
		},
		'zIndex': 99999,
		'accept': function(a, b, c) {
			console.log();
			return false;
		},
		'cursorAt': {
			left: -10,
			top: -10
		},
		'containment': 'window'
	});
	//拖拽后盛放的容器
	$(".svgRoot").droppable({
		'accept': '.ds_tool_item',
		'drop': function(evt, ui) {
			var type = ui.draggable.attr("flowNodeType");
			flow.execCommand("addNode", {
				type: type,
				x: evt.pageX,
				y: evt.pageY,
				mouseConvert: true
			})
		}
	});
	// 加载右侧属性
	loadPropertyWindow(flow);
}

//绑定事件
function initEvent() {
	$(window).on('resize', function() {
		if (flow && flow.resize) {
			flow.resize();
		}
	})

	// 按钮的子按钮显示隐藏
	$(".desginer_tools .ds_button").hover(function() {
		$(this).addClass('hover');
	}, function() {
		$(this).removeClass('hover');
	})

	// 点击保存按钮
	$("#btn_Save").on('click', function(evt) {
		doSave();
	})
	// 点击连线按钮
	$("#btn_Path").on('click', function(evt) {
		setState('drawLine', evt);
	})
	// 点击泳道(垂直)按钮
	$("#lane_vertical").on('click', function(evt) {
		addLane('vertical');
	})
	// 点击泳道(水平)按钮
	$("#lane_horizontal").on('click', function(evt) {
		addLane('horizontal');
	})

	//点击面板的时候会触发
	flow.on("panel.selected", function(evt, ui) {
		loadPropertyWindow(ui);
	})

	//节点渲染事件
	flow.on("node.render", function(evt, ui) {
		if ($.isEmptyObject(ui.attributes)) {
			ui.attributes = ui.type == "6" ? getAttributes(judgementNodePro) : getAttributes(nodePro);
		}
		ui.attributes.Name = ui.name;
		ui.attributes.ID = ui.id;
		ui.attributes.Type = ui.type;
	});
	//选中节点
	flow.on("node.selected line.selected", function(evt, ui) {
		loadPropertyWindow(ui);
	});
	//双击节点
	flow.on("node.dblclick", function(evt, ui) {
		var attrs = null,
			defaultAttr = null;
		if (ui.type == "6") {
			attrs = getProptyRows();
		}
		if (attrs) {
			for (var i = 0; i < attrs.length; i++) {
				if (attrs[i].isDefault) {
					defaultAttr = attrs[i];
					break;
				}
			}
			if (defaultAttr) {
				var index = getProptyRowIndex(defaultAttr);
				beginEditPropty(defaultAttr);
			}
		}
	})
	//双击会修改节点名-节点名字修改后
	flow.on("node.editNameAfter", function(evt, ui) {
		ui.attributes.Name = ui.name;
		ui.attributes.ID = ui.id;
		ui.attributes.Type = ui.type;
		for (var i = 0; i < ui["out"].length; i++) {
			var line = flow.getObjectById(ui["out"][i]);
			if (line) {
				var fnode = flow.getObjectById(line.from);
				var tnode = flow.getObjectById(line.to);
				line.name = fnode.name + "→" + tnode.name;
				line.attributes.Name = line.name;
			}
		}
		for (var i = 0; i < ui["in"].length; i++) {
			var line = flow.getObjectById(ui["in"][i]);
			if (line) {
				var fnode = flow.getObjectById(line.from);
				var tnode = flow.getObjectById(line.to);
				line.name = fnode.name + "→" + tnode.name;
				line.attributes.Name = line.name;
			}
		}
		loadPropertyWindow(ui);
	});
	// 节点移除前
	flow.on("node.removeBefore", function(evt, ui) {
		if (ui.type == "6") {
			//删除判断节点后自动取消掉上一步骤节点中的发送条件将是否启用发送条件设置成否
			var fromNodes = flow.getFromNodes(ui);
			if (fromNodes) {
				for (var i = 0; i < fromNodes.length; i++) {
					var node = fromNodes[i];
					node.attributes.OutLine.SendConditions = {
						"IsEnabled": "0"
					};
				}
			}
		}
	});

	// 泳道渲染
	flow.on("lane.render", function(evt, ui) {
		if ($.isEmptyObject(ui.attributes)) {
			ui.attributes = getAttributes(lanePro);
		}
		ui.attributes.Name = ui.name;
		ui.attributes.ID = ui.id;
	})
	// 泳道选中
	flow.on("lane.selected", function(evt, ui) {
		loadPropertyWindow(ui);
	});
	//泳道名称编辑
	flow.on("lane.editNameAfter", function(evt, ui) {
		ui.attributes.ID = ui.id;
		ui.attributes.Name = ui.name;
		loadPropertyWindow(ui);
	});

	//线段链接完毕
	flow.on("line.joined", function(evt, ui) {
		if ($.isEmptyObject(ui.attributes)) {
			ui.attributes = getAttributes(linePro);
		}
		var fnode = flow.getObjectById(ui.from);
		var tnode = flow.getObjectById(ui.to);
		ui.attributes.StartNodeID = ui.from;
		ui.attributes.EndNodeID = ui.to;
		ui.name = fnode.name + "→" + tnode.name;
		ui.attributes.Name = ui.name;
		ui.attributes.ID = ui.id;
		if (fnode.type == "6") {
			var attributes = fnode.attributes;
			//如果有发送条件
			if (attributes.OutLine.SendConditions && attributes.OutLine.SendConditions.Condition) {
				var lines = null;
				try {
					lines = attributes.OutLine.SendConditions.Condition.Switch.ItemValue;
				} catch (ex) {
					lines = null;
				}
				if (lines) {
					var isExist = false;
					for (var n = 0; n < lines.length; n++) {
						var l = lines[n];
						if (l.LineID == ui.id) {
							isExist = true;
							break;
						}
					}
					if (!isExist) {
						var lineValue = {
							Value: "",
							Type: "8",
							"LineID": ui.id,
							"LineName": ui.name
						}
						lines.push(lineValue);
					}
				}
			}
		}
	});
	// 连线移除之前
	flow.on("line.removeBefore", function(evt, ui) {
		console.log("移除线:" + ui.name)
	});
	// 连线删除之后
	flow.on("line.removeAfter", function(evt, ui) {
		if (ui.from) {
			var node = flow.getObjectById(ui.from);
			var attributes = node.attributes;
			//如果是判断节点
			if (node && node.type == "6") {
				//如果有发送条件
				if (attributes.OutLine.SendConditions && attributes.OutLine.SendConditions.Condition) {
					var lines = null;
					try {
						lines = attributes.OutLine.SendConditions.Condition.Switch.ItemValue;
					} catch (ex) {
						lines = null;
					}
					if (lines) {
						var _index = -1;
						for (var n = 0; n < lines.length; n++) {
							var l = lines[n];
							if (l.ID == ui.id) {
								_index = n;
								break;
							}
						}
						if (_index >= 0) {
							lines.splice(_index, 1);
						}
					}
				}
			}
		}
	})
}

// 保存按钮
function doSave() {
	var loadingIndex = dsf.layer.loadding();
	var postData = {
		"ID": xmlId,
		"WorkFlow": {
			"BaseInfo": flow.attributes,
			"NodeList": {
				"Node": []
			},
			"LineList": {
				"Line": []
			},
			"Corridor": {
				"CorridorList": {
					"Corridor": []
				},
				"StageList": {
					"Stage": []
				}
			},
			"ElementList": {
				"Element": []
			}
		}
	}
	var info = flow.getPanelInfo();

	//深度复制对象作为流程引擎使用
	var infoCopy = JSON.parse(JSON.stringify(info));
	var copyMap = getFlowAllObjectMap(infoCopy);

	var temp = [],
		deleteLines = [];
	//判断节点特殊操作
	for (var i = 0; i < infoCopy.nodes.length; i++) {
		var node = infoCopy.nodes[i];
		//如果为判断节点 开始
		if (node.type == "6") {
			//获取该节点的上一步节点
			var fromNodearr = [],
				toNodearr = [];
			var arr = flow.getFromNodes(node);
			if (arr) {
				for (var n = 0; n < arr.length; n++) {
					var nc = arr[n];
					fromNodearr.push(copyMap[nc.id]);
				}
			}
			//获取该节点的下一步个节点
			arr = flow.getToNodes(node);
			if (arr) {
				for (var n = 0; n < arr.length; n++) {
					var nc = arr[n];
					toNodearr.push(copyMap[nc.id]);
				}
			}
			var obj = {
				"node": node,
				"from": fromNodearr,
				"to": toNodearr
			};
			temp.push(obj);
		}
	}
	for (var i = 0; i < temp.length; i++) {
		var obj = temp[i];
		var node = obj.node;
		//判断有没有下一步节点
		if (obj.node["out"].length > 0) {
			//将判断节点的的出线全部复制给上一步的节点
			for (var c = 0; c < obj.from.length; c++) {
				var fn = obj.from[c];
				for (var n = 0; n < obj.node["out"].length; n++) {
					var lineId = obj.node["out"][n];
					var line_copy = $.extend(true, {}, copyMap[lineId]);
					line_copy.attributes.ID = line_copy.id + "_" + fn.id;
					line_copy.attributes.StartNodeID = fn.id;
					infoCopy.lines.push(line_copy);
					deleteLines.push(lineId);
				}
				fn.attributes.OutLine.SendConditions = obj.node.attributes.OutLine.SendConditions;
				var rfn = flow.getObjectById(fn.id);
				if (rfn) {
					rfn.attributes.OutLine.SendConditions = obj.node.attributes.OutLine.SendConditions;
				}
			}
			//删除判断节点入线
			for (var c = 0; c < obj.node["in"].length; c++) {
				deleteLines.push(obj.node["in"][c]);
			}
		} else {
			for (var c = 0; c < obj.from.length; c++) {
				var fn = obj.from[c];
				fn.attributes.OutLine.SendConditions = {
					"IsEnabled": "0"
				};
				var rfn = flow.getObjectById(fn.id);
				if (rfn) {
					rfn.attributes.OutLine.SendConditions = {
						"IsEnabled": "0"
					};
				}
			}
		}
	}
	//删除多余的线
	for (var i = 0; i < deleteLines.length; i++) {
		for (var n = infoCopy.lines.length - 1; n >= 0; n--) {
			if (infoCopy.lines[n].attributes.ID == deleteLines[i]) {
				infoCopy.lines.splice(n, 1);
			}
		}
	}
	//判断节点特殊操作 结束
	for (var i = 0; i < infoCopy.nodes.length; i++) {
		var node = infoCopy.nodes[i];
		postData.WorkFlow.NodeList.Node.push(node.attributes);
	}
	for (var i = 0; i < infoCopy.lines.length; i++) {
		var line = infoCopy.lines[i];
		postData.WorkFlow.LineList.Line.push(line.attributes);
	}

	//整理传递给后台的保存参数
	for (var i = 0; i < info.nodes.length; i++) {
		var node = info.nodes[i];
		var n = $.extend({}, node);
		delete n.isRender;
		delete n.width;
		delete n.height;
		n.nodeType = "node";
		postData.WorkFlow.ElementList.Element.push(n);
	}
	for (var i = 0; i < info.lines.length; i++) {
		var line = info.lines[i];
		var n = $.extend({}, line);
		delete n.strokeWidth;
		delete n.stroke;
		delete n.arrowEnd;
		delete n.isRender;
		n.nodeType = "line";
		postData.WorkFlow.ElementList.Element.push(n);
	}

	for (var i = 0; i < info.lanes.horizontal.length; i++) {
		var lane = info.lanes.horizontal[i];
		var n = $.extend({}, lane);
		delete n.isRender;
		postData.WorkFlow.Corridor.CorridorList.Corridor.push(lane.attributes);
		n.nodeType = "lane";
		postData.WorkFlow.ElementList.Element.push(n);
	}
	for (var i = 0; i < info.lanes.vertical.length; i++) {
		var lane = info.lanes.vertical[i];
		var n = $.extend({}, lane);
		delete n.isRender;
		postData.WorkFlow.Corridor.StageList.Stage.push(lane.attributes);
		n.nodeType = "lane";
		postData.WorkFlow.ElementList.Element.push(n);
	}
	var param = {
		"sData": JSON.stringify(postData)
	}
	dsf.http.request(getWebPath("wfm/saveWFDefinition"), param, "POST")
		.done(function(result) {
			if (result.success) {
				dsf.layer.message("保存成功", true);
			} else {
				dsf.layer.message("保存失败", false);
			}
		})
		.error(function() {
			dsf.layer.message("保存失败", false);
		})
		.always(function() {
			dsf.layer.close(loadingIndex);
		})
		.exec();
}

function getFlowAllObjectMap(info) {
	var dm = {};
	for (var i = 0; i < info.nodes.length; i++) {
		var node = info.nodes[i];
		dm[node.id] = node;
	}
	for (var i = 0; i < info.lines.length; i++) {
		var line = info.lines[i];
		dm[line.id] = line;
	}
	for (var i = 0; i < info.lanes.horizontal.length; i++) {
		var lane = info.lanes.horizontal[i];
		dm[lane.id] = lane;
	}
	for (var i = 0; i < info.lanes.vertical.length; i++) {
		var lane = info.lanes.vertical[i];
		dm[lane.id] = lane;
	}
	return dm;
}

// 点击"连线"按钮
function setState(state, evt) {
	$(".desginer_tools .ds_button.selected").removeClass("selected");
	if (flow.state != state) {
		flow.execCommand("setState", state);
		$(evt.currentTarget).addClass("selected");
	} else {
		flow.execCommand("clearState");
	}
}

// 添加泳道
function addLane(direction) {
	flow.execCommand("addLane", {
		"direction": direction
	})
}

// 导出xml
function exportFlow() {
	var url = dsf.url.getWebPath("admin_client/workflow/Vendor/" + btnParams.sVendorID + "/" + btnParams.sAPPID +
		"/config/" + xmlId + ".xml");
	$('<form action="' + url + '" method="get">' +
			'<input type="text" name="zipName" value="流程定义.xml"/>' +
			'</form>')
		.appendTo('body').submit().remove();
}

// 在线预览
function openFlow() {
	var url = getWebPath("/admin_client/workflow/Vendor/" + btnParams.sVendorID + "/" + btnParams.sAPPID + "/config/" +
		xmlId +
		".xml");
	window.open(url);
}

// 点击"模拟测试"按钮
function startTestFlow() {
	var url = getWebPath("/admin_client/workflow/views/selectSendUser.htm?wfid=" + xmlId);

	var selectUserDialog = OpenDialog({
		"area": ['360px', '450px'],
		"title": "选择拟稿人",
		"content": url,
		// "closeBtn": 0,
		"btn": [{
			"text": "确定",
			"handler": function() {
				var iframe = selectUserDialog.find("iframe");
				var win = iframe.get(0).contentWindow;
				var selectUser = win.getReturnValue();
				if (!selectUser) return;

				var wfid = xmlId;
				var userId = selectUser.id;;
				var userName = selectUser.text;
				var deptId = selectUser.attributes.DeptID;
				var deptName = selectUser.attributes.DeptName;
				var sendRequest = [];
				var objectid = new Date().format("yyyymmddHHmmss");
				var objecttitle = new Date().format("yyyymmddHHmmss");

				var tpId = "";
				var linkId = "";
				sendRequest.push({
					"objectid": objectid,
					"objecttitle": objecttitle,
					"tpId": tpId,
					"linkId": linkId,
					"exInfo": {
						"test1": "1",
						"test2": "2",
						"NODE_COMMENT": {
							"text": "同意意见测试2017年7月19日14:52:55",
							"time": "",
							"Sender": {
								"UserName": ""
							},
							"fileList": [

							]
						}
					}
				});
				var sendParameter = {
					"wfid": wfid,
					"type": "SR_SEND",
					"userId": userId,
					"userName": userName,
					"deptId": deptId,
					"deptName": deptName,
					"links": sendRequest
				};

				var token = getServerData({
					"SendRequest": sendParameter
				}, "admin_client/workflow/interface/getSendToken.xml").Result.token;;

				var url = getWebPath("/admin_client/workflow/views/sendbytoken.htm?token=" + token);
				sendDialog = parent.OpenDialog({
					"maximized": true,
					"title": "",
					"cancelButton": true,
					"isFrame": true,
					"dialogArgs": {},
					"content": url,
					"buttons": []
				});
				selectUserDialog.dialog("close");
			}
		}]
	});
}

// 点击"监控"按钮
function monitorFlow(tpid) {
	var url = getWebPath("/admin_client/workflow/views/showProcess.htm?s=1&" +
		"wid=" + xmlId + "&" +
		"tpid=" + (tpid || ""));

	OpenDialog({
		"title": "流程模拟发送测试",
		"content": url,
		"area": ['400px', '500px']
	});
}

// 点击"查看人员组织架构"按钮
function showOrgInfo() {
	dsf.layer.message("人员组织机构较大，耐心等待!");
	setTimeout(function() {
		var url = getWebPath("/admin_client/workflow/Vendor/" + btnParams.sVendorID + "/" + btnParams.sAPPID +
			"/appinfo/OrgTree.xml");
		window.open(url);
	}, 1000)

}
