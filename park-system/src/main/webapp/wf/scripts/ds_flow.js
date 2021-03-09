/**
 * Page=>画布
 */
var DSFA;
(function(dsfa) {
    var LaneDirection = {
        "vertical": "vertical",
        "horizontal": "horizontal"
    }
    var _Direction = {
        Left: "left",
        Right: "right",
        Top: "top",
        Bottom: "bottom",
        LeftTop: "leftTop",
        LeftBottom: "leftBottom",
        RightTop: "rightTop",
        RightBottom: "rightBottom"
    }
    var _LineType = {
        "vertical": "vertical",
        "horizontal": "horizontal"
    }
    var LineDirection = {
        Left: "left",
        Right: "right",
        Top: "top",
        Bottom: "bottom"
    }
    var nodeSize = { width: 60, height: 60 };
    var hitOffsetNum = 20;
    var lineOffsetNum = 30;
    var scale = 10;
    var centerOffset = scale;
    var dragSize = 20;
    var maxWidth = 0,
        maxHeight = 0,
        maxSizeOffset = 50;
    var nodePosition = { x: {}, y: {} },
        nodePosition_map = {};
    var baseLine_v, baseLine_h;
    //线与线之间过渡的圆弧半径
    var transitionRadius = 7;
    var isGlobalPosMove = false;
    var globalPos = null;
    var globalRect = null;
    var globalMoveLastMouse = null;

    function getConfig(configPath) {
        var result = null;
        let url = dsf.url.getWebPath(configPath);
        dsf.http.request_sync(url, null, "GET")
            .done(function(response) {
                result = response;
            })
            .error(function(response) {
                result = null;
            }).exec();
        return result;
    }
	/**
	 * 实例化
	 * @param {Object} 
	 * Object.configPath: "dsfa/wf/res/flow.json",
	 * Object.container: document.getElementById("flow_box"),
	 * Object.attributes: $.extend(getAttributes(flowPro), flowInfo.BaseInfo)
	 */
	dsfa.Flow = function(options) {
        var self = this;
        var currentLineInfo = null;
        var currentMouseDrawingLine = null;
        var currentDragLine = null;
        var selectedObjectList = [];
        var isMouseInNode = false;
        var objectMap = {};
        var zoom = 1;
        if (!options.container) {
            throw "渲染组件的容器无效";
        }
        if (!options.configPath) {
            throw "未指定流程配置文件路径";
        }
        this.options = options;
        this.state = "";
        this.container = $(options.container);
        this.parentElement = this.container.parent();
        this.paper = null;
        this.flowConfig = null;
        this.svgRoot = null;
        this.nodeBox = null;
        this.root = null;
        this.backgroundLayout = null;
        this.lane_vertical = null;
        this.lane_horizontal = null;
        this.currentCommand = "";
        this.Lanes = {
            "vertical": [],
            "horizontal": []
        }
        this.nodes = [];
        this.lines = [];
        this.attributes = $.extend(true, {}, options.attributes);
        this.init = function() {
            self.container.addClass("flow");
            if (options.readOnly) {
                self.container.addClass("readonly");
            }
            self.flowConfig = getConfig(options.configPath); // getXmlObj(options.configPath);
            self.width = self.parentElement.innerWidth();
            self.height = self.parentElement.innerHeight();
            self.createRoot();
            self.createCanvas();
            self.createBackgroundLayout();
			// 载入私有方法(root内鼠标按下事件、root内鼠标移动事件、root内双击编辑事件、泳道插入事件)
            attachEvents.call(self);

			// 节点移动事件
            self.on("node.move", defaultHandler.moveNode);
			
            self.on("renderLineBefore.dodge", defaultHandler.renderLineBefore);
            self.on("node.removeAfter", defaultHandler.objectRemove);
            self.on("line.removeAfter", defaultHandler.objectRemove);
            self.on("lane.removeAfter", defaultHandler.objectRemove);
            self.on("node.editName", defaultHandler.editNodeName);
            self.on("lane.editName", defaultHandler.editLandName);

            //禁止浏览器自带的拖动
            self.container.bind("dragstart select", function() {
                return false;
            });

        }
		
		// 创建流程画布的父元素.root
		this.createRoot = function() {
		    this.root = $("<div/>");
		    this.root.addClass("root");
		    maxWidth = this.width; //this.container.width();
		    maxHeight = this.height; //this.container.height();
		    this.root.width(this.width).height(this.height);
		    this.root.appendTo(this.container);
		    baseLine_v = $("<span class='baseLine_v'>").appendTo(self.root);
		    baseLine_h = $("<span class='baseLine_h'>").appendTo(self.root);
		
		}

		//创建一个svg节点
        this.createCanvas = function() {
			this.svgRoot = $("<div/>");
			this.svgRoot.addClass("svgRoot");
			this.svgRoot.appendTo(self.root);
			this.svgRoot.width()
			this.paper = new Raphael(self.svgRoot.get(0), "100%", "100%");
		}
		
        //创建一个背景层
        this.createBackgroundLayout = function() {
            this.backgroundLayout = $("<div/>");
            this.backgroundLayout.addClass("backgroundLayout");
            this.backgroundLayout.appendTo(self.root);
            this.lane_vertical = $("<div class='v_lane'/>").appendTo(this.backgroundLayout);
            this.lane_horizontal = $("<div class='h_lane'/>").appendTo(this.backgroundLayout);;
        }
		
		//绑定事件
        this.on = function(eventType, handler) {
			this.root.bind(eventType, handler);
		}
		//解除事件绑定
        this.off = function(eventType, handler) {
            this.root.unbind(eventType, handler);
        }

        this.trigger = function(eventType, args) {
            this.root.trigger(eventType, args);
        }
        
        //获取对象
        this.getObjectById = function(id) {
            if (objectMap[id]) {
                return objectMap[id];
            }
            return null;
        }

        //获取上一步节点
        this.getFromNodes = function(node) {
            if (!node["in"] || node["in"].length <= 0) {
                return null;
            }
            var arr = [];
            for (var i = 0; i < node["in"].length; i++) {
                var lineId = node["in"][i];
                var line = objectMap[lineId];
                if (line) {
                    var fn = this.getObjectById(line.from);
                    arr.push(fn);
                }
            }
            return arr;
        }

        //获取下一步节点
        this.getToNodes = function(node) {
            if (!node["out"] || node["out"].length <= 0) {
                return null;
            }
            var arr = [];
            for (var i = 0; i < node["out"].length; i++) {
                var lineId = node["out"][i];
                var line = objectMap[lineId];
                if (line) {
                    var fn = this.getObjectById(line.to);
                    arr.push(fn);
                }
            }
            return arr;
        }

        //移除对象
        this.removeInPanel = function(obj) {
            var self = this;
            if (obj instanceof DSFA.Node) {
                self.trigger("node.removeBefore", obj);
            }
            if (obj instanceof DSFA.Line) {
                self.trigger("line.removeBefore", obj);
            }
            if (obj instanceof DSFA.Lane) {
                self.trigger("lane.removeBefore", obj);
            }
            obj.remove();
            if (obj instanceof DSFA.Node) {
                self.trigger("node.removeAfter", obj);
                setNodePosition();
            }
            if (obj instanceof DSFA.Line) {
                self.trigger("line.removeAfter", obj);
            }
            if (obj instanceof DSFA.Lane) {
                window.setTimeout(function() {
                    self.trigger("lane.removeAfter", obj);
                }, 300)
            }
        }

        //添加对象
        this.addToPanel = function(obj) {
            var attachSize = maxSizeOffset,
                changeFlowSize = false;
            var isUpdateIntersection = false;
            if (obj instanceof DSFA.Node) {
                this.nodes.push(obj);
                if (parseFloat(obj.point.x) + parseFloat(obj.width) + attachSize > maxWidth) {
                    maxWidth = parseFloat(obj.point.x) + parseFloat(obj.width) + attachSize;
                    changeFlowSize = true;
                }
                if (parseFloat(obj.point.y) + parseFloat(obj.height) + attachSize + 30 > maxHeight) {
                    maxHeight = parseFloat(obj.point.y) + parseFloat(obj.height) + attachSize + 30;
                    changeFlowSize = true;
                }
                setNodePosition();
            } else if (obj instanceof DSFA.Line) {
                this.lines.push(obj);
                isUpdateIntersection = true;
                for (var i = 0; i < obj.path.length; i++) {
                    var p = obj.path[i];
                    if (parseFloat(p.x) + attachSize > maxWidth) {
                        maxWidth = parseFloat(p.x) + attachSize;
                        changeFlowSize = true;
                    }
                    if (parseFloat(p.y) + attachSize > maxWidth) {
                        maxHeight = parseFloat(p.y) + attachSize;
                        changeFlowSize = true;
                    }
                }
            } else if (obj instanceof DSFA.Lane) {
                if (obj.index === undefined) {
                    this.Lanes[obj.direction].push(obj);
                } else {
                    this.Lanes[obj.direction].splice(obj.index, 0, obj);
                }

                var size = 0;
                for (var i = 0; i < this.Lanes[obj.direction].length; i++) {
                    if (this.Lanes[obj.direction][i]) {
                        this.Lanes[obj.direction][i].index = i;
                        size += parseFloat(this.Lanes[obj.direction][i].size);
                    }

                }
                if (obj.direction == LaneDirection.vertical) {
                    if (size > maxWidth) {
                        maxWidth = size;
                        changeFlowSize = true;
                    }
                    if (!this.root.hasClass("has_v_head")) {
                        checkIsExistLane();
                        changeFlowSize = true;
                    }
                }
                if (obj.direction == LaneDirection.horizontal) {
                    if (size > maxHeight) {
                        maxHeight = size;
                        changeFlowSize = true;
                    }
                    if (!this.root.hasClass("has_h_head")) {
                        checkIsExistLane();
                        changeFlowSize = true;
                    }
                }
            }
            if (changeFlowSize) {
                rootResize.call(this);
            }
            if (!obj.id) {
                obj.id = tools.uuid();
            }
            if (obj.render) {
                objectMap[obj.id] = obj;
                obj.render();
                if (isUpdateIntersection) {
                    updateIntersection();
                }
            }

        }

        //选中对象
        this.selected = function(obj) {
            if (selectedObjectList.indexOf(obj) <= 0) {
                selectedObjectList.push(obj);
            }
            obj.selected(obj);
        }
        this.unSelected = function(obj) {
            var index = selectedObjectList.indexOf(obj);
            if (index <= 0) {
                selectedObjectList.splice(index, 1);
            }
            obj.unSelected();
        }

        //获取坐标所在的网格坐标
        this.getGridPoint = function(p) {
            var result = {
                x: p.x == undefined ? 0 : p.x,
                y: p.y == undefined ? 0 : p.y
            };
            if (result.x != 0) {
                var mo_x = result.x % scale;
                if (mo_x != 0) {
                    if (mo_x > scale / 2) {
                        result.x = result.x - mo_x + scale;
                    } else {
                        result.x = result.x - mo_x;
                    }
                }

            }
            if (result.y != 0) {
                var mo_y = result.y % scale;
                if (mo_y != 0) {
                    if (mo_y > scale / 2) {
                        result.y = result.y - mo_y + scale;
                    } else {
                        result.y = result.y - mo_y;
                    }

                }
            }
            return result;
        }
        this.destroy = function() {
			$(document).unbind("keydown.flowkeydown");
		}
        //获取画布信息
        this.getPanelInfo = function() {
            var result = {
                "nodes": this.nodes,
                "lines": this.lines,
                "lanes": this.Lanes
            }
            console.log(result);
            return result;
            // console.log(this.nodes);
            // console.log(this.lines);
            // console.log(this.Lanes);
            // console.log(objectMap)
        }
        this.resize = function() {
            rootResize.call(this, true);
        }

        //退出命令
        this.exitCommand = function() {
                this.currentCommand = "";
            }
        //执行命令
        this.execCommand = function(command, args) {
            this.currentCommand = command;
            if (_command[command]) {
                args = $.isArray(args) ? args : [args];
                return _command[command].apply(this, args);
            }
        }

        this.zoom = function(zoomValue) {
            if (zoomValue == undefined) {
                return zoom;
            }
            zoom = zoomValue;
            if (zoom > 1) {
                zoom = 1;
            }

            //火狐特殊判断，火狐不支持zoom样式
            var nAgt = navigator.userAgent;
            if (nAgt.indexOf("Firefox") != -1) {
                self.backgroundLayout.css("transform-origin", "left top");
                self.backgroundLayout.css("-ms-transform-origin", "left top");
                self.backgroundLayout.css("-moz-transform-origin", "left top");
                self.backgroundLayout.css("-o-transform-origin", "left top");

                self.backgroundLayout.css("transform", "scale(" + zoom + ")");
                self.backgroundLayout.css("-ms-transform", "scale(" + zoom + ")");
                self.backgroundLayout.css("-webkit-transform", "scale(" + zoom + ")");
                self.backgroundLayout.css("-o-transform", "scale(" + zoom + ")");

                self.svgRoot.css("transform-origin", "left top");
                self.svgRoot.css("-ms-transform-origin", "left top");
                self.svgRoot.css("-moz-transform-origin", "left top");
                self.svgRoot.css("-o-transform-origin", "left top");

                self.svgRoot.css("transform", "scale(" + zoom + ")");
                self.svgRoot.css("-ms-transform", "scale(" + zoom + ")");
                self.svgRoot.css("-webkit-transform", "scale(" + zoom + ")");
                self.svgRoot.css("-o-transform", "scale(" + zoom + ")");
            } else {
                self.backgroundLayout.css("zoom", zoom);
                self.svgRoot.css("zoom", zoom);
            }
            if (zoom < 1) {
                self.backgroundLayout.width(self.root.width() / zoom).height(self.root.height() / zoom);
                var svgRootOffset = getSvgOffset();
                self.svgRoot.width(self.root.width() / zoom - svgRootOffset.left).height(self.root.height() / zoom - svgRootOffset.top);
            } else {
                //移除所有因缩放而附加的样式
                var deleteStyle = ["transform", "transform-origin", "width", 'height', 'zoom'];
                var arr = self.backgroundLayout.get(0).style.cssText.split(";");
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i]) {
                        var style = arr[i].split(":");
                        var index = $.isArray($.trim(style[0]), deleteStyle);
                        if (index >= 0) {
                            arr.splice(i, 1);
                        }
                    }
                }
                self.backgroundLayout.get(0).style.cssText = arr.join(";");

                arr = self.svgRoot.get(0).style.cssText.split(";");
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (arr[i]) {
                        var style = arr[i].split(":");
                        var index = $.isArray($.trim(style[0]), deleteStyle);
                        if (index >= 0) {
                            arr.splice(i, 1);
                        }
                    }
                }
                self.svgRoot.get(0).style.cssText = arr.join(";");
            }

        }

        //私有方法==========================================
        //附加事件
        var attachEvents = function() {
            var self = this;

            var lineDraging = false;
            //鼠标按下
            this.root.on("mousedown", clickPanelHander);
            
			//鼠标移动过程中的操作
            this.root.bind("mousemove.rootmove", function(evt) {
                if (self.options.readOnly) {
                    return;
                }
                if (evt.target.tagName != 'svg') {
                    var className = evt.target.className || "";
                    if (evt.target.tagName == "path") {
                        var segmen = DSFA.Segmen.getObjectByTarget(evt.target);
                        if (segmen) {
                            var line = segmen.getLine();
                            var mp = getMousePointByCanvas({ x: evt.pageX, y: evt.pageY });
                            if (segmen.type == _LineType.horizontal) {
                                if (segmen.index == 0 && Math.abs(segmen.sp.x - mp.x) <= dragSize) {
                                    self.root.css("cursor", "move");
                                } else if (segmen.isLast && Math.abs(segmen.ep.x - mp.x) <= dragSize) {
                                    self.root.css("cursor", "move");
                                } else {
                                    self.root.css("cursor", "ns-resize");
                                }
                            } else {
                                if (segmen.index == 0 && Math.abs(segmen.sp.y - mp.y) <= dragSize) {
                                    self.root.css("cursor", "move");
                                } else if (segmen.isLast && Math.abs(segmen.ep.y - mp.y) <= dragSize) {
                                    self.root.css("cursor", "move");
                                } else {
                                    self.root.css("cursor", "ew-resize");
                                }
                            }
                        }
                    } else if (className.indexOf("nodeOuter") >= 0) {
                        if (self.state == "drawLine") {
                            var target = evt.target;
                            if ($(target).parent().hasClass("nodeOuter")) {
                                target = target.parentNode;
                            }
                            var node = DSFA.Node.getObjectByTarget(target);
                            if (node) {
                                node.showJoinPoint();
                                self.root.bind("mouseover.hiddenJoinPoint", function(evt) {
                                    var enterTarget = evt.target;
                                    if (enterTarget != target && enterTarget.parentNode != target) {
                                        self.root.unbind("mouseover.hiddenJoinPoint")
                                        node.hideJoinPoint();
                                    }
                                    return false;
                                })
                            }
                        }
                        if (evt.target.className.indexOf("nodeOuter") >= 0) {
                            return false;
                        }
                    }
                } else {
                    if (!lineDraging) {
                        self.root.css("cursor", "default");
                    }
                }

                //console.log(evt.target.tagName)
                if (evt.target.tagName != "INPUT" && evt.target.tagName != "TEXTAREA") {
                    evt.preventDefault();
                }
            });

            //鼠标拖动线
            $(document).bind("keydown.flowkeydown", function(evt) {
                //del键删除对象
                if (self.options.readOnly) {
                    return;
                }
                if (evt.keyCode == 46) {
                    for (var i = 0; i < selectedObjectList.length; i++) {
                        var obj = selectedObjectList[i];
                        self.removeInPanel(obj);
                    }
                }
            });

            //双击编辑
            this.root.on("dblclick", function(evt) {
                if (self.options.readOnly) {
                    return;
                }
                var target = $(evt.target);
                if (target.get(0).tagName == "SPAN" && target.hasClass("nodename")) {
                    var node = target.data("object");
                    self.trigger("node.editName", node);
                }
                if (target.hasClass("textContent") && target.is(".lane span")) {
                    var lane = target.closest(".lane").data("object");
                    self.trigger("lane.editName", lane);
                }
                if (target.hasClass("node")) {
                    var node = target.data("object");
                    self.trigger("node.dblclick", node);
                }
            });

            //泳道插入
            this.root.on("click", ".lane .plus", function(evt) {
                if (self.options.readOnly) {
                    return;
                }
                var target = $(evt.target);
                var laneEl = target.closest(".lane");
                var lane = DSFA.Lane.getObjectByTarget(laneEl);
                if (target.hasClass("left")) {
                    var index = lane.index;
                    createLane.call(self, { "index": index, "direction": lane.direction });
                } else if (target.hasClass("right")) {
                    var index = lane.index + 1;
                    createLane.call(self, { "index": index, "direction": lane.direction });
                }
                for (var i = 0; i < self.Lanes[lane.direction].length; i++) {
                    self.Lanes[lane.direction][i].render();
                }
            });
        }

        //默认事件处理
        var defaultHandler = {
            //移动节点
            "moveNode": function(evt, ui) {
                var node = ui;
                if (node.out && node.out.length > 0) {
                    for (var i = 0; i < node.out.length; i++) {
                        var lineId = node.out[i];
                        var line = self.getObjectById(lineId);
                        var from = self.getObjectById(line.from);
                        var to = self.getObjectById(line.to);
                        var linkinfo = line.linkInfo;
                        var f_center = tools.getNodeCenter(from);
                        var t_center = tools.getNodeCenter(to);
                        var sp = 0,
                            ep = 0;
                        var sp = getPointByLineOffset(line, from, linkinfo.fromDirection);
                        var ep = getPointByLineOffset(line, to, linkinfo.toDirection);
                        if (sp && ep) {
                            var info = {
                                fromNode: from,
                                targetNode: to,
                                startPoint: sp,
                                endPoint: ep,
                                fromDirection: linkinfo.fromDirection,
                                targetDirection: linkinfo.toDirection
                            }
                            var points = getNodeLinkNodPoints(info);
                            if (points && points.length > 0) {
                                line.path = points;
                                line.render();
                            }
                        }

                    }
                }
                if (node["in"] && node["in"].length > 0) {
                    for (var i = 0; i < node["in"].length; i++) {
                        var lineId = node["in"][i];
                        var line = self.getObjectById(lineId);
                        var from = self.getObjectById(line.from);
                        var to = self.getObjectById(line.to);
                        var linkinfo = line.linkInfo;
                        var sp = getPointByLineOffset(line, from, linkinfo.fromDirection);
                        var ep = getPointByLineOffset(line, to, linkinfo.toDirection);
                        if (sp && ep) {
                            var info = {
                                fromNode: from,
                                targetNode: to,
                                startPoint: sp,
                                endPoint: ep,
                                fromDirection: linkinfo.fromDirection,
                                targetDirection: linkinfo.toDirection
                            }
                            var points = getNodeLinkNodPoints(info);
                            if (points && points.length > 0) {
                                line.path = points;
                                line.render();
                            }
                        }

                    }
                }
                updateIntersection();
            },
            "objectRemove": function(evt, ui) {
                var obj = ui;
                var isUpdateIntersection = false;
                if (obj instanceof DSFA.Node) {
                    var index = self.nodes.indexOf(obj);
                    if (index >= 0) {
                        for (var i = obj["out"].length - 1; i >= 0; i--) {
                            var l = self.getObjectById(obj["out"][i]);
                            if (l) {
                                self.removeInPanel(l)
                            }
                        }
                        for (var i = obj["in"].length - 1; i >= 0; i--) {
                            var l = self.getObjectById(obj["in"][i]);
                            if (l) {
                                self.removeInPanel(l)
                            }
                            //l && l.remove();
                        }
                        self.nodes.splice(index, 1);
                    }
                } else if (obj instanceof DSFA.Line) {
                    var index = self.lines.indexOf(obj);
                    if (index >= 0) {
                        var from = self.getObjectById(obj.from);
                        var to = self.getObjectById(obj.to);
                        if (from) {
                            var f_index = from["out"].indexOf(obj.id);
                            if (f_index >= 0) {
                                from["out"].splice(f_index, 1);
                            }
                        }
                        if (to) {
                            var t_index = to["in"].indexOf(obj.id);
                            if (t_index >= 0) {
                                to["in"].splice(t_index, 1);
                            }
                        }
                        self.lines.splice(index, 1);
                    }
                    isUpdateIntersection = true;
                } else if (obj instanceof DSFA.Lane) {
                    var index = self.Lanes[obj.direction].indexOf(obj);
                    if (index >= 0) {
                        self.Lanes[obj.direction].splice(index, 1);
                    }
                    for (var i = 0; i < self.Lanes[obj.direction].length; i++) {
                        self.Lanes[obj.direction][i].index = i;
                        self.Lanes[obj.direction][i].render();
                    }
                    if (self.Lanes[LaneDirection.vertical].length <= 0) {
                        self.root.removeClass("has_v_head")
                    }
                    if (self.Lanes[LaneDirection.horizontal].length <= 0) {
                        self.root.removeClass("has_h_head")
                    }
                }
                if (objectMap[obj.id]) {
                    delete objectMap[obj.id];
                    if (isUpdateIntersection) {
                        updateIntersection();
                    }
                }
            },
            //画线
            "renderLineBefore": function(evt, ui) {},
            //编辑节点名字
            "editNodeName": function(evt, ui) {
                var textarea = $("<input type='text' class='nodenameInput'/>");
                var elements = ui.getElement();
                var nodeText = elements[1];
                if (nodeText) {
                    //nodeText.hide();
                    textarea.css("top", nodeText.css("top")).css("left", nodeText.css("left"));
                    textarea.val(nodeText.text());
                    textarea.appendTo(self.svgRoot);
                    textarea.focus();
                    textarea.select();
                    textarea.bind("blur keydown", function(evt) {
                        if (evt.type == "keydown" && evt.keyCode != "13") {
                            return;
                        }
                        if ($.trim(textarea.val()) == "") {
                            textarea.val(ui.name);
                        }
                        window.setTimeout(function() {
                            nodeText.text(textarea.val());
                            ui.name = textarea.val();
                            ui.render();
                            textarea.unbind("blur keydown");
                            textarea.remove();
                            //self.svgRoot.focus();
                            self.trigger("node.editNameAfter", ui);
                        }, 200);
                    });
                }
            },
            "editLandName": function(evt, ui) {
                var laneEl = ui.getElement()[0];
                var textEl = ui.getElement()[4];
                var d = "";
                if (ui.direction == LaneDirection.vertical) {
                    d = "bottom";
                } else {
                    d = "right";
                }
                var popover = $("<div class='popover fade " + d + " in' style='display:block'/>").appendTo(self.svgRoot);
                var arrow = $("<div class='arrow'></div>").appendTo(popover);
                var h3 = $("<h3 class='popover-title'>修改名称</h3>").appendTo(popover);
                var content = $("<div class='popover-content'></div>").appendTo(popover);
                var text = $("<input type='text' style='padding:5px'/>").val(ui.name).appendTo(content);
                text.bind("blur keydown", function(evt) {
                    if (evt.type == "keydown" && evt.keyCode != "13") {
                        return;
                    }
                    if ($.trim(text.val()) == "") {
                        text.val(ui.name);
                    }
                    window.setTimeout(function() {
                        textEl.text(text.val());
                        ui.name = text.val();
                        ui.render();
                        text.unbind("blur keydown");
                        popover.remove();
                        self.trigger("lane.editNameAfter", ui);
                    }, 200);
                });
                if (ui.direction == LaneDirection.vertical) {
                    var p_size = popover.width() / 2;
                    var l_size = ui.size / 2;
                    var left = parseFloat(laneEl.css("left")) + (l_size - p_size);
                    if (left < 0) {
                        arrow.css("margin-left", left - 11);
                        left = 1;
                    }
                    if (left + popover.width() > self.root.width()) {
                        var s = left + popover.width() - self.root.width()
                        arrow.css("margin-left", s - 11);
                        left = self.root.width() - popover.width() - 1;
                    }
                    popover.css("left", left);
                } else {
                    var p_size = popover.height() / 2;
                    var l_size = ui.size / 2;
                    var top = parseFloat(laneEl.css("top")) + (l_size - p_size);
                    if (top < 0) {
                        arrow.css("margin-top", top - 11);
                        left = 1;
                    }
                    if (top + popover.height() > self.root.height()) {
                        var s = top + popover.height() - self.root.height()
                        arrow.css("margin-top", s - 11);
                        top = self.root.height() - popover.height() - 1;
                    }
                    popover.css("top", top);
                }
                text.focus()
            }
        }

        //点击面板
        function clickPanelHander(evt) {
            if (evt.which != 1) {
                return false;
            }
            var target = $(evt.target);
            //编辑节点名字
            if (target.hasClass("nodenameInput")) {
                return;
            }
            if (target.hasClass("plus")) {
                return;
            }
            if (evt.shiftKey) {
                //如果按住shift键，则启动全局位移功能
                isGlobalPosMove = true;
                // globalPos = { x: evt.pageX, y: evt.pageY };
                globalPos = getMousePointByCanvas({ x: evt.pageX, y: evt.pageY });
                globalMoveLastMouse = { x: evt.pageX, y: evt.pageY };
                globalRect = getRect.call(self);
                $(document).bind("mousemove.globalmove", globalMove);
                $(document).one("mouseup", function() {
                    isGlobalPosMove = false;
                    globalPos = null;
                    $(document).unbind("mousemove.globalmove");
                    updateIntersection();
                    rootResize(true);
                    setNodePosition();

                });
                return false;
            }
            if (!evt.ctrlKey) {
                //点击空白处取消所有选中
                for (var i = selectedObjectList.length - 1; i >= 0; i--) {
                    selectedObjectList[i].unSelected();
                    selectedObjectList.splice(i, 1);
                }
            }
            //判断鼠标点击的元素
            if (evt.target.tagName == "svg") {
                //点击空白处取消所有选中
                for (var i = selectedObjectList.length - 1; i >= 0; i--) {
                    selectedObjectList[i].unSelected();
                    selectedObjectList.splice(i, 1);
                }
                self.trigger("panel.selected", self);
            } else if (target.hasClass("node") || target.hasClass("nodeOuter")) {
                var node = DSFA.Node.getObjectByTarget(evt.target);
                if (!node.isSelected()) {
                    self.selected(node);
                } else {
                    self.unSelected(node);
                }
                if (self.options.readOnly) {
                    return;
                }
                nodeMouseDownHandler(evt);

            } else if (evt.target.tagName == "path") {
                var segmen = DSFA.Segmen.getObjectByTarget(evt.target);
                if (segmen) {
                    var line = segmen.getLine();
                    if (line) {
                        if (!line.isSelected()) {
                            self.selected(line);
                        } else {
                            self.unSelected(line);
                        }
                        if (self.options.readOnly) {
                            return;
                        }
                        lineMouseDownHandler(evt);
                    }
                }
            }
            //泳道点击
            else if (target.hasClass("textContent") && target.closest(".lane").length > 0) {
                var laneEl = target.closest(".lane");
                var lane = DSFA.Lane.getObjectByTarget(laneEl);
                if (lane && !lane.isSelected()) {
                    self.selected(lane);
                } else {
                    self.unSelected(lane);
                }
            }
            //泳道拖动大小
            else if (target.hasClass("resizeLane")) {
                mouseDragLaneSize(evt);
            }

            evt.stopPropagation();
            //return false;
        }

        function globalMove(evt) {
            //如果按住shift键移动鼠标，则判断是否启动的全局位移
            if (evt.shiftKey && isGlobalPosMove) {
                console.log(evt)
                var localMouse = { x: evt.pageX, y: evt.pageY };
                var last_p = self.getGridPoint(globalMoveLastMouse);
                var move_p = self.getGridPoint(localMouse);
                var current_p = {
                    x: move_p.x - last_p.x,
                    y: move_p.y - last_p.y
                };
                var maxWidth = Number.MIN_VALUE,
                    maxHeight = Number.MIN_VALUE;
                if (current_p.x == 0 && current_p.y == 0) {
                    console.log("abc")
                    return false;
                }
                var x_move = false,
                    y_move = false;
                if (globalRect.x + current_p.x > 0) {
                    globalRect.x += current_p.x;
                    x_move = true;
                }
                if (globalRect.y + current_p.y >= 0) {
                    globalRect.y += current_p.y;
                    y_move = true;
                }
                for (var i = 0; i < self.nodes.length; i++) {
                    var node = self.nodes[i];
                    if (x_move) {
                        node.point.x += current_p.x;
                    }
                    if (y_move) {
                        node.point.y += current_p.y;
                    }
                    if (x_move || y_move) {
                        node.render();
                    }

                }
                for (var i = 0; i < self.lines.length; i++) {
                    var line = self.lines[i];
                    for (var n = 0; n < line.path.length; n++) {
                        if (x_move) {
                            line.path[n].x += current_p.x;
                        }
                        if (y_move) {
                            line.path[n].y += current_p.y;
                        }
                    }
                    if (x_move || y_move) {
                        line.render();
                    }
                }

                // console.log(current_p.x)
                // console.log(current_p.x)
                // self.parentElement.scrollLeft(self.parentElement.scrollLeft() + current_p.x)
                // autoScroll("line", {
                //     mouse: getMousePoint({ x: evt.pageX, y: evt.pageY }),
                // });
                globalMoveLastMouse = move_p;
                return false;
            }
        }
        //节点元素的拖动和画线
        function nodeMouseDownHandler(evt) {
            if (evt.ctrlKey) {
                return;
            }
            if (self.state == "drawLine") {
                mouseDrawLine.call(self, evt);
            } else if (!self.state) {
                mouseMoveNode.call(self, evt);
            }
        }

        //拖动线
        function lineMouseDownHandler(evt) {
            if (evt.which != 1) {
                return false;
            }
            var segmen = DSFA.Segmen.getObjectByTarget(evt.target);
            if (segmen) {
                var line = segmen.getLine();
                var isDrag = false;
                if (!line) {
                    return false;
                }
                lineDraging = true;
                currentDragLine = {
                    segmen: segmen,
                    line: line,
                    proxy: new Line_proxy(self, {
                        "stroke-dasharray": ['-']
                    }),
                    changeJoinDriection: false
                };
                var mp = getMousePointByCanvas({ x: evt.pageX, y: evt.pageY });

                if (line.getSegmenList().length == 1) {
                    if (segmen.type == _LineType.horizontal) {
                        if (Math.abs(segmen.sp.x - mp.x) <= dragSize) {
                            currentDragLine.changeJoinDriection = true;
                            currentDragLine.dragPosition = "start";
                        } else if (Math.abs(segmen.ep.x - mp.x) <= dragSize) {
                            currentDragLine.changeJoinDriection = true;
                            currentDragLine.dragPosition = "end";
                        }
                    } else {
                        if (segmen.index == 0 && Math.abs(segmen.sp.y - mp.y) <= dragSize) {
                            currentDragLine.changeJoinDriection = true;
                            currentDragLine.dragPosition = "start";
                        } else if (segmen.isLast && Math.abs(segmen.ep.y - mp.y) <= dragSize) {
                            currentDragLine.changeJoinDriection = true;
                            currentDragLine.dragPosition = "end";
                        }
                    }
                } else if (line.getSegmenList().length > 1) {
                    if (segmen.type == _LineType.horizontal) {
                        if (segmen.index == 0 && Math.abs(segmen.sp.x - mp.x) <= dragSize) {
                            currentDragLine.changeJoinDriection = true;
                            currentDragLine.dragPosition = "start";
                        } else if (segmen.isLast && Math.abs(segmen.ep.x - mp.x) < dragSize) {
                            currentDragLine.changeJoinDriection = true;
                            currentDragLine.dragPosition = "end";
                        }
                    } else {
                        if (segmen.index == 0 && Math.abs(segmen.sp.y - mp.y) <= dragSize) {
                            currentDragLine.changeJoinDriection = true;
                            currentDragLine.dragPosition = "start";
                        } else if (segmen.isLast && Math.abs(segmen.ep.y - mp.y) <= dragSize) {
                            currentDragLine.changeJoinDriection = true;
                            currentDragLine.dragPosition = "end";
                        }
                    }
                }
                $(document).bind("mousemove.dragline", function(evt) {
                    var moveMp = getMousePointByCanvas({ x: evt.pageX, y: evt.pageY });
                    //移动为超过2像素视为无效
                    if (Math.abs(moveMp.x - mp.x) < 2 && Math.abs(moveMp.y - mp.y) < 2) {
                        return false;
                    }
                    var target = evt.target;
                    var fromNode = null;
                    var toNode = null;
                    if (currentDragLine.changeJoinDriection) {
                        if (currentDragLine.dragPosition == "start") {
                            toNode = self.getObjectById(line.to);
                        } else if (currentDragLine.dragPosition == "end") {
                            fromNode = self.getObjectById(line.from);
                        }
                        if (fromNode) {
                            fromNode.showJoinPoint();
                        }
                        if (toNode) {
                            toNode.showJoinPoint();
                        }
                        if (target.tagName == "DIV") {
                            //如果接触到节点
                            var node = DSFA.Node.getObjectByTarget(evt.target);
                            if (node) {
                                if (currentDragLine.dragPosition == "start") {
                                    fromNode = node;
                                    toNode = self.getObjectById(line.to);
                                } else if (currentDragLine.dragPosition == "end") {
                                    fromNode = self.getObjectById(line.from);
                                    toNode = node;
                                }
                            }
                        } else {
                            if (currentDragLine.dragPosition == "start") {
                                toNode = self.getObjectById(line.to);
                            } else {
                                fromNode = self.getObjectById(line.from);
                            }
                        }
                        mouseDragLine(fromNode, toNode, evt);
                    } else {
                        var fromNode = self.getObjectById(line.from);
                        var toNode = self.getObjectById(line.to);
                        if (fromNode) {
                            fromNode.showJoinPoint();
                        }
                        if (toNode) {
                            toNode.showJoinPoint();
                        }
                        mouseDragLine(fromNode, toNode, evt);
                    }
                    isDrag = true;
                    autoScroll("line", {
                        data: currentDragLine,
                        mouse: { x: evt.pageX, y: evt.pageY },
                    });
                    evt.preventDefault();
                });
                $(document).one("mouseup.dragline", function(evt) {
                    try {
                        if (isDrag) {
                            var from, to, fromDirection, toDirection;
                            if (currentDragLine.changeJoinDriection) {
                                if (currentDragLine.fromNode && currentDragLine.toNode) {
                                    from = currentDragLine.fromNode ? currentDragLine.fromNode : self.getObjectById(line.from);
                                    to = currentDragLine.toNode ? currentDragLine.toNode : self.getObjectById(line.to);
                                    fromDirection = currentDragLine.fromDirection ? currentDragLine.fromDirection : line.linkInfo.fromDirection;
                                    toDirection = currentDragLine.toDirection ? currentDragLine.toDirection : line.linkInfo.toDirection;
                                    var isAlway = true;
                                    if (from == to) {
                                        if (fromDirection == toDirection) {
                                            isAlway = false;
                                        }
                                    }
                                    if (isAlway) {
                                        var path = currentDragLine.proxy.path;
                                        if (path && path.length > 0) {
                                            line.path = path;
                                            line.render();
                                        }
                                        //清理线愿连线节点
                                        if (line.id) {
                                            if (line.from) {
                                                var fn = self.getObjectById(line.from);
                                                if (fn) {
                                                    var index = fn["out"].indexOf(line.id);
                                                    if (index >= 0) {
                                                        fn["out"].splice(index, 1);
                                                    }
                                                }
                                            }
                                            if (line.to) {
                                                var tn = self.getObjectById(line.to);
                                                if (tn) {
                                                    var index = tn["in"].indexOf(line.id);
                                                    if (index >= 0) {
                                                        tn["in"].splice(index, 1);
                                                    }
                                                }
                                            }
                                        }
                                        updateLineLinkInfo(line, from, to, fromDirection, toDirection);
                                        setNodeLinkNodeInfo(from, to, line);
                                        updateIntersection();
                                    }
                                }
                            } else {
                                from = self.getObjectById(line.from);
                                to = self.getObjectById(line.to);
                                fromDirection = currentDragLine.fromDirection ? currentDragLine.fromDirection : line.linkInfo.fromDirection;
                                toDirection = currentDragLine.toDirection ? currentDragLine.toDirection : line.linkInfo.toDirection;
                                var path = currentDragLine.proxy.path;
                                if (path && path.length > 0) {
                                    line.path = path;
                                    line.render();
                                }
                                updateLineLinkInfo(line, from, to, fromDirection, toDirection);
                                setNodeLinkNodeInfo(from, to, line);
                                updateIntersection();
                            }

                        }
                    } catch (ex) {} finally {
                        isDrag = false;
                        var fromNode = self.getObjectById(line.from);
                        var toNode = self.getObjectById(line.to);
                        if (fromNode) {
                            fromNode.hideJoinPoint();
                        }
                        if (toNode) {
                            toNode.hideJoinPoint();
                        }
                        self.root.css("cursor", "default");
                        $(document).unbind("mousemove.dragline");
                        currentDragLine.proxy.remove();
                        currentDragLine = null;
                        lineDraging = false;
                        rootResize(true);
                    }
                    //return false;
                    evt.preventDefault();
                });
            }
        }

        //鼠标画线
        function mouseDrawLine(evt) {
            currentMouseDrawingLine = null;
            var target = evt.target;
            var node = DSFA.Node.getObjectByTarget(target);
            currentMouseDrawingLine = new Line_proxy(flow, {
                strokeWidth: 2,
                from: node.id
            });
            //var downMp = getMousePointByCanvas({ x: evt.pageX, y: evt.pageY });
            var startInfo = null,
                startPoint = null,
                down_direction = null,
                currentLineInfo = null;
            var _drawLineEvent = {
                "mousemove": function(evt) {
                    var mp = getMousePointByCanvas({
                        x: evt.pageX,
                        y: evt.pageY
                    });

                    var target = evt.target;
                    if (currentLineInfo) {
                        currentLineInfo.endPoint = null;
                        currentLineInfo.targetNode = null;
                        currentLineInfo.targetDirection = null;
                    }
                    if (target.tagName == "DIV") {
                        //如果接触到节点
                        var node = DSFA.Node.getObjectByTarget(evt.target);
                        if (node) {
                            var info = getDrawLineEndPointInfo(node, { x: evt.pageX, y: evt.pageY });
                            var isAlway = false;
                            if (currentLineInfo.fromNode == node) {
                                if (currentLineInfo.fromDirection != info.direction) {
                                    isAlway = true;
                                }
                            } else {
                                isAlway = true;
                            }
                            if (isAlway) {
                                currentLineInfo.endPoint = info.point;
                                currentLineInfo.targetNode = node;
                                currentLineInfo.targetDirection = info.direction;
                                var points = getNodeLinkNodPoints(currentLineInfo);
                                if (points) {
                                    currentMouseDrawingLine.path = points;
                                    currentMouseDrawingLine.render();
                                }
                            }
                        }
                    } else {
                        var points = getNodeNotLinkePoints(currentLineInfo, mp);
                        if (points) {
                            currentMouseDrawingLine.path = points;
                            currentMouseDrawingLine.render();
                        }

                    }
                    if (currentLineInfo.fromNode) {
                        currentLineInfo.fromNode.showJoinPoint();
                    }
                    if (currentLineInfo.targetNode) {
                        currentLineInfo.targetNode.showJoinPoint();
                    }
                    autoScroll("line", {
                        data: currentMouseDrawingLine,
                        mouse: { x: evt.pageX, y: evt.pageY },
                    });
                    return false;
                },
                "mouseout": function(evt) {
                    startInfo = getDrawLineStartPointInfo(node, { x: evt.pageX, y: evt.pageY });
                    startPoint = startInfo.point;
                    down_direction = startInfo.direction;
                    currentMouseDrawingLine.path.push(startPoint);
                    currentLineInfo = { "startPoint": startPoint, "fromDirection": down_direction, "fromNode": node };
                    $(document).bind("mousemove.drawline", _drawLineEvent.mousemove);
                },
                "mouseup": function(evt) {
                    $(document).unbind("mousemove.drawline");
                    $(target).unbind("mouseout.node");
                    if (!currentLineInfo) {
                        return false;
                    }
                    try {
                        var l = new DSFA.Line(self);
                        l.path = currentMouseDrawingLine.path;
                        var fn = currentLineInfo.fromNode;
                        var tn = currentLineInfo.targetNode;
                        if (fn) {
                            if (l.path.length > 1) {
                                fn.hideJoinPoint();
                            }

                        }
                        if (tn) {
                            if (l.path.length > 1) {
                                tn.hideJoinPoint();
                            }
                            updateLineLinkInfo(l, fn, tn, currentLineInfo.fromDirection, currentLineInfo.targetDirection);
                            currentMouseDrawingLine.remove();
                            self.addToPanel(l);
                            setNodeLinkNodeInfo(fn, tn, l);
                        } else {
                            currentMouseDrawingLine.remove();
                        }
                    } catch (ex) {} finally {
                        currentLineInfo = null;
                    }
                    return false;
                }
            }
            $(target).bind("mouseout.node", _drawLineEvent.mouseout);
            $(document).one("mouseup.drawline", _drawLineEvent.mouseup);
            return false;
        }
        //鼠标拖动节点
        function mouseMoveNode(evt) {
            var target = evt.target;
            var node = DSFA.Node.getObjectByTarget(target);
            if (!node || !$(target).hasClass("node")) {
                return false;
            }
            var ismousedown = true;
            var isMove = false;
            var down_point = { x: evt.pageX, y: evt.pageY };
            var offset = { x: evt.offsetX, y: evt.offsetY };
            var proxy = null;
            $(document).bind("mousemove.nodedragdrop", function(evt) {
                if (ismousedown) {
                    if (!isMove) {
                        if (Math.abs(evt.pageX - down_point.x) > 5 || Math.abs(evt.pageY - down_point.y) > 5) {
                            isMove = true;
                            return;
                        }
                    }
                    if (isMove) {
                        if (proxy == null) {
                            var nodeTarget = $(target);
                            proxy = nodeTarget.clone();
                            proxy.removeClass("node");
                            proxy.addClass("nodeproxy");
                            proxy.appendTo(self.svgRoot);
                        }
                        var mp = getMousePointByCanvas({
                            x: evt.pageX,
                            y: evt.pageY
                        });
                        var p = {
                            x: mp.x - offset.x < 0 ? 0 : mp.x - offset.x,
                            y: mp.y - offset.y < 0 ? 0 : mp.y - offset.y
                        };
                        p = self.getGridPoint(p);
                        proxy.css("top", p.y + "px").css("left", p.x + "px");
                        showSamePositionNodeBaseLine(node, { x: p.x, y: p.y });
                        autoScroll("node", {
                            data: node,
                            mouse: { x: evt.pageX, y: evt.pageY },
                            point: { x: p.x, y: p.y }
                        });
                    }
                }
            });
            $(document).one("mouseup.nodedragdrop", function(evt) {
                try {
                    if (proxy) {
                        var x = parseFloat(proxy.css("left"));
                        var y = parseFloat(proxy.css("top"));
                        node.moveTo(x, y);
                        proxy.remove();
                        proxy = null;

                    }
                    ismousedown = false;
                } catch (ex) {
                    console.error(ex);
                } finally {
                    $(document).unbind("mousemove.nodedragdrop");
                    rootResize(true);
                    hideBaseLine();
                    setNodePosition();
                }
            });
            return false;
        }
        //鼠标拖动线
        function mouseDragLine(fromNode, toNode, evt) {
            if (currentDragLine) {
                if (!currentDragLine.changeJoinDriection) {
                    var mp = getMousePointByCanvas({
                        x: evt.pageX,
                        y: evt.pageY
                    });
                    mp = self.getGridPoint(mp);
                    var segmen = currentDragLine.segmen;
                    if (segmen) {
                        var line = segmen.getLine();
                        if (segmen.type == _LineType.vertical) {
                            if (segmen.index == 0) {
                                var node = self.getObjectById(line.from);
                                if (mp.x >= node.point.x && mp.x <= node.point.x + node.width) {
                                    segmen.ep.x = mp.x;
                                    segmen.sp.x = mp.x;
                                }
                            } else if (segmen.isLast) {
                                var node = self.getObjectById(line.to);
                                if (mp.x >= node.point.x && mp.x <= node.point.x + node.width) {
                                    segmen.ep.x = mp.x;
                                    segmen.sp.x = mp.x;
                                }
                            } else {
                                segmen.ep.x = mp.x;
                                segmen.sp.x = mp.x;
                            }
                        } else {
                            if (segmen.index == 0) {
                                var node = self.getObjectById(line.from);
                                if (mp.y >= node.point.y && mp.y <= node.point.y + node.height) {
                                    var fcenter = tools.getNodeCenter(node);
                                    if (Math.abs(mp.y - fcenter.y) < centerOffset) {
                                        mp.y = fcenter.y;
                                    }
                                    segmen.ep.y = mp.y;
                                    segmen.sp.y = mp.y;
                                }
                            } else if (segmen.isLast) {
                                var node = self.getObjectById(line.to);
                                if (mp.y >= node.point.y && mp.y <= node.point.y + node.height) {
                                    var tcenter = tools.getNodeCenter(node);
                                    if (Math.abs(mp.y - tcenter.y) < centerOffset) {
                                        mp.y = tcenter.y;
                                    }
                                    segmen.ep.y = mp.y;
                                    segmen.sp.y = mp.y;
                                }
                            } else {
                                segmen.ep.y = mp.y;
                                segmen.sp.y = mp.y;
                            }
                        }
                        var el_list = line.getSegmenList();
                        var path = covertPointBySegmen(el_list);
                        currentDragLine.proxy.path = path;
                        currentDragLine.proxy.render();
                    }
                } else {
                    var segmen = currentDragLine.segmen;
                    if (segmen) {
                        var line = segmen.getLine();
                        var mp = getMousePointByCanvas({
                            x: evt.pageX,
                            y: evt.pageY
                        });
                        if (currentDragLine.dragPosition == "start") {
                            var f_node = fromNode; //self.getObjectById(line.from);
                            var t_node = toNode; // self.getObjectById(line.to);
                            var startInfo = null;
                            var startPoint = null;
                            var fromDirection = "";
                            //如果没有开始节点，创建一个虚拟的对象
                            if (f_node) {
                                startInfo = getDrawLineStartPointInfo(f_node, { x: evt.pageX, y: evt.pageY });
                                startPoint = startInfo.point;
                                fromDirection = startInfo.direction;
                            } else {
                                var f_p = self.getGridPoint(mp);
                                f_node = {
                                    "width": 0,
                                    "height": 0,
                                    "point": f_p,
                                    "abstract": true
                                };
                                startPoint = f_p;
                                var d = tools.getNodeDirection(t_node, f_p);
                                if (d == _Direction.Left) {
                                    fromDirection = _Direction.Right;
                                } else if (d == _Direction.Right) {
                                    fromDirection = _Direction.Left;
                                } else if (d == _Direction.Bottom) {
                                    fromDirection = _Direction.Top;
                                } else if (d == _Direction.Top) {
                                    fromDirection = _Direction.Bottom;
                                }
                            }
                            var ep = getPointByLineOffset(line, t_node, line.linkInfo.toDirection);
                            var info = {
                                "startPoint": startPoint,
                                "fromDirection": fromDirection,
                                "fromNode": f_node,
                                "targetNode": t_node,
                                "targetDirection": line.linkInfo.toDirection,
                                "endPoint": ep
                            };
                            var path = getNodeLinkNodPoints(info);
                            if (!f_node.abstract) {
                                currentDragLine.fromNode = f_node;
                            } else {
                                currentDragLine.fromNode = null;
                            }
                            currentDragLine.toNode = t_node;
                            currentDragLine.fromDirection = fromDirection;
                            currentDragLine.proxy.path = path;
                            currentDragLine.proxy.render();
                        } else if (currentDragLine.dragPosition == "end") {
                            var f_node = fromNode;
                            var t_node = toNode;
                            var endInfo = null;
                            var endPoint = null;
                            var toDirection = null;
                            if (t_node) {
                                endInfo = getDrawLineStartPointInfo(t_node, { x: evt.pageX, y: evt.pageY });
                                endPoint = endInfo.point;
                                toDirection = endInfo.direction;
                            } else {
                                var t_p = mp;
                                t_node = {
                                    "width": 0,
                                    "height": 0,
                                    "point": t_p,
                                    "abstract": true
                                };
                                endPoint = t_p;
                                var d = tools.getNodeDirection(f_node, t_p);
                                if (d == _Direction.Left) {
                                    toDirection = _Direction.Right;
                                } else if (d == _Direction.Right) {
                                    toDirection = _Direction.Left;
                                } else if (d == _Direction.Bottom) {
                                    toDirection = _Direction.Top;
                                } else if (d == _Direction.Top) {
                                    toDirection = _Direction.Bottom;
                                }
                            }
                            var sp = getPointByLineOffset(line, f_node, line.linkInfo.fromDirection);
                            var info = {
                                "startPoint": sp,
                                "fromDirection": line.linkInfo.fromDirection,
                                "fromNode": f_node,
                                "targetNode": t_node,
                                "targetDirection": toDirection,
                                "endPoint": endPoint
                            };
                            var path = getNodeLinkNodPoints(info);
                            currentDragLine.fromNode = f_node;
                            if (!t_node.abstract) {
                                currentDragLine.toNode = t_node;
                            } else {
                                currentDragLine.toNode = null;
                            }
                            currentDragLine.toDirection = toDirection;
                            currentDragLine.proxy.path = path;
                            currentDragLine.proxy.render();
                        }
                    }

                }
            }
        }

        //拖拽泳道尺寸
        function mouseDragLaneSize(evt) {
            var target = $(evt.target);
            var lane = DSFA.Lane.getObjectByTarget(target.closest(".lane"));
            var cursor = "default";
            var d = lane.direction;
            if (lane.direction == LaneDirection.vertical) {
                self.root.css("cursor", "ew-resize");
            } else {
                self.root.css("cursor", "ns-resize");
            }

            var point = getMousePointByRoot({
                x: evt.pageX,
                y: evt.pageY
            });
            point = self.getGridPoint(point);
            var baseLine = lane.direction == LaneDirection.vertical ? baseLine_v : baseLine_h;
            var showSize = $("<span class='resizeLaneLane-size'>").appendTo(self.root);
            $(document).bind("mousemove.resizelane", function(evt) {
                var mp = getMousePointByRoot({
                    x: evt.pageX,
                    y: evt.pageY
                });
                mp = self.getGridPoint(mp);
                var size = parseFloat(lane.size);
                if (lane.direction == LaneDirection.vertical) {
                    var offsetPoint = mp.x - point.x;
                    size = size + offsetPoint;
                }
                if (lane.direction == LaneDirection.horizontal) {
                    var offsetPoint = mp.y - point.y;
                    size = size + offsetPoint;
                }
                if (size >= 100) {
                    baseLine.show();
                    if (lane.direction == LaneDirection.vertical) {
                        baseLine.css("left", mp.x + "px");
                        showSize.text("宽度：" + size + "像素").css({ "top": 10, "left": mp.x + 20 })
                    } else {
                        baseLine.css("top", mp.y + "px");
                        showSize.text("宽度：" + size + "像素").css({ "top": mp.y + 20, "left": 10 })
                    }
                }
                autoScroll("lane", {
                    data: lane,
                    mouse: { x: evt.pageX, y: evt.pageY },
                });

                evt.preventDefault();

            });
            $(document).one("mouseup.resizelane", function(evt) {
                try {
                    var mp = getMousePointByRoot({
                        x: evt.pageX,
                        y: evt.pageY
                    });
                    mp = self.getGridPoint(mp);
                    if (lane.direction == LaneDirection.vertical) {
                        var offsetPoint = mp.x - point.x;
                        lane.size = parseFloat(lane.size) + offsetPoint;
                    }
                    if (lane.direction == LaneDirection.horizontal) {
                        var offsetPoint = mp.y - point.y;
                        lane.size = parseFloat(lane.size) + offsetPoint;
                    }
                    if (lane.size < 100) {
                        lane.size = 100;
                    }
                    for (var i = lane.index; i < self.Lanes[lane.direction].length; i++) {
                        var l = self.Lanes[lane.direction][i];
                        l.render();
                    }
                } catch (ex) {} finally {
                    self.root.css("cursor", "default");
                    $(document).unbind("mousemove.resizelane");
                    rootResize.call(self, true);
                    hideBaseLine();
                    showSize.remove();
                }
            })
        }

        //获取鼠标在画布上的位置
        function getMousePointByCanvas(mouseEvent) {
            var x = mouseEvent.x;
            var y = mouseEvent.y;
            var containerOffset = self.container.offset();
            var svgRootOffset = getSvgOffset();
            x = x - containerOffset.left - svgRootOffset.left + self.container.scrollLeft();
            y = y - containerOffset.top - svgRootOffset.top + self.container.scrollTop();
            return { x: x, y: y };
        }

        //获取鼠标在控件根元素的位置
        function getMousePointByRoot(mouseEvent) {
            var x = mouseEvent.x;
            var y = mouseEvent.y;
            var containerOffset = self.container.offset();
            x = x - containerOffset.left + self.container.scrollLeft();
            y = y - containerOffset.top + self.container.scrollTop();
            return { x: x, y: y };
        }

        //获取鼠标真实位置
        function getMousePoint(mouseEvent) {
            var x = mouseEvent.x;
            var y = mouseEvent.y;
            var containerOffset = self.container.offset();
            x = x + self.container.scrollLeft();
            y = y + self.container.scrollTop();
            return { x: x, y: y };
        }

        //创建泳道
        function createLane(options) {
            var direction = options.direction;
            if (direction == LaneDirection.vertical) {
                var lane = new DSFA.Lane(self, options);
                if (!lane.name) {
                    lane.name = "泳道" + (self.Lanes.vertical.length + 1);
                }
                if (!lane.id) {
                    lane.id = tools.uuid();
                }
                self.addToPanel(lane);
                //lane.render();
                //self.Lanes.vertical.push(lane);
            } else if (direction == LaneDirection.horizontal) {
                var lane = new DSFA.Lane(self, options);
                if (!lane.name) {
                    lane.name = "泳道" + (self.Lanes.horizontal.length + 1);
                }
                if (!lane.id) {
                    lane.id = tools.uuid();
                }
                self.addToPanel(lane);
            }

        }
        //检查并更新是否存在泳道
        function checkIsExistLane() {
            if (self.Lanes.vertical.length > 0) {
                self.root.addClass("has_v_head");
            } else {
                self.root.removeClass("has_v_head");
            }
            if (self.Lanes.horizontal.length > 0) {
                self.root.addClass("has_h_head");
            } else {
                self.root.removeClass("has_h_head");
            }
        }
        //检查并更新控件尺寸尺寸
        function rootResize(isGlobalCheck) {
            var is_v_head = self.root.hasClass("has_v_head");
            var is_h_head = self.root.hasClass("has_h_head");
            var offsetTop = parseFloat($(".h_lane").css("top"));
            var offsetLeft = parseFloat($(".v_lane").css("left"));
            var w = maxWidth;
            var h = maxHeight;
            if (isGlobalCheck) {
                w = self.parentElement.innerWidth();
                h = self.parentElement.innerHeight();
                maxWidth = w;
                maxHeight = h;
                for (var i = 0; i < self.nodes.length; i++) {
                    var node = self.nodes[i];
                    if (parseFloat(node.point.x) + parseFloat(node.width) + maxSizeOffset > w) {
                        w = parseFloat(node.point.x) + parseFloat(node.width) + maxSizeOffset;
                    }
                    if (parseFloat(node.point.y) + node.height + maxSizeOffset + 30 > h) {
                        h = parseFloat(node.point.y) + parseFloat(node.height) + maxSizeOffset + 30;
                    }
                }
                for (var i = 0; i < self.lines.length; i++) {
                    var line = self.lines[i];
                    for (var n = 0; n < line.path.length; n++) {
                        var p = line.path[n];
                        if (parseFloat(p.x) + maxSizeOffset > w) {
                            w = parseFloat(p.x) + maxSizeOffset;
                        }
                        if (parseFloat(p.y) + maxSizeOffset > h) {
                            h = parseFloat(p.y) + maxSizeOffset;
                        }
                    }
                }
                for (var k in self.Lanes) {
                    var laneSize = 0;
                    for (var i = 0; i < self.Lanes[k].length; i++) {
                        var lane = self.Lanes[k][i];
                        laneSize += parseFloat(lane.size);
                    }
                    if (k == LaneDirection.vertical && laneSize > w) {
                        w = laneSize;
                    }
                    if (k == LaneDirection.horizontal && laneSize > h) {
                        h = laneSize;
                    }
                }
                if (w > maxWidth) {
                    w = w + (is_h_head ? offsetLeft : 0);
                }
                if (h > maxHeight) {
                    h = h + (is_v_head ? offsetTop : 0);
                }
                maxWidth = w;
                maxHeight = h;
                self.root.css("width", w);
                self.container.css("width", w);
                self.root.css("height", h);
                self.container.css("height", h);
                return;
            }
            if (w > self.parentElement.innerWidth()) {
                var w2 = w + (is_h_head ? offsetLeft : 0);
                self.root.css("width", w2);
                self.container.css("width", w2);
            } else {
                self.root.css("width", w);
                self.container.css("width", w);
            }
            if (h > self.parentElement.innerHeight()) {
                var h2 = h + (is_v_head ? offsetTop : 0);
                self.root.css("height", h2);
                self.container.css("height", h2);
            } else {
                self.root.css("height", h);
                self.container.css("height", h);
            }

        }

        //自动滚动
        function autoScroll(type, arg) {
            var point = null;
            if (type == "node") {
                point = arg.point;
                if (arg.mouse.x > self.container.width() / 2) {
                    point.x = point.x + arg.data.width + maxSizeOffset;
                } else {
                    point.x = point.x;
                }
                if (arg.mouse.y > self.container.height() / 2) {
                    point.y = point.y + arg.data.height + maxSizeOffset;
                } else {
                    point.y = point.y;
                }
            } else if (type == "line") {
                point = getMousePointByCanvas({ x: arg.mouse.x, y: arg.mouse.y });
                if (arg.mouse.x > self.container.width() / 2) {
                    point.x = point.x + maxSizeOffset;
                } else {
                    point.x = point.x - maxSizeOffset;
                }
                if (arg.mouse.y > self.container.height() / 2) {
                    point.y = point.y + maxSizeOffset;
                } else {
                    point.y = point.y - maxSizeOffset;
                }
            } else if (type == "lane") {
                point = getMousePointByCanvas({ x: arg.mouse.x, y: arg.mouse.y });
                //console.log(point)
                if (arg.mouse.x > self.container.width() / 2) {
                    point.x = point.x + maxSizeOffset;
                } else {
                    point.x = point.x;
                }
                if (arg.mouse.y > self.container.height() / 2) {
                    point.y = point.y + maxSizeOffset;
                } else {
                    point.y = point.y;
                }
            }
            //console.log(point.x + "," + self.container.scrollLeft())
            //滚动条自动回滚
            //var container_p=self.container.parent();
            if (point.x < self.parentElement.scrollLeft()) {
                var size = Math.abs(self.parentElement.scrollLeft() - point.x);
                var scrollLeft = self.parentElement.scrollLeft();
                self.parentElement.scrollLeft(scrollLeft - size / 3);
            }
            if (point.y < self.parentElement.scrollTop()) {
                var size = Math.abs(self.parentElement.scrollTop() - point.y);
                var scrollTop = self.parentElement.scrollTop();
                self.parentElement.scrollTop(scrollTop - size / 3);
            }
            if (point.h < self.parentElement.scrollTop()) {
                var size = Math.abs(self.parentElement.scrollLeft() - point.x);
                var scrollLeft = self.parentElement.scrollLeft();
                self.parentElement.scrollLeft(scrollLeft - size / 3);
            }
            //滚动条自动延伸
            if (point.x > (self.parentElement.width() + self.parentElement.scrollLeft())) {
                self.root.width(point.x);
                self.container.width(point.x);
                var size = Math.abs(self.parentElement.width() + self.parentElement.scrollLeft() - point.x);
                var scrollLeft = self.parentElement.scrollLeft();
                self.parentElement.scrollLeft(scrollLeft + size / 3);
            }
            if (point.y > (self.parentElement.height() + self.parentElement.scrollTop())) {
                self.root.height(point.y);
                self.container.height(point.y)
                var size = Math.abs(self.parentElement.height() + self.parentElement.scrollTop() - point.y);
                var scrollTop = self.parentElement.scrollTop();
                self.parentElement.scrollTop(scrollTop + size / 3);
            }
        }

        //获取箭头悬空时的线路径坐标
        function getNodeNotLinkePoints(info, toPoint) {
            if (info) {
                var points = [];
                var fromDirection = info.fromDirection;
                var fromNode = info.fromNode;
                var sp = info.startPoint;
                var ep = toPoint;
                var offset = 30;
                var direction = tools.getDirection(sp, ep);
                var angle = tools.getAngle(sp, ep);
                if (fromDirection == LineDirection.Right) {
                    var p, nextP;
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    if (direction == _Direction.RightTop || direction == _Direction.RightBottom) {
                        if ((angle > 0 && angle < 45) || (angle > 315 && angle < 360)) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = sp.x + (ep.x - sp.x) / 2;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x;
                            points.push(nextP);
                        }
                    } else if (direction == _Direction.Bottom || direction == _Direction.LeftBottom || direction == _Direction.Left) {
                        if (angle < 135) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = nextP.x + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = nextP.x + offset;
                            points.push(nextP);
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };

                            if (ep.y <= fromNode.point.y + fromNode.height + offset) {
                                nextP.y = fromNode.point.y + fromNode.height + offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.x = ep.x + offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.y = ep.y;
                                points.push(nextP);
                            } else {
                                nextP.y = ep.y;
                                points.push(nextP);
                            }

                        }
                    } else if (direction == _Direction.Top || direction == _Direction.LeftTop) {
                        if (angle > 225) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = nextP.x + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = nextP.x + offset;
                            points.push(nextP);
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (ep.y >= fromNode.point.y - offset) {
                                nextP.y = fromNode.point.y - offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.x = ep.x + offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.y = ep.y;
                                points.push(nextP);
                            } else {
                                nextP.y = ep.y;
                                points.push(nextP);
                            }
                        }
                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                } else if (fromDirection == LineDirection.Bottom) {
                    // console.log(angle)
                    var p, nextP;
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    if (direction == _Direction.RightBottom || direction == _Direction.LeftBottom) {
                        if ((angle > 90 && angle < 135) || (angle < 90 && angle > 45)) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = sp.y + (ep.y - sp.y) / 2;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        }
                    } else if (direction == _Direction.Right || direction == _Direction.Top || direction == _Direction.RightTop) {
                        if (angle > 315) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = nextP.y + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = nextP.y + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (ep.x <= fromNode.point.x + fromNode.width + offset) {
                                nextP.x = fromNode.point.x + fromNode.width + offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.y = ep.y + offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.x = ep.x;
                                points.push(nextP);
                            } else {
                                nextP.x = ep.x;
                                points.push(nextP);
                            }
                        }
                    } else if (direction == _Direction.Left || direction == _Direction.LeftTop) {
                        if (angle < 225) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = nextP.y + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = nextP.y + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (ep.x >= fromNode.point.x - offset) {
                                nextP.x = fromNode.point.x - offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.y = ep.y + offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.x = ep.x;
                                points.push(nextP);
                            } else {
                                nextP.x = ep.x;
                                points.push(nextP);
                            }
                        }
                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                } else if (fromDirection == LineDirection.Left) {
                    var p, nextP;
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    if (direction == _Direction.LeftTop || direction == _Direction.LeftBottom) {
                        if ((angle > 135 && angle < 180) || (angle > 180 && angle < 225)) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = sp.x + (ep.x - sp.x) / 2;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x;
                            points.push(nextP);
                        }
                    } else if (direction == _Direction.Bottom || direction == _Direction.RightBottom || direction == _Direction.Right) {
                        if (angle > 45) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = nextP.x - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = nextP.x - offset;
                            points.push(nextP);
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };

                            if (ep.y <= fromNode.point.y + fromNode.height + offset) {
                                nextP.y = fromNode.point.y + fromNode.height + offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.x = ep.x - offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.y = ep.y;
                                points.push(nextP);
                            } else {
                                nextP.y = ep.y;
                                points.push(nextP);
                            }

                        }
                    } else if (direction == _Direction.Top || direction == _Direction.RightTop) {
                        if (angle < 315) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = nextP.x - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = nextP.x - offset;
                            points.push(nextP);
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (ep.y >= fromNode.point.y - offset) {
                                nextP.y = fromNode.point.y - offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.x = ep.x - offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.y = ep.y;
                                points.push(nextP);
                            } else {
                                nextP.y = ep.y;
                                points.push(nextP);
                            }
                        }
                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                } else if (fromDirection == LineDirection.Top) {
                    var p, nextP;
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    if (direction == _Direction.RightTop || direction == _Direction.LeftTop) {
                        if ((angle > 270 && angle < 315) || (angle < 270 && angle > 225)) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = sp.y + (ep.y - sp.y) / 2;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        }
                    } else if (direction == _Direction.Right || direction == _Direction.Bottom || direction == _Direction.RightBottom) {
                        //console.log(angle)
                        if (angle < 45) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = nextP.y - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = nextP.y - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (ep.x <= fromNode.point.x + fromNode.width + offset) {
                                nextP.x = fromNode.point.x + fromNode.width + offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.y = ep.y - offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.x = ep.x;
                                points.push(nextP);
                            } else {
                                nextP.x = ep.x;
                                points.push(nextP);
                            }
                        }

                    } else if (direction == _Direction.Left || direction == _Direction.LeftBottom) {
                        if (angle > 135) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = nextP.y - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = ep.x + offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = nextP.y - offset;
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (ep.x >= fromNode.point.x - offset) {
                                nextP.x = fromNode.point.x - offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.y = ep.y - offset;
                                points.push(nextP);

                                p = points[points.length - 1];
                                nextP = { x: p.x, y: p.y };
                                nextP.x = ep.x;
                                points.push(nextP);
                            } else {
                                nextP.x = ep.x;
                                points.push(nextP);
                            }
                        }
                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                }
                return points;
            }
        }
        //获取节点连接节点时生成线的路径坐标(画线核心函数)
        function getNodeLinkNodPoints(info) {
            var fromDirection = info.fromDirection;
            var targetDirection = info.targetDirection;
            var fromNode = info.fromNode;
            var targetNode = info.targetNode;
            var sp = info.startPoint;
            var ep = info.endPoint;
            var direction = tools.getDirection(sp, ep);
            var points = [];
            var offset = 30;
            //起始节点右侧链接结束节点左侧
            if (fromDirection == LineDirection.Right && targetDirection == LineDirection.Left) {
                if (direction == _Direction.Right) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                } else if (direction == _Direction.RightTop || direction == _Direction.RightBottom) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    points.push({
                        x: sp.x + ((ep.x - sp.x) / 2),
                        y: sp.y
                    });
                    points.push({
                        x: sp.x + ((ep.x - sp.x) / 2),
                        y: sp.y + (ep.y - sp.y)
                    });
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                } else if (direction == _Direction.Bottom || direction == _Direction.Top || direction == _Direction.Left || direction == _Direction.LeftTop || direction == _Direction.LeftBottom) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    if (fromNode.point.y > (targetNode.point.y + targetNode.height)) {
                        points.push({
                            x: sp.x + offset,
                            y: sp.y
                        });
                        var p = points[points.length - 1];
                        var d = Math.abs(fromNode.point.y - (targetNode.point.y + targetNode.height)) / 2;
                        points.push({
                            x: p.x,
                            y: fromNode.point.y - d
                        });
                        p = points[points.length - 1];
                        points.push({
                            x: ep.x - offset,
                            y: p.y
                        });
                        p = points[points.length - 1];
                        points.push({
                            x: p.x,
                            y: ep.y
                        });
                        points.push({
                            x: ep.x,
                            y: ep.y
                        });
                    } else if (targetNode.point.y > (fromNode.point.y + fromNode.height) > 0) {
                        points.push({
                            x: sp.x + offset,
                            y: sp.y
                        });
                        var p = points[points.length - 1];
                        var d = Math.abs(targetNode.point.y - (fromNode.point.y + fromNode.height)) / 2;
                        points.push({
                            x: p.x,
                            y: targetNode.point.y - d
                        });
                        p = points[points.length - 1];
                        points.push({
                            x: ep.x - offset,
                            y: p.y
                        });
                        p = points[points.length - 1];
                        points.push({
                            x: p.x,
                            y: ep.y
                        });
                        points.push({
                            x: ep.x,
                            y: ep.y
                        });
                    } else {
                        var spOffsect = offset;
                        if (targetNode.point.x + targetNode.width <= fromNode.point.x + fromNode.width) {
                            spOffsect = offset;
                        } else {
                            spOffsect = targetNode.point.x + targetNode.width + offset - sp.x;
                        }
                        points.push({
                            x: sp.x + spOffsect,
                            y: sp.y
                        });
                        var p = points[points.length - 1];
                        if (ep.y < sp.y) {
                            points.push({
                                x: p.x,
                                y: targetNode.point.y - offset
                            });
                            p = points[points.length - 1];
                            points.push({
                                x: targetNode.point.x - offset,
                                y: p.y
                            });
                            points.push({
                                x: targetNode.point.x - offset,
                                y: ep.y
                            });
                            points.push({
                                x: ep.x,
                                y: ep.y
                            });
                        } else {
                            points.push({
                                x: p.x,
                                y: targetNode.point.y + targetNode.height + offset
                            });
                            p = points[points.length - 1];
                            points.push({
                                x: targetNode.point.x - offset,
                                y: p.y
                            });
                            points.push({
                                x: targetNode.point.x - offset,
                                y: ep.y
                            });
                            points.push({
                                x: ep.x,
                                y: ep.y
                            });
                        }

                    }

                }
            }
            //起始节点右侧链接结束节点右侧
            else if (fromDirection == LineDirection.Right && targetDirection == LineDirection.Right) {
                if (direction == _Direction.Right || direction == _Direction.Bottom || direction == _Direction.Top || direction == _Direction.RightTop || direction == _Direction.RightBottom) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    var p = points[points.length - 1];
                    var nextP = { x: p.x, y: p.y };
                    if (p.y > targetNode.point.y - offset && p.y < targetNode.point.y + targetNode.height + offset) {
                        nextP.x = fromNode.point.x + fromNode.width + offset;
                        points.push(nextP);

                        var p = points[points.length - 1];
                        var nextP = { x: p.x, y: p.y };
                        //从最短距离绕开结束节点
                        if (Math.abs(p.y - targetNode.point.y) < Math.abs(p.y - (targetNode.point.y + targetNode.height))) {
                            nextP.y = (targetNode.point.y - offset);
                        } else {
                            nextP.y = (targetNode.point.y + targetNode.height + offset);
                        }
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                    }

                    if (fromNode.point.x + fromNode.width > targetNode.point.x + targetNode.width) {
                        nextP.x = fromNode.point.x + fromNode.width + offset;
                    } else {
                        nextP.x = targetNode.point.x + targetNode.width + offset;
                    }
                    points.push(nextP);

                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    nextP.y = ep.y;
                    points.push(nextP);
                    points.push(ep);
                } else if (direction == _Direction.Left || direction == _Direction.LeftTop || direction == _Direction.LeftBottom) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    points.push({
                        x: sp.x + offset,
                        y: sp.y
                    });
                    var p = points[points.length - 1];
                    var nextP = { x: p.x, y: p.y };
                    //直接连线会与开始节点冲突
                    if (ep.y > fromNode.point.y - offset && ep.y < fromNode.point.y + fromNode.height + offset) {
                        //绕开开始节点
                        if (Math.abs(ep.y - fromNode.point.y) < Math.abs(ep.y - (fromNode.point.y + fromNode.height))) {
                            nextP.y = (fromNode.point.y - offset);
                        } else {
                            nextP.y = (fromNode.point.y + fromNode.height + offset);
                        }
                    } else {
                        nextP.y = ep.y;
                    }
                    points.push(nextP);

                    p = points[points.length - 1];
                    if (p.y != ep.y) {
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                }
            }
            //起始节点右侧链接结束节点上侧
            else if (fromDirection == LineDirection.Right && targetDirection == LineDirection.Top) {
                if (direction == _Direction.Right || direction == _Direction.Top || direction == _Direction.RightBottom || direction == _Direction.RightTop) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    var p, nextP;
                    if (targetNode.point.y > sp.y) {
                        points.push({
                            x: ep.x,
                            y: sp.y
                        });
                    } else {
                        //判断起始节点右侧和结束节点左侧是否有间隙
                        if (targetNode.point.x <= fromNode.point.x + fromNode.width && targetNode.point.x + targetNode.width >= fromNode.point.x) {
                            //无间隙
                            var offset_new = offset;
                            if (targetNode.point.x + targetNode.width > fromNode.point.x + fromNode.width) {
                                offset_new = targetNode.point.x + targetNode.width + offset;
                            } else {
                                offset_new = fromNode.point.x + fromNode.width + offset;
                            }
                            points.push({
                                x: offset_new,
                                y: sp.y
                            });
                        } else {
                            //有间隙
                            var distance = Math.abs(targetNode.point.x - (fromNode.point.x + fromNode.width));
                            var offset_new = offset;
                            if (distance <= offset) {
                                offset_new = distance / 2;
                            }
                            points.push({
                                x: sp.x + offset_new,
                                y: sp.y
                            });
                        }
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = targetNode.point.y - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        points.push({
                            x: ep.x,
                            y: p.y
                        });
                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                } else if (direction == _Direction.Left || direction == _Direction.Bottom || direction == _Direction.LeftTop || direction == _Direction.LeftBottom) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    if ((direction != _Direction.LeftBottom && direction != _Direction.Bottom) && targetNode.point.x + targetNode.width > fromNode.point.x + fromNode.width) {
                        points.push({
                            x: targetNode.point.x + targetNode.width + offset,
                            y: sp.y
                        });
                    } else {
                        points.push({
                            x: sp.x + offset,
                            y: sp.y
                        });
                    }
                    var p, nextP;
                    if (targetNode.point.y - (fromNode.point.y + fromNode.height) > 0) {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        var offset_new = offset;
                        if (targetNode.point.y - (fromNode.point.y + fromNode.height) <= offset) {
                            offset_new = (targetNode.point.y - (fromNode.point.y + fromNode.height)) / 2;
                        }
                        nextP.y = targetNode.point.y - offset_new;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: ep.x, y: p.y };
                        points.push(nextP);
                    } else {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (fromNode.point.y < targetNode.point.y) {
                            nextP.y = fromNode.point.y - offset;
                        } else {
                            nextP.y = targetNode.point.y - offset;
                        }
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);

                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                }
            }
            //起始节点右侧链接结束节点下侧
            else if (fromDirection == LineDirection.Right && targetDirection == LineDirection.Bottom) {
                if (direction == _Direction.Right || direction == _Direction.Bottom || direction == _Direction.RightBottom || direction == _Direction.RightTop) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    var p, nextP;
                    if (targetNode.point.y + targetNode.height < sp.y) {
                        points.push({
                            x: ep.x,
                            y: sp.y
                        });
                    } else {
                        //判断起始节点右侧和结束节点左侧是否有间隙
                        if (targetNode.point.x <= fromNode.point.x + fromNode.width && targetNode.point.x + targetNode.width >= fromNode.point.x) {
                            //无间隙
                            var offset_new = offset;
                            if (targetNode.point.x + targetNode.width > fromNode.point.x + fromNode.width) {
                                offset_new = targetNode.point.x + targetNode.width + offset;
                            } else {
                                offset_new = fromNode.point.x + fromNode.width + offset;
                            }
                            points.push({
                                x: offset_new,
                                y: sp.y
                            });
                        } else {
                            //有间隙
                            var distance = Math.abs(targetNode.point.x - (fromNode.point.x + fromNode.width));
                            var offset_new = offset;
                            if (distance <= offset) {
                                offset_new = distance / 2;
                            }
                            points.push({
                                x: sp.x + offset_new,
                                y: sp.y
                            });
                        }
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = targetNode.point.y + targetNode.height + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        points.push({
                            x: ep.x,
                            y: p.y
                        });
                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                } else if (direction == _Direction.Left || direction == _Direction.Top || direction == _Direction.LeftTop || direction == _Direction.LeftBottom) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    if ((direction != _Direction.LeftTop && direction != _Direction.Top) && targetNode.point.x + targetNode.width > fromNode.point.x + fromNode.width) {
                        points.push({
                            x: targetNode.point.x + targetNode.width + offset,
                            y: sp.y
                        });
                    } else {
                        points.push({
                            x: sp.x + offset,
                            y: sp.y
                        });
                    }
                    var p, nextP;
                    if (fromNode.point.y - (targetNode.point.y + targetNode.height) > 0) {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        var offset_new = offset;
                        if (targetNode.point.y - (fromNode.point.y + fromNode.height) <= offset) {
                            offset_new = (targetNode.point.y - (fromNode.point.y + fromNode.height)) / 2;
                        }
                        nextP.y = targetNode.point.y - offset_new;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: ep.x, y: p.y };
                        points.push(nextP);
                    } else {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.y + targetNode.height > fromNode.point.y + fromNode.height) {
                            nextP.y = targetNode.point.y + targetNode.height + offset;
                        } else {
                            nextP.y = fromNode.point.y + fromNode.height + offset;
                        }
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);

                    }
                    points.push({
                        x: ep.x,
                        y: ep.y
                    });
                }
            }
            //起始节点下侧链接结束节点左侧
            else if (fromDirection == LineDirection.Bottom && targetDirection == LineDirection.Left) {
                var p, nextP, offset_new = offset;
                if (direction == _Direction.RightBottom || direction == _Direction.RightTop || direction == _Direction.Right) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    //直接画一个直角链接
                    if (ep.y > fromNode.point.y + fromNode.height) {
                        points.push({
                            x: sp.x,
                            y: ep.y
                        });
                    } else {
                        //如果结束节点的水平位置与开始节点有重合
                        if (targetNode.point.x <= fromNode.point.x + fromNode.width) {
                            //绕开开始节点
                            if (targetNode.point.y + targetNode.height > fromNode.point.y + fromNode.height) {
                                offset_new = (targetNode.point.y + targetNode.height) - (fromNode.point.y + fromNode.height) + offset;
                            }
                            points.push({
                                x: sp.x,
                                y: sp.y + offset_new
                            });
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (targetNode.point.x > fromNode.point.x) {
                                nextP.x = fromNode.point.x - offset;
                            } else {
                                nextP.x = targetNode.point.x - offset;
                            }
                            points.push(nextP);

                            p = points[points.length - 1];
                            points.push({
                                x: p.x,
                                y: ep.y
                            });
                        } else {
                            points.push({
                                x: sp.x,
                                y: sp.y + offset
                            });
                            if (targetNode.point.x - (fromNode.point.x + fromNode.width) <= offset * 2) {
                                offset_new = (targetNode.point.x - (fromNode.point.x + fromNode.width)) / 2;
                            }
                            p = points[points.length - 1];
                            points.push({
                                x: ep.x - offset_new,
                                y: p.y
                            });

                            p = points[points.length - 1];
                            points.push({
                                x: p.x,
                                y: ep.y
                            });
                        }
                    }

                } else if (direction == _Direction.Top || direction == _Direction.LeftTop) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    if (targetNode.point.y + targetNode.height > fromNode.point.y + fromNode.height) {
                        offset_new = (targetNode.point.y + targetNode.height) - (fromNode.point.y + fromNode.height) + offset;
                    }
                    points.push({
                        x: sp.x,
                        y: sp.y + offset_new
                    });
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (targetNode.point.x > fromNode.point.x) {
                        nextP.x = fromNode.point.x - offset;
                    } else {
                        nextP.x = targetNode.point.x - offset;
                    }
                    points.push(nextP);
                    p = points[points.length - 1];
                    points.push({
                        x: p.x,
                        y: ep.y
                    });
                } else if (direction == _Direction.Bottom || direction == _Direction.LeftBottom || direction == _Direction.Left) {
                    points.push({
                        x: sp.x,
                        y: sp.y
                    });
                    //目标节点上方和开始节点下方有没有间隙
                    if (targetNode.point.y - (fromNode.point.y + fromNode.height) > 0) {
                        var split = targetNode.point.y - (fromNode.point.y + fromNode.height);
                        if (split > offset * 2) {
                            points.push({
                                x: sp.x,
                                y: sp.y + offset
                            });
                        } else {
                            points.push({
                                x: sp.x,
                                y: sp.y + split / 2
                            });
                        }
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x - 30;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: ep.y };
                        points.push(nextP);
                    } else {
                        if (targetNode.point.y + targetNode.height > fromNode.point.y + fromNode.height) {
                            offset_new = (targetNode.point.y + targetNode.height) - (fromNode.point.y + fromNode.height) + offset;
                        }
                        points.push({
                            x: sp.x,
                            y: sp.y + offset_new
                        });
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x > fromNode.point.x) {
                            nextP.x = fromNode.point.x - offset;
                        } else {
                            nextP.x = targetNode.point.x - offset;
                        }
                        points.push(nextP);
                        p = points[points.length - 1];
                        points.push({
                            x: p.x,
                            y: ep.y
                        });
                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点下侧链接结束节点下侧
            else if (fromDirection == LineDirection.Bottom && targetDirection == LineDirection.Bottom) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Right || direction == _Direction.RightTop || direction == _Direction.Top || direction == _Direction.LeftTop) {
                    if (targetNode.point.y + targetNode.height > fromNode.point.y + fromNode.height) {
                        offset_new = (targetNode.point.y + targetNode.height) - (fromNode.point.y + fromNode.height) + offset;
                    }
                    points.push({
                        x: sp.x,
                        y: sp.y + offset_new
                    });

                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (ep.x < fromNode.point.x + fromNode.width + offset && ep.x > fromNode.point.x - offset) {
                        //绕开开始节点
                        tcenter = tools.getNodeCenter(targetNode);
                        if (tcenter.x > sp.x) {
                            nextP.x = fromNode.point.x + fromNode.width + offset;
                            points.push(nextP);
                        } else {
                            nextP.x = fromNode.point.x - offset;
                            points.push(nextP);
                        }
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        //有间距
                        if (fromNode.point.y - (targetNode.point.y + targetNode.height) > offset * 2) {
                            nextP.y = targetNode.point.y + targetNode.height + offset;
                        } else if (fromNode.point.y - (targetNode.point.y + targetNode.height) <= 0) {
                            nextP.y = targetNode.point.y + targetNode.height + offset;
                        } else {
                            var split = fromNode.point.y - (targetNode.point.y + targetNode.height);
                            nextP.y = targetNode.point.y + targetNode.height + split / 2;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    } else {
                        nextP.x = ep.x;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.Left || direction == _Direction.RightBottom || direction == _Direction.LeftBottom || direction == _Direction.Bottom) {
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (targetNode.point.x - offset <= sp.x && targetNode.point.x + targetNode.width + offset > sp.x) {
                        if (targetNode.point.y - (fromNode.point.y + fromNode.height) > offset || targetNode.point.y - (fromNode.point.y + fromNode.height) <= 0) {
                            nextP.y = sp.y + offset;
                            points.push(nextP);
                        } else {
                            var split = (targetNode.point.y - (fromNode.point.y + fromNode.height)) / 2;
                            nextP.y = sp.y + split;
                            points.push(nextP);
                        }
                        //绕过结束节点
                        var tcenter = tools.getNodeCenter(targetNode);
                        if (tcenter.x > sp.x) {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = targetNode.point.x - offset;
                            points.push(nextP);
                        } else {
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.x = targetNode.point.x + targetNode.width + offset;
                            points.push(nextP);
                        }
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = targetNode.point.y + targetNode.height + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    } else {
                        if (fromNode.point.y + fromNode.height > targetNode.point.y + targetNode.height) {
                            nextP.y = fromNode.point.y + fromNode.height + offset;
                        } else {
                            nextP.y = targetNode.point.y + targetNode.height + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点下侧链接结束节点右侧
            else if (fromDirection == LineDirection.Bottom && targetDirection == LineDirection.Right) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Top || direction == _Direction.Bottom || direction == _Direction.Right || direction == _Direction.RightBottom || direction == _Direction.RightTop) {
                    if (targetNode.point.y - (fromNode.point.y + fromNode.height) > 0) {
                        //有间隙
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.y - (fromNode.point.y + fromNode.height) > offset * 2) {
                            offset_new = offset;
                        } else {
                            offset_new = (targetNode.point.y - (fromNode.point.y + fromNode.height)) / 2;
                        }
                        nextP.y = nextP.y + offset_new;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    } else {
                        //无间隙
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (fromNode.point.y + fromNode.height > targetNode.point.y + targetNode.height) {
                            nextP.y = fromNode.point.y + fromNode.height + offset;
                        } else {
                            nextP.y = targetNode.point.y + targetNode.height + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (fromNode.point.x + fromNode.width > targetNode.point.x + targetNode.width) {
                            nextP.x = fromNode.point.x + fromNode.width + offset;
                        } else {
                            nextP.x = targetNode.point.x + targetNode.width + offset;
                        }


                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.LeftTop || direction == _Direction.Left || direction == _Direction.LeftBottom) {
                    if (ep.y <= sp.y) {
                        if (targetNode.point.x + targetNode.width < fromNode.point.x) {
                            //有间隙
                            points.push({
                                x: sp.x,
                                y: fromNode.point.y + fromNode.height + offset
                            });
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (fromNode.point.x - (targetNode.point.x + targetNode.width) <= offset) {
                                var split = Math.abs(targetNode.point.x + targetNode.width - fromNode.point.x) / 2;
                                nextP.x = targetNode.point.x + targetNode.width + split;
                            } else {
                                nextP.x = targetNode.point.x + targetNode.width + offset;
                            }
                            points.push(nextP);

                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        } else {
                            //无间隙
                            if (fromNode.point.y + fromNode.height > targetNode.point.y + targetNode.height) {
                                points.push({
                                    x: sp.x,
                                    y: fromNode.point.y + fromNode.height + offset
                                });
                            } else {
                                points.push({
                                    x: sp.x,
                                    y: targetNode.point.y + targetNode.height + offset
                                });
                            }
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            if (targetNode.point.x + targetNode.width > fromNode.point.x + fromNode.width) {
                                nextP.x = targetNode.point.x + targetNode.width + offset;
                            } else {
                                nextP.x = fromNode.point.x + fromNode.width + offset;
                            }
                            points.push(nextP);
                            p = points[points.length - 1];
                            nextP = { x: p.x, y: p.y };
                            nextP.y = ep.y;
                            points.push(nextP);
                        }
                    } else {
                        points.push({
                            x: sp.x,
                            y: ep.y
                        });
                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点下侧链接结束节点上侧
            else if (fromDirection == LineDirection.Bottom && targetDirection == LineDirection.Top) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Top || direction == _Direction.Right || direction == _Direction.Left || direction == _Direction.RightTop || direction == _Direction.LeftTop) {
                    //判断结束节点是否在开始节点左右两侧并且留无间隙
                    if (targetNode.point.x <= (fromNode.point.x + fromNode.width) && (targetNode.point.x + targetNode.width) >= fromNode.point.x) {
                        points.push({
                            x: sp.x,
                            y: sp.y + offset
                        });
                        tcenter = tools.getNodeCenter(targetNode);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (tcenter.x > sp.x) {
                            nextP.x = (fromNode.point.x < targetNode.point.x) ? fromNode.point.x : targetNode.point.x;
                            nextP.x -= offset;
                        } else {
                            nextP.x = (fromNode.point.x + fromNode.width < targetNode.point.x + targetNode.width) ? targetNode.point.x + targetNode.width : fromNode.point.x + fromNode.width;
                            nextP.x += offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = (fromNode.point.y < targetNode.point.y) ? fromNode.point.y : targetNode.point.y;
                        nextP.y -= offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    } else {
                        points.push({
                            x: sp.x,
                            y: sp.y + offset
                        });

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x > (fromNode.point.x + fromNode.width)) {
                            nextP.x = (fromNode.point.x + fromNode.width) + (targetNode.point.x - (fromNode.point.x + fromNode.width)) / 2;
                        } else if (fromNode.point.x > targetNode.point.x + targetNode.width) {
                            nextP.x = fromNode.point.x - (fromNode.point.x - (targetNode.point.x + targetNode.width)) / 2;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    }

                } else if (direction == _Direction.Bottom || direction == _Direction.LeftBottom || direction == _Direction.RightBottom) {
                    if (ep.x != sp.x) {
                        var split = targetNode.point.y - (fromNode.point.y + fromNode.height);
                        points.push({
                            x: sp.x,
                            y: sp.y + split / 2
                        });
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点左侧对结束节点左侧
            else if (fromDirection == LineDirection.Left && targetDirection == LineDirection.Left) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Top || direction == _Direction.Bottom || direction == _Direction.Right || direction == _Direction.RightTop || direction == _Direction.RightBottom) {
                    points.push({
                        x: sp.x - offset,
                        y: sp.y
                    });
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (ep.y > fromNode.point.y - offset && ep.y < fromNode.point.y + fromNode.height + offset) {
                        //绕开开始节点
                        if (ep.y < sp.y) {
                            nextP.y = fromNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y + fromNode.height + offset;
                        }
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    } else {
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.Left || direction == _Direction.LeftBottom || direction == _Direction.LeftTop) {
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (sp.y > targetNode.point.y - offset && sp.y < targetNode.point.y + targetNode.height + offset) {
                        //绕开结束节点
                        points.push({
                            x: sp.x - offset,
                            y: sp.y
                        });
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        //从最短距离绕开结束节点
                        if (Math.abs(p.y - targetNode.point.y) < Math.abs(p.y - (targetNode.point.y + targetNode.height))) {
                            nextP.y = (targetNode.point.y - offset);
                        } else {
                            nextP.y = (targetNode.point.y + targetNode.height + offset);
                        }
                        points.push(nextP);


                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = targetNode.point.x - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);

                    } else {
                        nextP.x = targetNode.point.x - offset;
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点左侧对结束节点上侧
            else if (fromDirection == LineDirection.Left && targetDirection == LineDirection.Top) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Right || direction == _Direction.RightTop || direction == _Direction.RightBottom || direction == _Direction.Bottom) {
                    //结束节点位置在开始节点左下方且与开始节点有一定的间隙
                    if (targetNode.point.y - (fromNode.point.y + fromNode.height) > 0) {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = fromNode.point.x - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };

                        var split = (targetNode.point.y - (fromNode.point.y + fromNode.height));
                        if (split > offset * 2) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = (fromNode.point.y + fromNode.height) + split / 2;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);


                    } else {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x < fromNode.point.x) {
                            nextP.x = targetNode.point.x - offset;
                        } else {
                            nextP.x = fromNode.point.x - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.y < fromNode.point.y) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.Top || direction == _Direction.LeftTop || direction == _Direction.Left) {
                    //结束节点在开始节点左侧且有间隙
                    if (targetNode.point.x + targetNode.width < fromNode.point.x) {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        var split = Math.abs(targetNode.point.x + targetNode.width - fromNode.point.x);
                        if (split > offset * 2) {
                            nextP.x = fromNode.point.x - offset;
                        } else {
                            nextP.x = fromNode.point.x - split / 2;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = targetNode.point.y - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    } else {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x < fromNode.point.x) {
                            nextP.x = targetNode.point.x - offset;
                        } else {
                            nextP.x = fromNode.point.x - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.y < fromNode.point.y) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.LeftBottom) {
                    points.push({
                        x: ep.x,
                        y: sp.y
                    });
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });

            }
            //起始节点左侧对结束节点右侧
            else if (fromDirection == LineDirection.Left && targetDirection == LineDirection.Right) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Right || direction == _Direction.RightTop || direction == _Direction.RightBottom || direction == _Direction.Top || direction == _Direction.Bottom) {
                    points.push({
                        x: sp.x - offset,
                        y: sp.y
                    });
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (targetNode.point.y <= fromNode.point.y + fromNode.height && targetNode.point.y + targetNode.height >= fromNode.point.y) {
                        var tcenter = tools.getNodeCenter(targetNode)
                        if (tcenter.y > sp.y) {
                            nextP.y = fromNode.point.y < targetNode.point.y ? fromNode.point.y - offset : targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y + fromNode.height < targetNode.point.y + targetNode.height ? targetNode.point.y + targetNode.height + offset : fromNode.point.y + fromNode.height + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x + targetNode.width > fromNode.point.x + fromNode.width) {
                            nextP.x = targetNode.point.x + targetNode.width + offset;
                        } else {
                            nextP.x = fromNode.point.x + fromNode.width + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    } else {
                        if (targetNode.point.y > fromNode.point.y + fromNode.height) {
                            var split = Math.abs(targetNode.point.y - (fromNode.point.y + fromNode.height));
                            nextP.y = (fromNode.point.y + fromNode.height) + split / 2;
                        } else if (targetNode.point.y + targetNode.height < fromNode.point.y) {
                            var split = Math.abs(targetNode.point.y + targetNode.height - fromNode.point.y);
                            nextP.y = (targetNode.point.y + targetNode.height) + split / 2;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = targetNode.point.x + targetNode.width + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }

                } else if (direction == _Direction.Left || direction == _Direction.LeftTop || direction == _Direction.LeftBottom) {
                    if (sp.y != ep.y) {
                        var split = fromNode.point.x - (targetNode.point.x + targetNode.width);
                        points.push({
                            x: fromNode.point.x - split / 2,
                            y: sp.y
                        });
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点左侧对结束节点下侧
            else if (fromDirection == LineDirection.Left && targetDirection == LineDirection.Bottom) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Top || direction == _Direction.Bottom || direction == _Direction.Right || direction == _Direction.RightTop || direction == _Direction.RightBottom) {
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (targetNode.point.y + targetNode.height < fromNode.point.y) {
                        nextP.x = fromNode.point.x - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        var split = Math.abs(targetNode.point.y + targetNode.height - fromNode.point.y);
                        //console.log(split)
                        if (split <= offset * 2) {
                            nextP.y = (targetNode.point.y + targetNode.height) + split / 2;

                        } else {
                            nextP.y = (targetNode.point.y + targetNode.height) + offset;
                        }
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    } else {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x < fromNode.point.x) {
                            nextP.x = targetNode.point.x - offset;
                        } else {
                            nextP.x = fromNode.point.x - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.y + targetNode.height < fromNode.point.y + fromNode.height) {
                            nextP.y = fromNode.point.y + fromNode.height + offset;
                        } else {
                            nextP.y = targetNode.point.y + targetNode.height + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.LeftTop) {
                    points.push({
                        x: ep.x,
                        y: sp.y
                    });
                } else if (direction == _Direction.Left || direction == _Direction.LeftBottom) {
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    //有间隙
                    if (targetNode.point.x + targetNode.width < fromNode.point.x) {
                        var split = Math.abs(targetNode.point.x + targetNode.width - fromNode.point.x);
                        if (split < offset * 2) {
                            nextP.x = fromNode.point.x - split / 2;
                        } else {
                            nextP.x = fromNode.point.x - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = targetNode.point.y + targetNode.height + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    } else {
                        nextP.x = targetNode.point.x - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = (targetNode.point.y + targetNode.height) > (fromNode.point.y + fromNode.height) ? (targetNode.point.y + targetNode.height) + offset : (fromNode.point.y + fromNode.height) + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);

                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点上侧对结束节点左侧
            else if (fromDirection == LineDirection.Top && targetDirection == LineDirection.Left) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.RightTop) {
                    points.push({
                        x: sp.x,
                        y: ep.y
                    });
                } else if (direction == _Direction.Right || direction == _Direction.RightBottom || direction == _Direction.Bottom || direction == _Direction.LeftBottom) {
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    //有间隙
                    if (targetNode.point.x > (fromNode.point.x + fromNode.width)) {
                        nextP.y = fromNode.point.y - offset;
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        var split = targetNode.point.x - (fromNode.point.x + fromNode.width);
                        if (split > offset * 2) {
                            nextP.x = targetNode.point.x - offset;
                        } else {
                            nextP.x = targetNode.point.x - split / 2;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    } else {
                        if (targetNode.point.y < fromNode.point.y) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x < fromNode.point.x) {
                            nextP.x = targetNode.point.x - offset;
                        } else {
                            nextP.x = fromNode.point.x - offset;
                        }

                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.Left || direction == _Direction.LeftTop || direction == _Direction.Top) {
                    //有间隙
                    if (targetNode.point.y + targetNode.height < fromNode.point.y) {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };

                        var split = Math.abs((targetNode.point.y + targetNode.height) - fromNode.point.y);
                        if (split > offset * 2) {
                            nextP.y = fromNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - split / 2;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = targetNode.point.x - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);

                    } else {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.y < fromNode.point.y) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x < fromNode.point.x) {
                            nextP.x = targetNode.point.x - offset;
                        } else {
                            nextP.x = fromNode.point.x - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点上侧对结束节点右侧
            else if (fromDirection == LineDirection.Top && targetDirection == LineDirection.Right) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Top || direction == _Direction.Right || direction == _Direction.Bottom || direction == _Direction.RightTop || direction == _Direction.RightBottom) {
                    //有间隙
                    if (targetNode.point.y + targetNode.height < fromNode.point.y) {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        var split = Math.abs((targetNode.point.y + targetNode.height) - fromNode.point.y);
                        if (split < offset * 2) {
                            nextP.y = fromNode.point.y - split / 2;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = targetNode.point.x + targetNode.width + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    } else {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.y < fromNode.point.y) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x + targetNode.width > fromNode.point.x + fromNode.width) {
                            nextP.x = targetNode.point.x + targetNode.width + offset;
                        } else {
                            nextP.x = fromNode.point.x + fromNode.width + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.LeftTop) {
                    points.push({
                        x: sp.x,
                        y: ep.y
                    });
                } else if (direction == _Direction.Left || direction == _Direction.LeftBottom) {
                    //有间隙
                    if (targetNode.point.x + targetNode.width < fromNode.point.x) {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = fromNode.point.y - offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        var split = Math.abs((targetNode.point.x + targetNode.width) - fromNode.point.x);
                        if (split < offset * 2) {
                            nextP.x = targetNode.point.x + targetNode.width + split / 2;
                        } else {
                            nextP.x = targetNode.point.x + targetNode.width + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    } else {
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.y < fromNode.point.y) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        if (targetNode.point.x + targetNode.width < fromNode.point.x + fromNode.width) {
                            nextP.x = fromNode.point.x + fromNode.width + offset;
                        } else {
                            nextP.x = targetNode.point.x + targetNode.width + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = ep.y;
                        points.push(nextP);
                    }
                }

                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点上侧对结束节点上侧
            else if (fromDirection == LineDirection.Top && targetDirection == LineDirection.Top) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Right || direction == _Direction.Left || direction == _Direction.RightBottom || direction == _Direction.Bottom || direction == _Direction.LeftBottom) {
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (targetNode.point.y < fromNode.point.y) {
                        nextP.y = targetNode.point.y - offset;
                    } else {
                        nextP.y = fromNode.point.y - offset;
                    }
                    points.push(nextP);

                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (ep.x < fromNode.point.x + fromNode.width + offset && ep.x > fromNode.point.x - offset) {
                        var tcenter = tools.getNodeCenter(targetNode);
                        if (tcenter.x < sp.x) {
                            nextP.x = fromNode.point.x - offset;
                        } else {
                            nextP.x = fromNode.point.x + fromNode.width + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };

                        var split = targetNode.point.y - (fromNode.point.y + fromNode.height);
                        if (split < offset * 2) {
                            nextP.y = targetNode.point.y - split / 2;
                        } else {
                            nextP.y = targetNode.point.y - offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    } else {
                        nextP.x = ep.x;
                        points.push(nextP);
                    }

                } else if (direction == _Direction.LeftTop || direction == _Direction.Top || direction == _Direction.RightTop) {
                    var p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (sp.x < targetNode.point.x + targetNode.width + offset && sp.x > targetNode.point.x - offset) {
                        var split = Math.abs((targetNode.point.y + targetNode.height) - fromNode.point.y);
                        if (split < offset * 2 && split != 0) {
                            nextP.y = fromNode.point.y - split / 2;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);
                        var p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        var tcenter = tools.getNodeCenter(targetNode);
                        if (tcenter.x < sp.x) {
                            nextP.x = targetNode.point.x + targetNode.width + offset;
                        } else {
                            nextP.x = targetNode.point.x - offset;
                        }
                        points.push(nextP);

                        var p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = targetNode.point.y - offset;
                        points.push(nextP);
                        var p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);

                    } else {
                        if (targetNode.point.y < fromNode.point.y) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);
                        var p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            //起始节点上侧对结束节点下`侧
            else if (fromDirection == LineDirection.Top && targetDirection == LineDirection.Bottom) {
                var p, nextP, offset_new = offset;
                points.push({
                    x: sp.x,
                    y: sp.y
                });
                if (direction == _Direction.Top || direction == _Direction.LeftTop || direction == _Direction.RightTop) {
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };
                    if (ep.x != sp.x) {
                        var split = Math.abs((targetNode.point.y + targetNode.height) - fromNode.point.y);
                        nextP.y = fromNode.point.y - split / 2;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    }
                } else if (direction == _Direction.Left || direction == _Direction.Right || direction == _Direction.LeftBottom || direction == _Direction.RightBottom || direction == _Direction.Bottom) {
                    p = points[points.length - 1];
                    nextP = { x: p.x, y: p.y };

                    //无间隙
                    if (targetNode.point.x <= fromNode.point.x + fromNode.width && targetNode.point.x + targetNode.width >= fromNode.point.x) {
                        if (targetNode.point.y < fromNode.point.y) {
                            nextP.y = targetNode.point.y - offset;
                        } else {
                            nextP.y = fromNode.point.y - offset;
                        }
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };

                        var tcenter = tools.getNodeCenter(targetNode);
                        if (tcenter.x < sp.x) {
                            nextP.x = targetNode.point.x < fromNode.point.x ? targetNode.point.x - offset : fromNode.point.x - offset;
                        } else {
                            nextP.x = targetNode.point.x + targetNode.width < fromNode.point.x + fromNode.width ? fromNode.point.x + fromNode.width + offset : targetNode.point.x + targetNode.width + offset;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = targetNode.point.y + targetNode.height + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);
                    } else {
                        nextP.y = fromNode.point.y - offset;
                        points.push(nextP);
                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };

                        if (targetNode.point.x + targetNode.width < fromNode.point.x) {
                            var split = Math.abs((targetNode.point.x + targetNode.width) - fromNode.point.x);
                            nextP.x = fromNode.point.x - split / 2;
                        } else if (fromNode.point.x + fromNode.width < targetNode.point.x) {
                            var split = Math.abs((fromNode.point.x + fromNode.width) - targetNode.point.x);
                            nextP.x = targetNode.point.x - split / 2;
                        }
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.y = targetNode.point.y + targetNode.height + offset;
                        points.push(nextP);

                        p = points[points.length - 1];
                        nextP = { x: p.x, y: p.y };
                        nextP.x = ep.x;
                        points.push(nextP);

                    }
                }
                points.push({
                    x: ep.x,
                    y: ep.y
                });
            }
            return points;
        }

        function getLineType(segmen) {
            //水平线
            if (segmen.sp.y == segmen.ep.y) {
                return _LineType.horizontal;
            }
            if (segmen.sp.x == segmen.ep.x) {
                return _LineType.vertical;
            }
        }


        //将线段的点转换成线段数组
        // function convertSegmentByPoint(points) {
        //     var segmentList = [];
        //     for (var i = 0; i < points.length; i++) {
        //         var point1 = points[i];
        //         var point2 = points[i + 1];
        //         if (point1 && point2) {
        //             segmentList.push({
        //                 sp: point1,
        //                 ep: point2
        //             });
        //         }
        //     }
        //     return segmentList;
        // }

        //将线段数组转换成线段坐标
        function covertPointBySegmen(segmenList) {
            var points = [];
            for (var i = 0; i < segmenList.length; i++) {
                var s = segmenList[i];
                points.push(s.sp);
                if (i == segmenList.length - 1) {
                    points.push(s.ep);
                }
            }
            return points;
        }

        //设置连线后属性
        function setNodeLinkNodeInfo(fromNode, targetNode, line) {
            if (fromNode["out"].indexOf(line.id) < 0) {
                fromNode["out"].push(line.id);
            }
            if (targetNode["in"].indexOf(line.id) < 0) {
                targetNode["in"].push(line.id);
            }
            line.from = fromNode.id;
            line.to = targetNode.id;
            objectMap[fromNode.id] = fromNode;
            objectMap[targetNode.id] = targetNode;
            objectMap[line.id] = line;
            self.trigger("line.joined", line);
        }

        //更新连线的连接属性
        function updateLineLinkInfo(line, fromNode, toNode, fromDirection, toDirection) {
            // var fromNode = self.getObjectById(line.from);
            // var toNode = self.getObjectById(line.to);
            if (typeof(fromNode) == "string") {
                fromNode = self.getObjectById(fromNode);
            }
            if (typeof(toNode) == "string") {
                toNode = self.getObjectById(toNode);
            }
            if (fromNode && toNode) {
                var f_offset = 0,
                    t_offset = 0;
                var sp = { x: line.path[0].x, y: line.path[0].y };
                var ep = { x: line.path[line.path.length - 1].x, y: line.path[line.path.length - 1].y };
                var f_center = tools.getNodeCenter(fromNode);
                var t_center = tools.getNodeCenter(toNode);
                if (fromDirection == LineDirection.Top || fromDirection == LineDirection.Bottom) {
                    f_offset = sp.x - f_center.x;
                } else if (fromDirection == LineDirection.Left || fromDirection == LineDirection.Right) {
                    f_offset = sp.y - f_center.y;
                }
                if (toDirection == LineDirection.Top || toDirection == LineDirection.Bottom) {
                    t_offset = ep.x - t_center.x;
                } else if (toDirection == LineDirection.Left || toDirection == LineDirection.Right) {
                    t_offset = ep.y - t_center.y;
                }
                line.linkInfo = {
                    fromDirection: fromDirection,
                    toDirection: toDirection,
                    fromOffset: f_offset,
                    toOffset: t_offset
                }
            }
        }
        //根据连线在节点中心的偏移量计算绝对坐标
        function getPointByLineOffset(line, node, direction) {
            var f_offset = 0,
                t_offset = 0,
                p = null;
            f_offset = line.linkInfo.fromOffset;
            t_offset = line.linkInfo.toOffset;
            var center = tools.getNodeCenter(node);
            var state = line.from.id == node.id ? "from" : "to";
            if (line.from == node.id) {
                state = "from";
            } else if (line.to == node.id) {
                state = "to";
            } else {
                return null;
            }
            var offset = state == "from" ? f_offset : t_offset;
            if (direction == LineDirection.Top) {
                p = { x: center.x + offset, y: node.point.y };
            } else if (direction == LineDirection.Bottom) {
                p = { x: center.x + offset, y: node.point.y + node.height };
            } else if (direction == LineDirection.Left) {
                p = { x: node.point.x, y: center.y + offset };
            } else {
                p = { x: node.point.x + node.width, y: center.y + offset };
            }
            return p;
        }
        //获取所有线段
        function getAllSegments() {
            var v_segments = [],
                h_segments = [];
            //整理水平线和垂直线
            for (var i = 0; i < self.lines.length; i++) {
                var segments = self.lines[i].getSegmenList();
                for (var n = 0; n < segments.length; n++) {
                    var s = segments[n];
                    var lineType = getLineType(s);
                    if (lineType == _LineType.horizontal) {
                        h_segments.push(s);
                    } else {
                        v_segments.push(s);
                    }
                }
            }
            return {
                v_segments: v_segments,
                h_segments: h_segments
            }
        }

        //全局验证线段交错，如果有交错时水平线上增加圆弧
        function updateIntersection() {
            var segments = getAllSegments();
            var v_segments = segments.v_segments;
            var h_segments = segments.h_segments;
            var ismark = false;
            for (var n = 0; n < h_segments.length; n++) {
                var h_s = h_segments[n];
                var isInter = h_s.getIntersection().length > 0;
                h_s.clearIntersection();
                for (var i = 0; i < v_segments.length; i++) {
                    var v_s = v_segments[i];
                    var intr = tools.segmentsIntr(h_s.sp, h_s.ep, v_s.sp, v_s.ep);
                    var alwaySize = transitionRadius + 5;
                    if (intr) {
                        if (Math.abs(intr.x - h_s.sp.x) <= alwaySize || Math.abs(intr.x - h_s.ep.x) <= alwaySize) {
                            continue;
                        }
                        if (Math.abs(intr.y - v_s.sp.y) <= alwaySize || Math.abs(intr.y - v_s.ep.y) <= alwaySize) {
                            continue;
                        }

                        var list = h_s.getIntersection();
                        var isExits = false;
                        for (var c = 0; c < list.length; c++) {
                            if (list[c].x == intr.x && list[c].y == intr.y) {
                                isExits = true;
                                break;
                            }
                        }
                        if (!isExits) {
                            h_s.setIntersection(intr);
                        }

                    }
                }
                if (h_s.getIntersection().length > 0 || isInter) {
                    h_s.render();
                }
            }
        }

        //获取开始画线信息
        function getDrawLineStartPointInfo(node, point) {
            var downPoint = getMousePointByCanvas({
                x: point.x,
                y: point.y
            });
            var down_direction = tools.getNodeDirection(node, downPoint);
            var nodeCenter = tools.getNodeCenter(node);
            if (down_direction == LineDirection.Right) {
                downPoint.x = nodeCenter.x + (nodeSize.width / 2);
                if (downPoint.y < node.point.y) {
                    downPoint.y = node.point.y;
                }
                if (downPoint.y > node.point.y + node.height) {
                    downPoint.y = node.point.y + node.height;
                }
                if (Math.abs(downPoint.y - nodeCenter.y) < centerOffset) {
                    downPoint.y = nodeCenter.y;
                } else {
                    downPoint.y = self.getGridPoint(downPoint).y;
                }
            }
            if (down_direction == LineDirection.Left) {
                downPoint.x = node.point.x;
                if (downPoint.y < node.point.y) {
                    downPoint.y = node.point.y;
                }
                if (downPoint.y > node.point.y + node.height) {
                    downPoint.y = node.point.y + node.height;
                }
                if (Math.abs(downPoint.y - nodeCenter.y) < centerOffset) {
                    downPoint.y = nodeCenter.y;
                } else {
                    downPoint.y = self.getGridPoint(downPoint).y;
                }
            } else if (down_direction == LineDirection.Bottom) {
                downPoint.y = node.point.y + node.height;

                if (downPoint.x < node.point.x) {
                    downPoint.x = node.point.x;
                }
                if (downPoint.x > node.point.x + node.width) {
                    downPoint.x = node.point.x + node.width;
                }
                if (Math.abs(downPoint.x - nodeCenter.x) < centerOffset) {
                    downPoint.x = nodeCenter.x;
                } else {
                    downPoint.x = self.getGridPoint(downPoint).x;
                }
            } else if (down_direction == LineDirection.Top) {
                downPoint.y = node.point.y;
                if (downPoint.x < node.point.x) {
                    downPoint.x = node.point.x;
                }
                if (downPoint.x > node.point.x + node.width) {
                    downPoint.x = node.point.x + node.width;
                }
                if (Math.abs(downPoint.x - nodeCenter.x) < centerOffset) {
                    downPoint.x = nodeCenter.x;
                } else {
                    downPoint.x = self.getGridPoint(downPoint).x;
                }
            }
            var p = { x: downPoint.x, y: downPoint.y };
            var info = {
                point: p,
                direction: down_direction
            }
            return info;
        }
        //获取完成画线信息
        function getDrawLineEndPointInfo(node, point) {
            var overPoint = getMousePointByCanvas({
                x: point.x,
                y: point.y
            });
            var stoffset = 5
            var nodeCenter = tools.getNodeCenter(node);
            var over_direction = tools.getNodeDirection(node, overPoint);
            if (over_direction == LineDirection.Left) {
                if (overPoint.y < node.point.y) {
                    overPoint.y = node.point.y;
                }
                if (overPoint.y > node.point.y + node.height) {
                    overPoint.y = node.point.y + node.height;
                }
                if (Math.abs(overPoint.y - nodeCenter.y) < centerOffset) {
                    overPoint.y = nodeCenter.y;
                } else {
                    overPoint.y = self.getGridPoint(overPoint).y;
                }
                overPoint.x = node.point.x;
            } else if (over_direction == LineDirection.Right) {
                if (overPoint.y < node.point.y) {
                    overPoint.y = node.point.y;
                }
                if (overPoint.y > node.point.y + node.height) {
                    overPoint.y = node.point.y + node.height;
                }
                if (Math.abs(overPoint.y - nodeCenter.y) < centerOffset) {
                    overPoint.y = nodeCenter.y;
                } else {
                    overPoint.y = self.getGridPoint(overPoint).y
                }
                overPoint.x = node.point.x + node.width;
            } else if (over_direction == LineDirection.Top) {
                if (overPoint.x < node.point.x) {
                    overPoint.x = node.point.x;
                }
                if (overPoint.x > node.point.x + node.width) {
                    overPoint.x = node.point.x + node.width;
                }
                if (Math.abs(overPoint.x - nodeCenter.x) < centerOffset) {
                    overPoint.x = nodeCenter.x;
                } else {
                    overPoint.x = self.getGridPoint(overPoint).x
                }
                overPoint.y = node.point.y;
            } else if (over_direction == LineDirection.Bottom) {
                if (overPoint.x < node.point.x) {
                    overPoint.x = node.point.x;
                }
                if (overPoint.x > node.point.x + node.width) {
                    overPoint.x = node.point.x + node.width;
                }
                if (Math.abs(overPoint.x - nodeCenter.x) < centerOffset) {
                    overPoint.x = nodeCenter.x;
                } else {
                    overPoint.x = self.getGridPoint(overPoint).x
                }
                overPoint.y = node.point.y + node.height;
            }

            var p = { x: overPoint.x, y: overPoint.y };
            var info = {
                point: p,
                direction: over_direction
            }
            return info;
        }

        //设置节点所在位置
        function setNodePosition(node, newPosition) {
            nodePosition = { x: {}, y: {} }
            for (var i = 0; i < self.nodes.length; i++) {
                var n = self.nodes[i];
                if (!nodePosition.x[n.point.x]) {
                    nodePosition.x[n.point.x] = [];
                }
                if (!nodePosition.y[n.point.y]) {
                    nodePosition.y[n.point.y] = [];
                }
                nodePosition.x[n.point.x].push(n);
                nodePosition.y[n.point.y].push(n);
            }
            //console.log(nodePosition)
        }

        //检测相同位置是否有其他节点
        function checkSamePositionNode(node, newPosition) {
            var x = newPosition.x;
            var y = newPosition.y;
            var result = { x: false, y: false };
            if (nodePosition.x[x] && nodePosition.x[x].length > 0) {
                result.x = true;
            } else if (nodePosition.x[x] && nodePosition.x[x].length == 1 && nodePosition.x[x][0] != node) {
                result.x = true;
            }
            if (nodePosition.y[y] && nodePosition.y[y].length > 0) {
                result.y = true;
            }
            // else if (nodePosition.y[y] && nodePosition.y[y].length == 1 && nodePosition.y[y][0] != node) {
            //     result.y = true;
            // }
            return result;
        }

        function showSamePositionNodeBaseLine(node, newPosition) {
            var result = checkSamePositionNode(node, newPosition);
            baseLine_v.hide();
            baseLine_h.hide();
            var svgOffset = getSvgOffset();
            if (result.x) {

                baseLine_v.show();
                baseLine_v.css("left", newPosition.x + svgOffset.left);
            }
            if (result.y) {
                baseLine_h.show();
                baseLine_h.css("top", newPosition.y + svgOffset.top);
            }
        }
        //隐藏基准线
        function hideBaseLine() {
            baseLine_v.hide();
            baseLine_h.hide();
        }

        function getRect() {
            var x = Number.MAX_VALUE,
                y = Number.MAX_VALUE,
                width = Number.MIN_VALUE,
                height = Number.MIN_VALUE;
            for (var i = 0; i < this.nodes.length; i++) {
                var node = this.nodes[i];
                if (node.point.x < x) {
                    x = node.point.x;
                }
                if ((node.point.x + node.width) > width) {
                    width = node.point.x + node.width;
                }
                if (node.point.y < y) {
                    y = node.point.y;
                }
                if ((node.point.y + node.height) > height) {
                    height = node.point.y + node.height;
                }
            }
            for (var i = 0; i < this.lines.length; i++) {
                var line = this.lines[i];
                for (var n = 0; n < line.path.length; n++) {
                    if (line.path[n].x < x) {
                        x = line.path[n].x;
                    }
                    if (line.path[n].x > width) {
                        width = line.path[n].x;
                    }
                    if (line.path[n].y < y) {
                        y = line.path[n].y;
                    }
                    if (line.path[n].y > height) {
                        height = line.path[n].y
                    }
                }

            }
            return {
                x: x,
                y: y,
                width: width,
                height: height
            }
        }

        //获取画布偏移量
        function getSvgOffset() {
            var svgRootOffset = {
                top: Math.abs(parseFloat(self.svgRoot.css("top"))),
                left: Math.abs(parseFloat(self.svgRoot.css("left")))
            }
            return svgRootOffset;
        }
        //命令
        var _command = {
            //设置状态
            "setState": function(state) {
                this.state = state;
            },
            //清空状态
            "clearState": function() {
                this.state = "";
            },
            //添加节点
            "addNode": function(opts) {
                var options = $.extend({ type: 1 }, opts);
                var p = { x: options.x || 0, y: options.y || 0 };
                if (!p.x) {
                    p.x = 0;
                }
                if (!p.y) {
                    p.y = 0;
                }
                if (options.mouseConvert == true) {
                    var mp = getMousePointByCanvas({
                        x: options.x,
                        y: options.y
                    });
                    p.x = mp.x;
                    p.y = mp.y;
                }
                p = this.getGridPoint(p);
                options.x = p.x;
                options.y = p.y;
                if (!options.name) {
                    options.name = "新建环节" + this.nodes.length;
                }
                var node = new DSFA.Node(this, options);
                this.addToPanel(node);
                return node;
            },
            //画线
            "addLine": function(opts) {
                var options = $.extend({ type: 0 }, opts);
                var line = new DSFA.Line(this, options);
                self.addToPanel(line);
                var fn, tn;
                if (options.from) {
                    fn = objectMap[options.from]
                }
                if (options.to) {
                    tn = objectMap[options.to];
                }
                setNodeLinkNodeInfo(fn, tn, line);
                return line;
            },
			//泳道
            "addLane": function(opts) {
                var options = $.extend({}, opts);
                createLane.call(self, options);
            },
            //编辑节点名字
            "editNodeName": function(nodeId) {

            },
            //泳道互换
            "laneExChange": function() {

            }
        }
    }

    //泳道类
    DSFA.Lane = function(flow, opt) {
        var element = null,
            title = null,
            head = null,
            bg = null,
            text = null,
            laneSelected = null;
        var selected = false;
        options = $.extend({
            size: 260,
            direction: LaneDirection.vertical
        }, opt);
        this.id = options.id || null;
        this.name = options.name || "";
        this.index = options.index;
        this.direction = options.direction;
        this.isRender = false;
        this.size = options.size;

        this.attributes = $.extend(true, {}, options.attributes);

        this.getElement = function(attr) {
            return [
                element,
                head,
                title,
                bg,
                text
            ];
        }
        this.render = function() {
            if (!this.isRender) {
                element = $("<div class=lane/>");
                var vOrh = this.direction == LaneDirection.vertical ? ".v_lane" : ".h_lane";
                var beforeIndex = this.index - 1;
                if (beforeIndex < 0) {
                    if ($(vOrh).find(".lane").length <= 0) {
                        element.appendTo(flow["lane_" + this.direction]);
                    } else {
                        element.prependTo(flow["lane_" + this.direction]);
                    }
                } else {
                    var beforeEl = $(vOrh).find(".lane").eq(this.index - 1);
                    element.insertAfter(beforeEl);
                }
                head = $("<div class=head/>");
                title = $("<div class=title/>");
                bg = $("<div class=bg/>");
                laneSelected = $("<div class='laneSelected'/>");
                head.appendTo(element);
                bg.appendTo(element);
                laneSelected.appendTo(element);
                title.appendTo(head);
                text = $("<span class='textContent ellipsis'/>").appendTo(title);
                var plus_left = $("<img class='plus left' src='/dsfa/res/dsf_styles/themes/workFlow/addLane.png'/>").appendTo(title);
                var plus_right = $("<img class='plus right' src='/dsfa/res/dsf_styles/themes/workFlow/addLane.png'/>").appendTo(title);
                var drag_left = $("<span class='resizeLane'/>").appendTo(title);
                element.data("object", this);
                this.isRender = true;
                if (this.index === undefined) {
                    if (this.direction == LaneDirection.vertical) {
                        this.index = flow.Lanes.vertical.length - 1;
                    } else {
                        this.index = flow.Lanes.horizontal.length - 1;
                    }
                }

            }
            element.attr("index", this.index);
            //alert(this.size)
            text.text(this.name).css("width", this.size + "px");
            if (this.direction == LaneDirection.vertical) {
                //var index = $.inArray(this, flow.Lanes.vertical);
                var pre = flow.Lanes.vertical[this.index - 1];
                var left = 0;
                if (pre) {
                    var preEl = pre.getElement()[0];
                    if (preEl) {
                        left = parseFloat(preEl.css("left")) + parseFloat(preEl.css("width"));
                    }
                }
                element.css("left", left + "px").css("top", "0px").css("width", this.size + "px");
            } else if (this.direction == LaneDirection.horizontal) {
                var pre = flow.Lanes.horizontal[this.index - 1];
                var top = 0;
                if (pre) {
                    var preEl = pre.getElement()[0];
                    if (preEl) {
                        top = parseFloat(preEl.css("top")) + parseFloat(preEl.css("height"));
                    }
                }

                tools.laneTextRotate(text);
                element.css("left", "0px").css("top", top + "px").css("height", this.size + "px");
            }
            flow.trigger("lane.render", this);
        }
        this.isSelected = function() {
            return selected;
        }
        this.selected = function() {
            selected = true;
            element.addClass("selected");
            flow.trigger("lane.selected", this);
        }
        this.unSelected = function() {
            selected = false;
            element.removeClass("selected");
        }

        this.remove = function() {
            var self = this;
            element.fadeOut(300, function() {
                if (element) {
                    element.remove();
                }
            });
        }
    }
    DSFA.Lane.getObjectByTarget = function(target) {
        //if(targetNode)
        return $(target).data("object");
    }

    DSFA.Lane.prototype.attr = {};

    //节点类
    DSFA.Node = function(flow, opt) {
        var self = this;
        var element = null,
            text = null,
            nodeOuter = null,
            isShowJoinPoint;
        var offsetSize = 5;
        var selected = false;
        var nodeConfig = null;
        options = $.extend({
            name: "",
            width: nodeSize.width,
            height: nodeSize.height,
            x: 0,
            y: 0,
            img: "",
            type: 1
        }, opt);
        this.id = options.id || null;
        this.name = options.name;
        this.point = { x: options.x, y: options.y };
        this.img = options.img;
        this.width = options.width;
        this.height = options.height;
        //this.nodeContent=null;
        this.isRender = false;
        this.type = options.type;
        this["out"] = [];
        this["in"] = [];
        this.attributes = $.extend(true, {}, options.attributes);

        this.getElement = function() {
            return [element, text];
        }
        this.render = function() {
            if (!this.isRender) {
                nodeOuter = $("<div class=nodeOuter/>");
                nodeOuter.width(this.width + (offsetSize * 2)).height(this.height + (offsetSize * 2));
                nodeOuter.css("padding", offsetSize + "px");
                nodeOuter.appendTo(flow.svgRoot);
                element = $("<div class=node/>");
                element.width(this.width).height(this.height);
                element.appendTo(nodeOuter);
                text = $("<span class='nodename ellipsis' title='" + this.name + "'/>");
                //text.insertBefore(flow.svgRoot.find("svg"));
                text.appendTo(flow.svgRoot);

                element.data("object", this);
                nodeOuter.data("object", this);
                text.data("object", this);
                this.isRender = true;
            }
            if (self.img) {
                element.css("backgroundImage", "url(" + this.img + ")");
                element.css("backgroundSize", "100% 100%");
            }
            this.point.x = this.point.x < 0 ? 0 : this.point.x;
            this.point.y = this.point.y < 0 ? 0 : this.point.y;

            nodeOuter.css("top", this.point.y - offsetSize).css("left", this.point.x - offsetSize);
            text.text(this.name).attr("title", this.name);
            var textLeftOffset = (element.width() - text.width()) / 2;
            var textTopOffset = element.height();
            text.css("left", self.point.x + textLeftOffset);
            text.css("top", self.point.y + textTopOffset);

            nodeConfig = flow.flowConfig.Nodes["Node_" + self.type];

            if (nodeConfig) {
                element.css("background-image", "url('" + nodeConfig.src + "')");
            }
            flow.trigger("node.render", self);
        }
        this.moveTo = function(x, y) {
            this.point.x = x;
            this.point.y = y;
            this.render();
            flow.trigger("node.move", this);
        }
        this.showJoinPoint = function() {
            if (!isShowJoinPoint) {
                var l = $("<div class='joinPoint l'/>").data("object", this).appendTo(nodeOuter);
                var r = $("<div class='joinPoint r'/>").data("object", this).appendTo(nodeOuter);
                var t = $("<div class='joinPoint t'/>").data("object", this).appendTo(nodeOuter);
                var b = $("<div class='joinPoint b'/>").data("object", this).appendTo(nodeOuter);
                isShowJoinPoint = true;
            }

        }
        this.hideJoinPoint = function() {
            nodeOuter.find(".joinPoint").remove();
            isShowJoinPoint = false;
        }

        this.isSelected = function() {
            return selected;
        }
        this.selected = function() {
            selected = true;
            element.addClass("selected");
            flow.trigger("node.selected", this);
        }
        this.unSelected = function() {
            selected = false;
            element.removeClass("selected");
        }

        this.remove = function() {
            if (element) {
                element.remove();
            }
            if (text) {
                text.remove();
            }
            if (nodeOuter) {
                nodeOuter.remove();
            }
        }
        this.getConfig = function() {
            return flow.flowConfig.Nodes["Node_" + self.type];
        }
    }
    DSFA.Node.getObjectByTarget = function(target) {
        //if(targetNode)
        return $(target).data("object");
    }
    DSFA.Node.prototype.attr = {};

    //线类
    DSFA.Line = function(flow, opts) {
        var self = this;
        var oldstroke = null;
        var elementList = [];
        var options = {
            "path": [],
            "from": null,
            "to": null,
            "strokeWidth": flow.flowConfig.Path.strokeWidth,
            "stroke": flow.flowConfig.Path.stroke,
            "arrowEnd": flow.flowConfig.Path.arrow
        }
        var selected = false;
        options = $.extend(options, opts);
        this.id = options.id || null;
        this.name = "";
        this.type = options.type || 0;
        this.path = options.path ? ($.inArray(options.path) ? options.path : [options.path]) : [];
        this.from = options.from;
        this.to = options.to;
        this.strokeWidth = options.strokeWidth;
        this.stroke = options.stroke;
        //this.highStroke = "#ff0000";
        this.arrowEnd = options.arrowEnd;
        this.isRender = false;
        this.fromLocalPoint = { x: 0, y: 0 };
        this.toLocalPoint = { x: 0, y: 0 };
        this.linkInfo = options.linkInfo || {};
        this.attributes = $.extend(true, {}, options.attributes);



        function remove() {
            if (elementList) {
                for (var i = elementList.length - 1; i >= 0; i--) {
                    elementList[i].remove();
                }
            }
            elementList = [];
        }
        this.getSegmenList = function() {
            return elementList;
        }

        this.render = function() {
            var line = null;
            remove();
            //var lineConfig = flow.flowConfig.Lines["Line_" + this.type];
            this.stroke = getLineStroke.call(this);
            var segmentArr = tools.convertSegmentByPoint(this.path);
            for (var i = 0; i < segmentArr.length; i++) {
                var path = [];
                var p = segmentArr[i];
                var s = new DSFA.Segmen(flow, this, i, {
                    "strokeWidth": this.strokeWidth,
                    "stroke": this.stroke
                });

                s.sp = p.sp;
                s.ep = p.ep;
                if (i == segmentArr.length - 1) {
                    s.isLast = true;
                }
                s.direction = tools.getDirection(s.sp, s.ep);
                elementList.push(s);
            }
            for (var i = 0; i < elementList.length; i++) {
                elementList[i].render();
            }
        }
        this.refresh = function() {
            if (elementList) {
                for (var i = 0; i < elementList.length; i++) {
                    elementList[i].refresh();
                }
            }
        }
        this.remove = function() {
            remove();
        }

        this.isSelected = function() {
            return selected;
        }
        this.selected = function() {
            selected = true;
            oldstroke = this.stroke;
            this.stroke = "#ff0000";
            this.refresh();
            flow.trigger("line.selected", this);
        }
        this.unSelected = function() {
            selected = false;
            this.stroke = getLineStroke.call(this);
            this.refresh();
        }
        this.hide = function() {
            if (elementList) {
                for (var i = elementList.length - 1; i >= 0; i--) {
                    elementList[i].hide();
                }

            }
        }
        this.show = function() {
            if (elementList) {
                for (var i = elementList.length - 1; i >= 0; i--) {
                    elementList[i].show();
                }

            }
        }

        this.getPreLine = function(s) {
            return elementList[s.index - 1];
        }
        this.getNextLine = function(s) {
            return elementList[s.index + 1];
        }

        function getLineStroke() {
            if (this.isSelected()) {
                return "#ff0000";
            }
            var lineConfig = flow.flowConfig.Lines["Line_" + this.type];
            if (lineConfig) {
                return lineConfig.stroke;
            } else {
                return flow.flowConfig.Path.stroke;
            }
        }
    }

    //线类代理
    var Line_proxy = function(flow, opts) {
        var element = null,
            arrow = null;
        var options = {
            "path": [],
            "from": null,
            "to": null,
            "strokeWidth": 2,
            "stroke": flow.flowConfig.Path.stroke,
            "stroke-dasharray": opts["stroke-dasharray"]
        }
        options = $.extend(options, opts);
        this.id = null;
        this.path = options.path;
        this.from = options.from;
        this.to = options.to;
        this.isRender = false;
        this.fromLocalPoint = { x: 0, y: 0 };
        this.toLocalPoint = { x: 0, y: 0 };
        this.linkInfo = options.linkInfo || {};
        this.render = function() {
            var line = null;
            var path = [];
            //var segmentArr = tools.convertSegmentByPoint(this.path);
            for (var i = 0; i < this.path.length; i++) {
                var p = this.path[i];
                if (i == 0) {
                    path.push(["M", p.x, p.y]);
                } else {
                    path.push(["L", p.x, p.y]);
                }
            }
            if (path.length > 1) {
                var listSegmen = {
                    sp: {
                        x: path[path.length - 2][1],
                        y: path[path.length - 2][2]
                    },
                    ep: {
                        x: path[path.length - 1][1],
                        y: path[path.length - 1][2]
                    }
                };
                if (listSegmen.sp.y == listSegmen.ep.y) {
                    listSegmen.ep.x = listSegmen.ep.x - (listSegmen.sp.x < listSegmen.ep.x ? 2 : -2);
                } else {
                    listSegmen.ep.y = listSegmen.ep.y - (listSegmen.sp.y < listSegmen.ep.y ? 2 : -2);
                }
                try {
                    if (!element) {
                        element = flow.paper.path(path).attr({
                            "stroke-width": options.strokeWidth,
                            "stroke": options.stroke,
                            "stroke-dasharray": options["stroke-dasharray"]
                        });
                        arrow = flow.paper.path(tools.drawArrow(listSegmen)).attr({
                            "stroke-width": options.strokeWidth,
                            "stroke": options.stroke,
                            "fill": options.stroke
                        });
                        this.isRender = true;
                    } else {
                        element.attr({
                            path: path,
                            "stroke-width": options.strokeWidth,
                            "stroke": options.stroke
                        });
                        if (arrow) {
                            arrow.attr({
                                "path": tools.drawArrow(listSegmen),
                                "stroke-width": options.strokeWidth,
                                "stroke": options.stroke,
                                "fill": options.stroke
                            });
                        }

                    }
                } catch (ex) {}

            }

        }

        this.remove = function() {
            if (element) {
                element.remove();
            }
            if (arrow) {
                arrow.remove();
            }
        }

    }

    //线段类
    DSFA.Segmen = function(flow, line, index) {
        var element = null,
            arrow = null;
        var inter = [];
        var line = line;
        var index = index;
        //var isHigh = false;
        this.sp = null;
        this.ep = null;
        this.type = null;
        this.isLast = false;
        this.index = index;
        this.direction = null;
        this.hasTransition = false;
        this.getLine = function() {
            return line;
        }
        this.render = function() {
                this.sp.x = parseFloat(this.sp.x);
                this.sp.y = parseFloat(this.sp.y);
                this.ep.x = parseFloat(this.ep.x);
                this.ep.y = parseFloat(this.ep.y);
                var arr = [];
                var sp = {
                    "type": "point",
                    "data": { x: this.sp.x, y: this.sp.y }
                };
                var ep = {
                    "type": "point",
                    "data": { x: this.ep.x, y: this.ep.y }
                };
                var path = [];
                this.remove();
                var args = { "line": line, "segmen": this, "index": index };
                flow.trigger("renderLineBefore", args);
                var arrowSegmen = { sp: { x: sp.data.x, y: sp.data.y }, ep: { x: ep.data.x, y: ep.data.y } };
                if (this.sp.y == this.ep.y) {
                    this.type = _LineType.horizontal;
                    if (this.isLast) {
                        arrowSegmen.ep.x = arrowSegmen.ep.x - (sp.data.x < ep.data.x ? 2 : -2);
                    }
                } else {
                    this.type = _LineType.vertical;
                    if (this.isLast) {
                        arrowSegmen.ep.y = arrowSegmen.ep.y - (sp.data.y < ep.data.y ? 2 : -2);
                    }
                }

                //如果上一根线有过渡圆弧，则当前线需要减去圆弧半径
                var pre = line.getPreLine(this);
                if (pre && pre.type != this.type) {
                    if (pre.hasTransition) {
                        if (this.type == _LineType.horizontal) {
                            sp.data.x = this.direction == "left" ? sp.data.x - transitionRadius : sp.data.x + transitionRadius;
                        } else {
                            sp.data.y = this.direction == "top" ? sp.data.y - transitionRadius : sp.data.y + transitionRadius;
                        }
                    }

                }

                //如果是水平线，获取交叉点
                if (this.type == _LineType.horizontal && inter.length > 0) {
                    var radius = 5;
                    var dir = "right";
                    if (this.sp.x > this.ep.x) {
                        dir = "left";
                    }
                    inter = inter.sort(function(v1, v2) {
                        if (dir == "right") {
                            return v1.x < v2.x ? -1 : 1;
                        } else {
                            return v1.x < v2.x ? 1 : -1;
                        }
                    });
                    arr.push(sp);
                    for (var i = 0; i < inter.length; i++) {
                        var l = inter[i];
                        var obj1 = {
                            "type": "point",
                            "data": {
                                x: l.x - (dir == "right" ? radius : -radius),
                                y: l.y
                            }
                        }
                        var obj2 = {
                            "type": "point",
                            "data": {
                                x: l.x + (dir == "right" ? radius : -radius),
                                y: l.y
                            }
                        }
                        arr.push(obj1);
                        arr.push({
                            "type": "arc",
                            data: {
                                "radius": radius,
                                "overX": obj2.data.x,
                                "overY": obj2.data.y,
                                "sweep": dir == "right" ? 1 : 0
                            }
                        });
                        arr.push(obj2);
                    }

                } else {
                    arr.push(sp);
                }

                //与下一根线的过渡圆弧
                var next = line.getNextLine(this);
                if (next && next.type != this.type) {
                    var line_length = 0;
                    line_length = tools.getLineLength(this.sp, this.ep);
                    n_line_length = tools.getLineLength(next.sp, next.ep);
                    var alwaySzie = transitionRadius * 2;
                    if (line_length <= alwaySzie || n_line_length <= alwaySzie) {
                        arr.push(ep);
                        this.hasTransition = false;
                    } else {
                        var obj1, obj2;
                        line_length = tools.getLineLength(next.sp, next.ep);
                        if (this.type == _LineType.vertical) {
                            obj1 = {
                                "type": "point",
                                "data": {
                                    x: this.ep.x,
                                    y: this.ep.y - (this.direction == "top" ? -transitionRadius : transitionRadius)
                                }
                            }
                            arr.push(obj1);
                            var sweep = null; //圆弧的顺时针和逆时针 1为顺，0为逆
                            if ((this.direction == "bottom" && next.direction == "left") || (this.direction == "top" && next.direction == "right")) {
                                sweep = 1;
                            } else if ((this.direction == "top" && next.direction == "left") || (this.direction == "bottom" && next.direction == "right")) {
                                sweep = 0;
                            }
                            arr.push({
                                "type": "arc",
                                data: {
                                    "radius": transitionRadius,
                                    "overX": this.ep.x - (next.direction == "left" ? transitionRadius : -transitionRadius), //(next.direction == "left")?-transitionRadius:transitionRadius,
                                    "overY": this.ep.y,
                                    "sweep": sweep
                                }
                            });
                        } else {
                            obj1 = {
                                "type": "point",
                                "data": {
                                    x: this.ep.x - (this.direction == "right" ? transitionRadius : -transitionRadius),
                                    y: this.ep.y
                                }
                            }
                            arr.push(obj1);
                            var sweep = null; //圆弧的顺时针和逆时针 1为顺，0为逆
                            if ((this.direction == "left" && next.direction == "top") || (this.direction == "right" && next.direction == "bottom")) {
                                sweep = 1;
                            } else if ((this.direction == "left" && next.direction == "bottom") || (this.direction == "right" && next.direction == "top")) {
                                sweep = 0;
                            }
                            arr.push({
                                "type": "arc",
                                data: {
                                    "radius": transitionRadius,
                                    "overX": this.ep.x, //(next.direction == "left")?-transitionRadius:transitionRadius,
                                    "overY": this.ep.y - (next.direction == "top" ? transitionRadius : -transitionRadius),
                                    "sweep": sweep
                                }
                            });
                        }
                        this.hasTransition = true;
                    }
                } else {
                    arr.push(ep);
                    this.hasTransition = false;
                }
                for (var n = 0; n < arr.length; n++) {
                    var obj = arr[n];
                    if (n == 0 && obj.type == "point") {
                        path.push(["M", obj.data.x, obj.data.y]);
                    } else if (obj.type == "point") {
                        path.push(["L", obj.data.x, obj.data.y]);
                    } else if (obj.type == "arc") {
                        path.push(["A", obj.data.radius, obj.data.radius, 0, 0, obj.data.sweep, obj.data.overX, obj.data.overY]);
                    }
                }
                try {
                    element = flow.paper.path(path).attr({
                        "stroke-width": line.strokeWidth,
                        "stroke": line.stroke
                    });
                    if (this.isLast) {
                        arrow = flow.paper.path(tools.drawArrow(arrowSegmen)).attr({
                            "stroke-width": line.strokeWidth,
                            "stroke": line.stroke,
                            "fill": line.stroke
                        });
                    }
                } catch (ex) {

                }
                if (element) {
                    $(element[0]).data("object", this);
                }
                if (arrow) {
                    $(arrow[0]).data("object", this);
                }
            }
            //设置交点
        this.setIntersection = function(point) {
                inter.push(point);
            }
            //清理已经有的交点
        this.clearIntersection = function() {
            inter = [];
        }
        this.getIntersection = function() {
            return inter;
        }
        this.remove = function() {
            if (element) {
                element.remove();
            }
            if (arrow) {
                arrow.remove();
            }
        }
        this.refresh = function() {
            if (element) {
                element.attr({
                    "stroke-width": line.strokeWidth,
                    "stroke": line.stroke
                });
            }
            if (arrow) {
                arrow.attr({
                    "stroke-width": line.strokeWidth,
                    "stroke": line.stroke,
                    "fill": line.stroke
                });
            }
        }
        this.hide = function() {
            if (element) {
                element.hide();
            }
            if (arrow) {
                arrow.hide();
            }
        }
        this.show = function() {
            if (element) {
                element.show();
            }
            if (arrow) {
                arrow.show();
            }
        }
    }

    DSFA.Segmen.getObjectByTarget = function(target) {
        return $(target).data("object");
    }

    var tools = {
        "uuid": function(len, radix) {
            var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var chars = CHARS,
                uuid = [],
                i;
            len = len || 15;
            radix = radix || chars.length;

            if (len) {
                // Compact form 
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form 
                var r;

                // rfc4122 requires these characters 
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as 
                // per rfc4122, sec. 4.1.5 
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        },
        //添加纵向泳道文本旋转
        "laneTextRotate": function(text) {
            text.css("transform", "rotate(-90deg) translateX(-" + text.outerWidth() + "px)");
        },
        //获取节点中心点
        "getNodeCenter": function(node) {
            var x = node.point.x;
            var y = node.point.y;
            x += nodeSize.width / 2;
            y += nodeSize.height / 2;
            return { x: x, y: y };
        },
        //获取节点对角线的角度
        "getNodeArriswiseAngle": function(node) {
            var p1 = {
                x: node.point.x,
                y: node.point.y
            };
            var p2 = {
                x: node.point.x + node.width,
                y: node.point.y + node.height
            }
            var deg = this.getAngle(p1, p2);
            return deg;
        },
        "getNodeDirection": function(node, targetPoint) {
            var direction = "";
            var arriswiseAngle = this.getNodeArriswiseAngle(node);
            var p1 = this.getNodeCenter(node);
            var p2 = targetPoint;
            var deg = this.getAngle({ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y });
            var a = arriswiseAngle;
            if (deg == 0 || deg >= (360 - a) || deg <= a) {
                direction = LineDirection.Right;
            } else if (deg == 90 || (deg > a && deg <= (180 - a))) {
                direction = LineDirection.Bottom;
            } else if (deg == 270 || (deg > (180 + a) && deg < (360 - a))) {
                direction = LineDirection.Top
            } else {
                direction = LineDirection.Left;
            }
            return direction;
        },
        //获取画线方向
        "getDirection": function(startPoint, endPoint) {
            // var direction = "";
            // var deg = this.getAngle({ x: startPoint.x, y: startPoint.y }, { x: endPoint.x, y: endPoint.y });
            // var arriswiseAngle = this.getNodeArriswiseAngle()
            // var a = 30;
            // if (deg == 0 || deg >= (360 - a) || deg <= a) {
            //     direction = "right";
            // }
            // else if (deg == 90 || (deg > a && deg <= (180 - a))) {
            //     direction = "bottom";
            // }
            // else if (deg == 270 || (deg > (180 + a) && deg < (360 - a))) {
            //     direction = "top";
            // }
            // else {
            //     direction = "left";
            // }
            // return direction;

            var direction = "";
            var deg = this.getAngle({ x: parseFloat(startPoint.x), y: parseFloat(startPoint.y) }, { x: parseFloat(endPoint.x), y: parseFloat(endPoint.y) });
            if (deg == 0 || deg == 360) {
                direction = _Direction.Right;
            } else if (deg > 0 && deg < 90) {
                direction = _Direction.RightBottom;
            } else if (deg == 90) {
                direction = _Direction.Bottom;
            } else if (deg > 90 && deg < 180) {
                direction = _Direction.LeftBottom;
            } else if (deg == 180) {
                direction = _Direction.Left;
            } else if (deg > 180 && deg < 270) {
                direction = _Direction.LeftTop;
            } else if (deg == 270) {
                direction = _Direction.Top;
            } else if (deg > 270 && deg < 360) {
                direction = _Direction.RightTop;
            }
            return direction;
        },
        //获取弧度
        "getRadina": function(p1, p2, is360) {
            var radians = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
            if (is360 != false) {
                //修正第三象限和第二象限的弧度
                if ((p2.y - p1.y > 0 && p2.x - p1.x < 0) || p2.y - p1.y < 0 && p2.x - p1.x < 0) {
                    radians += Math.PI;
                }
                //修正第一象限弧度
                else if (p2.y - p1.y < 0 && p2.x - p1.x > 0) {
                    radians += Math.PI * 2;
                }
                //x轴负方向 180度
                if (p2.x < p1.x && p2.y == p1.y) {
                    //console.log("x轴负方向");
                    radians = Math.PI;
                }
                //y轴负方向 270度
                else if (p2.x == p1.x && p2.y < p1.y) {
                    radians = 1.5 * Math.PI;
                }
            }
            return radians;
        },
        //获取数学坐标角度
        "getAngle": function(p1, p2) {
            var radina = this.getRadina(p1, p2) //用反三角函数求弧度
            var angle = 180 / (Math.PI / radina); //将弧度转换成角度
            return angle;
        },
        //角度转弧度
        "angleToRadina": function(angle) {
            return angle * Math.PI / 180;
        },
        //获得线长度
        "getLineLength": function(p1, p2) {
            var x = p2.x - p1.x;
            var y = p2.y - p1.y;
            var length = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            return length;
        },
        //获取节点元素上下左右的连接点位置
        "getNodeJoinPoint": function(node) {
            var ncp = this.getNodeCenter(node);
            var point = {
                "top": {
                    x: ncp.x,
                    y: ncp.y - nodeSize.height / 2
                },
                "bottom": {
                    x: ncp.x,
                    y: ncp.y + nodeSize.height / 2
                },
                "left": {
                    x: ncp.x - nodeSize.width / 2,
                    y: ncp.y
                },
                "right": {
                    x: ncp.x + nodeSize.width / 2,
                    y: ncp.y
                }
            }
            return point;
        },
        //将线路径点转为线段
        "convertSegmentByPoint": function(points) {
            var segmentList = [];
            for (var i = 0; i < points.length; i++) {
                var point1 = points[i];
                var point2 = points[i + 1];
                if (point1 && point2) {
                    segmentList.push({
                        sp: point1,
                        ep: point2
                    });
                }
            }
            return segmentList;
        },
        //获取线段是否为水平线
        "getLineType": function(segmen) {
            //水平线
            if (segmen.sp.y == segmen.ep.y) {
                return _LineType.horizontal;
            }
            if (segmen.sp.x == segmen.ep.x) {
                return _LineType.vertical;
            }
        },
        //获取线段焦点
        "segmentsIntr": function(a, b, c, d) {
            //线段ab的法线N1  
            var nx1 = (b.y - a.y),
                ny1 = (a.x - b.x);

            //线段cd的法线N2  
            var nx2 = (d.y - c.y),
                ny2 = (c.x - d.x);

            //两条法线做叉乘, 如果结果为0, 说明线段ab和线段cd平行或共线,不相交  
            var denominator = nx1 * ny2 - ny1 * nx2;
            if (denominator == 0) {
                return false;
            }
            //在法线N2上的投影  
            var distC_N2 = nx2 * c.x + ny2 * c.y;
            var distA_N2 = nx2 * a.x + ny2 * a.y - distC_N2;
            var distB_N2 = nx2 * b.x + ny2 * b.y - distC_N2;

            // 点a投影和点b投影在点c投影同侧 (对点在线段上的情况,本例当作不相交处理);  
            if (distA_N2 * distB_N2 >= 0) {
                return false;
            }

            //  
            //判断点c点d 和线段ab的关系, 原理同上  
            //  
            //在法线N1上的投影  
            var distA_N1 = nx1 * a.x + ny1 * a.y;
            var distC_N1 = nx1 * c.x + ny1 * c.y - distA_N1;
            var distD_N1 = nx1 * d.x + ny1 * d.y - distA_N1;
            if (distC_N1 * distD_N1 >= 0) {
                return false;
            }

            //计算交点坐标  
            var fraction = distA_N2 / denominator;
            var dx = fraction * ny1,
                dy = -fraction * nx1;
            return { x: a.x + dx, y: a.y + dy };
        },
        "drawArrow": function(segmen) {
            var size = 8;
            //analysis line  
            //var line = paper.getById(line_id);
            //get last points  
            //var length = line.attrs.path.length;
            var x1 = segmen.sp.x; //单线段起点 
            var y1 = segmen.sp.y; //单线段起点  
            var x2 = segmen.ep.x; //单线段终点  
            var y2 = segmen.ep.y; //单线段终点  
            //get last angle  
            var angle = tools.getAngle(segmen.sp, segmen.ep); // Raphael.angle(x1, y1, x2, y2);//API方法获取角度，原直线倾斜度  
            var angle_one = Raphael.rad(angle - 25); //API方法转变为弧度  
            var angle_two = Raphael.rad(angle + 25); //API方法转变为弧度  
            //arrow points求出箭头的双向点  
            var angle_x1 = x2 - Math.cos(angle_one) * size;
            var angle_y1 = y2 - Math.sin(angle_one) * size;
            var angle_x2 = x2 - Math.cos(angle_two) * size;
            var angle_y2 = y2 - Math.sin(angle_two) * size;
            //return  
            var result = ["M", x2, y2, "L", angle_x1, angle_y1, "L", angle_x2, angle_y2, "Z"];
            return result;
        }

    }


})(DSFA || (DSFA = {}));