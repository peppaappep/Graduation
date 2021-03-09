
//$(document).ready(function () {
//    var link = document.createElement('link');
//    link.type = 'text/css';
//    link.rel = 'stylesheet';
//    link.href = __GlobalInfo.webroot+'/admin_client/resource/themes/gray/easyui.css';
//    document.getElementsByTagName("head")[0].appendChild(link);
//});

function getUrlParam(paramName) {
    var url = window.location.search;
    var oRegex = new RegExp('[\?&]' + paramName + '=([^&]+)', 'i');
    var oMatch = oRegex.exec(url);
    if (oMatch && oMatch.length > 1) {
        return decodeURI(oMatch[1]);
    } else {
        return "";
    }
}

/**
 * 获取地址中的所有参数
 * 匹配出参数，返回{paramName:paramValue}格式的对象
 * 未匹配则返回{}
 */
function getUrlParams(){
    var url = window.location.href;
    var wildMatch = url.match(/.*\?(\S+?=\S+&?)/);
    if( !wildMatch || wildMatch.length < 2 ){
        return {};
    }
    var paramStr = wildMatch[1];
    var result = {};
    var paramArr = paramStr.split("&");
    for(var i = 0; i < paramArr.length; i++){
        var paramItem = paramArr[i].split("=");
        if( paramItem[0] ){
            result[decodeURI(paramItem[0])] = decodeURI(paramItem[1]||"");
        }
    }
    return result;
}

function setUrlParam(name, value) {
    var reg = new RegExp("(\\?|&)" + name + "=([^&]*)(?=&|$)");
    var r = window.location.href.match(reg);
    if (r != null) {
        window.location.href = window.location.href.replace(reg, r[1] + name + "=" + escape(value));
    }
    else {
        var url = window.location.href;
        if (window.location.href.indexOf("?") < 0) {
            url += "?";
        }
        else {
            url += "&";
        }
        url += name + "=" + escape(value);
        window.location.href = url;
    }
}
function fillYear(length, jq, all, prev, beginyear) {
    var date = new Date();
    var currentYear = date.getFullYear();

    if (beginyear) {
        currentYear = beginyear;
    }

    if (all) {
        jq.append("<option value=\"\">全部</option>");
    }
    if (prev) {
        for (var index = currentYear - prev; index < (currentYear + length) ; index++) {
            if (index == currentYear) {
                jq.append("<option value=\"" + index + "\" selected=\"selected\">" + index + "</option>");
            } else {
                jq.append("<option value=\"" + index + "\">" + index + "</option>");
            }
        }
    } else {
        for (var index = currentYear; index > (currentYear - length) ; index--) {
            if (index == currentYear) {
                jq.append("<option value=\"" + index + "\" selected=\"selected\">" + index + "</option>");
            } else {
                jq.append("<option value=\"" + index + "\">" + index + "</option>");
            }
        }
    }
}
function changePageStyle(url) {
    var mycss;
    if (isIE()) {
        document.createStyleSheet(url);
    }
    else {
        $("head").append("<link href=\"" + url + "\" rel=\"stylesheet\" type=\"text/css\" />");
    }
}
function isIE() {
    var Ka = navigator.userAgent.toLowerCase();
    var rt = Ka.indexOf("opera") != -1;
    var r = Ka.indexOf("msie") != -1 && (document.all && !rt);
    return r;
}
//替换DSFA后台关键字
function replaceDSFAKeyWord(str) {
    var reg = /({)([@#&~%$][^\\}]+)}/g;
    str = str.replace(reg, function () {
        var args = arguments;
        return "\\" + args[1] + "\\" + args[2] + "}";
    });
    return str;
}

//加载样式内容
function loadStyle(styleText) {
    var s = document.createElement("style");
    s.type = "text/css";
    try {//IE
        s.styleSheet.cssText = styleText;
    } catch (e) {//FF Chrome
        s.appendChild(document.createTextNode(styleText));
    }
    document.getElementsByTagName("head")[0].appendChild(s);
}

//加载样式文件
function loadStyleFile(url) {
    var s = document.createElement("link");
    s.href = url;
    s.type = "text/css";
    s.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(s);
}

function addAttribute(rows) {
    for (var index = 0; index < rows.length; index++) {
        var obj = new Object();
        for (var o in rows[index]) {
            obj[o] = rows[index][o];
        }
        rows[index]["attributes"] = obj;
        if ((rows[index].children != undefined) && (rows[index].children.length > 0)) {
            addAttribute(rows[index].children);
        }
    }
    return rows;
}

/**
 * 为树形节点添加state属性
 * @param rows
 * @param currentLevel
 * @param tempState
 * @return {*}
 */
function addState(rows, currentLevel, tempState) {
    var state = "open";
    if (!currentLevel) {
        currentLevel = 1;
        var config = getSystemConfig();
        if (config && config.System && config.System.Tree && config.System.Tree.OpenLevel) {
            state = config.System.Tree.OpenLevel.text;
        }
    } else {
        state = tempState;
    }
    for (var index = 0; index < rows.length; index++) {
        if (state == "open" || state == "closed") {
            rows[index].state = state;
        } else if (validateInt(state)) {
            var currentState = "closed";
            state = parseInt(state);
            if (currentLevel < state) {
                currentState = "open";
            }
            rows[index].state = currentState;
        }
        if ((rows[index].children != undefined) && (rows[index].children.length > 0)) {
            addState(rows[index].children, currentLevel + 1, state);
        } else {
            rows[index].state = "open";
        }
    }
    return rows;


    function validateInt(obj) {
        var reg = /^[-+]?\d+(\.\d+)?$/;
        return reg.test(obj);
    }
}

function convertToTreeData(data, idField, nameField, childrenField, boundCallback, curentLevel, levelLimit, parent) {
    levelLimit = levelLimit >= 0 ? levelLimit : null;
    curentLevel = curentLevel;
    if (data) {
        data = $.isArray(data) ? data : [data];
        var nodes = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var id = "", text = "";
            if ($.isArray(idField)) {
                for (var n = 0; n < idField.length; n++) {
                    if (row[idField[n]]) {
                        id = row[idField[n]];
                        break;
                    }
                }
            }
            else {
                id = row[idField];
            }
            if (!id) {
                id = $.newGuid();
            }
            if ($.isArray(nameField)) {
                for (var n = 0; n < nameField.length; n++) {
                    if (row[nameField[n]]) {
                        text = row[nameField[n]];
                        break;
                    }
                }
            }
            else {
                text = row[nameField];
            }
            if (!text) {
                text = "";
            }
            var node = { "id": id, "text": text, attributes: row };
            if ($.isFunction(boundCallback)) {
                if (boundCallback(node, row, parent, curentLevel) != false) {
                    nodes.push(node);
                }
            }
            else {
                nodes.push(node);
            }
            var mark = true;
            var level = curentLevel + 1;

            if (levelLimit != null) {
                if (level > levelLimit) {
                    mark = false;
                    var children = row[childrenField];
                    if (children && children.length > 0) {
                        node.state = "closed";
                    }
                }
            }
            if (mark) {
                var children = null;
                if ($.isArray(childrenField)) {
                    for (var a = 0; a < childrenField.length; a++) {
                        if (row[childrenField[a]]) {
                            children = row[childrenField[a]];
                            break;
                        }
                    }
                }
                else {
                    children = row[childrenField];
                }
                if (children && children.length > 0) {
                    var childrenNodes = convertToTreeData(children, idField, nameField, childrenField, boundCallback, level, levelLimit, row);
                    if (childrenNodes) {
                        node.children = childrenNodes;
                    }
                }
            }
        }
        return nodes;
    }
    return null;
}


function disable(index) {
    $("a.easyui-linkbutton").each(function (_index) {
        if (index.indexOf(_index) != -1) {
            $(this).linkbutton('disable');
        } else {
            $(this).linkbutton('enable');
        }
    });
}
function showButton(index) {
    $("a.easyui-linkbutton").each(function (_index) {
        if (index.indexOf(_index) != -1) {
            $(this).show();
        }
    });
}
function linkButtonsDisable(buttonsName, panel) {
    panel.find("a.easyui-linkbutton").each(function () {
        var button = $(this);
        var text = button.find(".l-btn-text");
        if ($.inArray(text.text(), buttonsName) >= 0) {
            button.linkbutton('disable');
        }
        else {
            button.linkbutton('enable');
        }
    });
}
function linkButtonsHidden(buttonsName, panel) {
    panel.find("a.easyui-linkbutton").each(function () {
        var button = $(this);
        var text = button.find(".l-btn-text");
        if ($.inArray(text.text(), buttonsName) >= 0) {
            button.hide();
        }
        else {
            button.show();
        }
    });
    
    panel.find("a.easyui-menubutton").each(function () {
        var button = $(this);
        var options = button.linkbutton("options");
        var menu = options.menu;
        var items = $(menu).find(".menu-item");
        
        for(var i=0;i<items.length;i++){
            var item = $(items[i]);
            if ($.inArray(item.text(), buttonsName) >= 0) {
                item.hide();
            }
            else {
                item.show();
            }
        }
    });
    
}
function toolbarsDisable(buttonsName, datagrid) {
    var panel = datagrid ? datagrid.datagrid("getPanel") : null;
    var el = panel || $(document);
    var toolbar = el.find(".datagrid-toolbar");
    var buttons = toolbar.find(".l-btn");
    buttons.each(function (_index) {
        var button = $(this);
        var text = button.find(".l-btn-text");
        if ($.inArray(text.text(), buttonsName) >= 0) {
            button.linkbutton('disable');
        }
        else {
            button.linkbutton('enable');
        }
    });
}

//提交请求
function createRequest(path, content, requestformat, responseformat, options, expro, enCode) {
    requestformat = requestformat || 'JSON';
    responseformat = responseformat || 'JSON';
    content = content || '';
    options = options || {};
    var d = content;
    var b = "";
    var isCache = false;
    var isHead = true;
    if (options) {
        if (typeof (options) == "object") {
            isCache = options.isCache || false;
            isHead = options.isHead != false ? true : false;
        }
        else {
            isCache = true;
        }
    }
    if (isCache) {
        b = "<Cache type='MEMORY' period='6000000000000'></Cache>";
    }

    if (typeof (content) == "string" && content.indexOf("<Data>") < 0) {
        if (enCode != false) {
            if (requestformat == "JSON") {
                var data = $("<Data></Data>").text(content);
                content = data.html();
            }
            var bb = "";
        }
        d = "<Data>" + content + "</Data>";
    }

    expro = expro ? 'exinfo="' + expro + '" ' : '';
    var name = options.name || "";

    var request = '<Request ' + (name ? 'name="' + name + '"' : "") + ' action="' + path + '" request="' + requestformat + '" response="' + responseformat + '" ' + (!isHead ? 'nohead="true"' : '') + expro + '>' + b + d + '</Request>';
    if (options.base64 != false) {
        return (new Base64()).encode(request);
    }
    else {
        return request;
    }
}

function openConfirm(context, callback, title, win, callback1) {
    var body = $("body");
    title = title || "提示信息";
    win = win || window.self;
    win.$.messager.confirm(title, context, function (r) {
        if (r) {
            if (callback) {
                callback();
            }
        }
        if (callback1) {
            callback1(r);
        }
    });
}
function openAlert(context, callback, title, win) {
    var body = $("body");
    title = title || "提示信息";
    win = win || window.self;
    win.$.messager.alert(title, context, "", function () {
        if (callback) {
            callback();
        }
    });
}

//打开对话框
// width:宽度
// height:高度
// top：y轴位置
// left:x轴位置
// iconCls：图标
// title：文字
// url：地址
//dialogMaxabled:是否可以最大化
//isClose:是否显示关闭按钮
// isFrame:是否以FRAME加载
// contentHtml 对话框内容
// overflow:是否有滚动条
// buttons：按钮
// cancelButton：是否有取消按钮
// close：关闭对话框的执行事件
// dialogArgs:参数
function OpenDialog(option) {
    var w = option.width;
    var h = option.height;
    var top = option.top || 0;
    var left = option.left || 0;
    var iconCls = option.iconCls;
    var title = option.title;
    var url = option.url || "";
    var minimizable = option.minimizable || false;
    var maximizable = option.maximizable || false;
    var isFrame = option.isFrame;
    var contentHtml = option.contentHtml || "";
    var overflow = option.overflow || false;
    var buttons = option.buttons || [];
    var padding = isNaN(option.padding) ? 4 : option.padding;
    var cancelButton = option.cancelButton;
    var isClose = option.isClose != false ? true : false;
    var close = option.close;
    var dialogArgs = option.dialogArgs;
    var dialogArgs2 = option.dialogArgs2;
    var dialogArgs3 = option.dialogArgs3;
    var windowLevel = option.windowLevel;
    var opener = option.opener || window.self;
    var modal = option.modal == false ? false : true;
    var resizable = option.resizable == false ? false : true;
    var maximized = option.maximized;
    var draggable = option.draggable;
    var scroll = option.scroll || "no";
    //var dialog = $("#divDialog");
    //if (dialog.length <= 0) {
    //    var win = window.self;
    //    if (windowLevel) {
    //        win = window[windowLevel];
    //    }
    var body = $("body");
    var dialog = $("<div dialog='1' style='overflow-y:" + (overflow ? "auto" : "hidden") + "' />").appendTo(body);
    //}
    if (cancelButton != false) {
        buttons.push({
            text: '取  消',
            iconCls: 'icon-cancel',
            handler: function () {
                dialog.dialog("close");
            }
        });
    }
    var options = {
        title: title,
        iconCls: iconCls,
        width: w,
        height: h,
        modal: modal,
        inline: true,
        //border:false,
        resizable: resizable,
        maximizable: maximizable,
        minimizable: minimizable,
        maximized: maximized,
        draggable: draggable,
        closable: isClose,
        overflow: overflow,
        shadow: false,
        "onMove": function (left, top) {
            var l = left, t = top;
            var p = dialog.dialog("panel");
            //console.log("b")
            var mark = false;
            if (left < 0) {
                mark = true;
                l = 0;
            }
            else if ((left + p.outerWidth()) > $(window).width()) {
            }
            if (top < 0) {
                mark = true;
                t = 0;
            }
            else if ((top + p.outerHeight()) > $(window).height()) {
            }
            if (mark) {
                dialog.dialog("move", { left: l, top: t });
                return;
            }
        },
        onBeforeOpen: function () {
            var content = dialog.find(".dialog-content");
            if (content.length <= 0) {
                content = dialog;
            }
            if (!isFrame) {
                if (url != "") {
                    content.load(url);
                    dialog.data("args", dialogArgs);
                }
                else if (contentHtml != "") {
                    content.html(contentHtml);
                }
            }
            else {
                content.html("");
                var frame = $("<iframe frameborder='0' scrolling='" + scroll + "' width='100%' height='100%' src='" + url + "'></iframe>").appendTo(content);

                frame.attr("src", url);
                //frame.data("dialogArgs", dialogArgs);
                frame.get(0).dialogArgs = dialogArgs;
                frame.get(0).dialogArgs2 = dialogArgs2;
                frame.get(0).dialogArgs3 = dialogArgs3;
                frame.get(0).closeDialog = function () { dialog.dialog("close") };
                frame.get(0).opener = opener;
                var win = frame.get(0).contentWindow;
                if (win) {
                    try {
                        win.dialogArgs = dialogArgs;
                    }
                    catch (ex) { }
                }
            }
        },
        onOpen: function () {
            if ($.isFunction(option.open)) {
                option.open();
            }
        },
        onBeforeClose: function () {
            var content = dialog.find(".dialog-content");
            if ($.isFunction(option.close)) {
                option.close();
            }
            content.html("");
        },
        onClose: function () {
            dialog.dialog("destroy");
        }
    }
    if (option.top) {
        options.top = option.top;
    }
    if (option.left) {
        options.left = option.left;
    }
    if (buttons.length > 0) {
        options.buttons = buttons;
    }
    else {
        options.buttons = null;
    }
    dialog.dialog(options);
    return dialog;
}
function CloseDialog(obj) {
    var dialog = null
    if (obj.hasClass("l-btn")) {
        var el = obj.parent();
        while (el.length > 0) {
            if (el.attr("dialog") == "1") {
                dialog = el;
                break;
            }
            else {
                el = el.parent();
            }
        }
    }
    else if (el.attr("dialog") == "1") {
        dialog = obj;
    }
    dialog.dialog("close");
}

//写入调试日志
function writeLog() {
    if (window.console && console.log) {
        var args = Array.prototype.slice.call(arguments);
        console.log(args);
    }
}
function writeTimeLog(msg) {
    if (window.console && console.log) {
        //var args = Array.prototype.slice.call(arguments);
        var args = Array.prototype.slice.call(arguments);
        args.push((new Date()).format("yyyy-MM-dd hh:mm:ss"));
        //alert()
        console.log(args);
    }
}
function postRequestGroup(requestStr, async, callback, responseFormat, requestFormat) {
    var data = null;
    async = async || false;
    requestFormat = requestFormat || "JSON";
    responseFormat = responseFormat || "JSON";
    $.ajax({
        url: __GlobalInfo.postUrl,
        dataType: "json",
        type: "POST",
        async: async,
        data: requestStr,
        success: function (response) {
            var result = {} // response.Result
            for (var k in response) {
                if (response[k].Result.Success) {
                    result[k] = response[k].Result.Data;
                }
            }
            if (callback) {
                callback(result);
            }
            data = result;
        },
        error: function (xmlhttp) {
            //alert("格式错误")
        }
    });
    return data;
}
/**
 * @param obj  向XML传递的参数 JSON对象
 * @param url  XML的相对路径
 * @param async 是否异步请求 默认为同步
 * @param callback XML执行成功后的回调方法
 * @param requestFormat 请求的连接串类型  默认为JSON  可选 XML
 * @param responseFormat    返回的结果类型  默认为JSON  可选 XML
 * @param options  JSON格式
 * 是否为缓存，默认否 isCache || false;
 * isHead != false ? true : false;
 * @param expro
 * @param enCode
 * @return {null}
 */
function getServerData(obj, url, async, callback, requestFormat, responseFormat, options, expro, enCode) {
    async = async || false;
    var context = obj;
    requestFormat = requestFormat || "JSON";
    responseFormat = responseFormat || "JSON";
    if (requestFormat.toLowerCase() == "json" && obj) {
        context = JSON.stringify(obj);
    }
    var requestStr = createRequest(url, context, requestFormat, responseFormat, options, expro, enCode);
    var data = null, error = null;
    $.ajax({
        url: __GlobalInfo.postUrl,
        dataType: "json",
        type: "POST",
        async: async,
        data: requestStr,
        success: function (response) {
            var result = null;
            if (responseFormat == "FORMAT") {
                data = response;
            }
            else {
                result = response.Result;
                if (result.Success) {
                    if (callback) {
                        callback(result.Data);
                    }
                    data = result.Data;
                }
                else {
                    if(obj.FileErrShow){
                        if (openAlert) {
                            openAlert(result.Data);
                        }
                        else {
                            alert(result.Data);
                        }
                    }
                    error = result.Data;
                }
            }
        },
        error: function (xmlhttp) {
            error = "请求出错";
        }
    });
    if (error) {
        throw error;
    }
    else {
        return data;
    }
}

//获取服务器数据

function CSR(options) {
    options = $.extend({ "requestFormat": "JSON", "responseFormat": "JSON", "expro": "", "enCode": true }, (options || {}));
    function ajax(options) {
        var self = this;
        var expro = options.expro;
        var enCode = options.enCode;
        var requestFormat = options.requestFormat || "JSON";
        var responseFormat = options.responseFormat || "JSON";
        var args = null;

        this.dtds = [];
        this.resultMapping = {};
        var isFirst = true;
        this.request = function (obj, url, async) {
            async = async == false ? false : true;
            if (isFirst) {
                isFirst = false;
                var dtd = $.Deferred();
                self.dtds.push(dtd);
                request(obj, url, async, self.dtds.length - 1, "requestData");
            }
            else {
                self.done(function (data, csr, dtd) {
                    var dtd = $.Deferred();
                    self.dtds.push(dtd);
                    request(obj, url, async, self.dtds.length - 1, "requestData");
                });
            }
            return self;
        }
        this.post = function (obj, url, async) {
            async = async == false ? false : true;
            if (isFirst) {
                isFirst = false;
                var dtd = $.Deferred();
                self.dtds.push(dtd);
                request(obj, url, async, self.dtds.length - 1, "postData");
            }
            else {
                self.done(function (data, csr, dtd) {
                    var dtd = $.Deferred();
                    self.dtds.push(dtd);
                    request(obj, url, async, self.dtds.length - 1, "postData");
                });
            }
            return self;
        }
        var request = function (obj, url, async, dtdIndex, type) {
            if (requestFormat.toLowerCase() == "json" && obj) {
                context = JSON.stringify(obj);
            }
            else {
                context = obj;
            }
            var requestStr = createRequest(url, context, requestFormat, responseFormat, options, expro, enCode);
            $.ajax({
                url: __GlobalInfo.postUrl,
                dataType: "json",
                type: "POST",
                async: async,
                //timeout: 20000,
                success: function (response) {
                    if (type == "requestData") {
                        var result = null;
                        if (responseFormat == "FORMAT") {
                            data = response;
                        }
                        else {
                            result = response.Result;
                            if (result.Success) {
                                self.dtds[dtdIndex].resolve(result.Data, self, self.dtds[dtdIndex]);
                            }
                            else {
                                self.dtds[dtdIndex].reject(result, self, self.dtds[dtdIndex]);
                            }
                        }
                    }
                    else if (type == "postData") {
                        var result = response.Result;
                        if (result.Success) {
                            self.dtds[dtdIndex].resolve(result.Success, self, self.dtds[dtdIndex]);
                        }
                        else {
                            self.dtds[dtdIndex].reject(result.Success, self, self.dtds[dtdIndex]);
                        }
                    }
                },
                data: requestStr,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (XMLHttpRequest.status == "404") {
                        self.dtds[dtdIndex].reject("404", self, self.dtds[dtdIndex]);
                    }
                    else {
                        self.dtds[dtdIndex].reject("502", self, self.dtds[dtdIndex]);
                    }
                },
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        self.dtds[dtdIndex].reject("timeout", self, self.dtds[dtdIndex])
                    }
                }
            });
        }

        this.done = function (callback) {
            if (callback && this.dtds[this.dtds.length - 1]) {
                this.dtds[this.dtds.length - 1].done(callback);
            }
            return self;
        }
        this.fail = function (callback) {
            if (callback && this.dtds[this.dtds.length - 1]) {
                this.dtds[this.dtds.length - 1].fail(callback)
            }
            return self;
        }
        this.always = function (callback) {
            if (callback && this.dtds[this.dtds.length - 1]) {
                this.dtds[this.dtds.length - 1].always(callback)
            }
            return self;
        }
    }
    return new ajax(options);
}

//提交数据到服务器
function postServer(obj, url, async, requestFormat, responseFormat) {
    async = async || false;
    var context = obj;
    requestFormat = requestFormat || "JSON";
    responseFormat = responseFormat || "JSON";
    if (requestFormat.toLowerCase() == "json" && obj) {
        context = JSON.stringify(obj);
    }
    var requestStr = createRequest(url, context, requestFormat, responseFormat);
    var success = false;
    $.ajax({
        url: __GlobalInfo.postUrl,
        dataType: "json",
        type: "POST",
        async: async,
        data: requestStr,
        success: function (response) {
            var result = response.Result;
            if (result.Success) {
                success = true;
            }
            else {
                success = false;
            }
        },
        error: function (xmlhttp) {
            success = false;
        }
    });
    return success;
}

//提交并返回数据
function postReturnData(obj, url, requestFormat, responseFormat) {
    var async = false
    var context = obj;
    requestFormat = requestFormat || "JSON";
    responseFormat = responseFormat || "JSON";
    if (requestFormat.toLowerCase() == "json" && obj) {
        context = JSON.stringify(obj);
    }
    var requestStr = createRequest(url, context, requestFormat, responseFormat);
    var data = null;
    $.ajax({
        url: __GlobalInfo.postUrl,
        dataType: "json",
        type: "POST",
        async: async,
        data: requestStr,
        success: function (response) {
            var result = response.Result;
            if (result.Success) {
                if (result.Data) {
                    data = result.Data;
                }
                else {
                    data = result.Success;
                }
            }
            else {
                alert("出现错误");
            }
        },
        error: function (xmlhttp) {
        }
    });
    return data;
}

//解析数据
function analysisData(data, isFilterEmpty) {
    var getSplit = function (rows) {
        var number = [0, 0, 0];
        var splits = ["\t", ",", " "];
        for (var index = 0; index < 10; index++) {
            if (index >= rows.length) {
                break;
            }
            var d = $.trim(rows[index]);
            if (d != "") {
                for (var num in splits) {
                    if (d.indexOf(splits[num]) > -1) {
                        number[num] = number[num] + 1;
                    }
                }
            }
        }
        var num = 0;
        var value = number[0];
        for (var index = 0; index < number.length - 1; index++) {
            if (value < number[index + 1]) {
                num = (index + 1);
                value = number[index + 1];
            }
        }
        return splits[num];
    };
    var rows = [];
    if (data.length == 0) {
        return rows;
    }
    //获取每行数据
    var _rows = data.split('\n');
    if (_rows.length == 0) {
        return rows;
    }
    var split = getSplit(_rows);
    for (var index = 0; index < _rows.length; index++) {
        if (isFilterEmpty != false) {
            if (_rows[index] == "") {
                continue;
            }
        }
        rows.push(_rows[index].split(split));
    }
    return rows;
}

function analyzeTableCopyData(data) {
    var rows = [];
    if (data.length == 0) {
        return rows;
    }
    //获取每行数据
    var _rows = data.split('\n');
    if (_rows.length == 0) {
        return rows;
    }
    for (var i = 0; i < _rows.length; i++) {
        if (_rows[i] == "") {
            continue;
        }
        var reg = /\s|\t|,/g;
        var d = _rows[i].split(reg);
        rows.push(d);
    }
    return rows;
}

function layoutResize(layout) {
    layout = layout || $("body");
    $("body").layout("resize");
}

function layoutChildResize(layout, region, el) {
    var el = !$.isArray(el) ? [el] : el;
    var panel = layout.layout("panel", region);
    panel.panel({
        "onResize": function () {
            for (var i = 0; i < el.length; i++) {
                var e = el[i];
                e.width(panel.innerWidth()).height(panel.innerHeight());
                if ($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")) {
                    if (e.get(0).id) {
                        var win = document.frames[e.get(0).id];
                        if (win) {
                            if (win.layoutResize) {
                                win.layoutResize();
                            }
                        }
                    }
                }
            }
        }
    });
    layout.layout("resize");
}

//过滤TREE数据
function filterTree(node, callback, pnode, folderMatch) {
    var n = $.extend(true, {}, node);
    var children = node.children;
    if (children && children.length > 0) {
        var mark = false;
        n.children = [];
        if (callback) {
            mark = callback(n, pnode);
        }
        if (mark) {
            if (folderMatch) {
                n.children = children;
            }
            else {
                for (var i = 0; i < children.length; i++) {
                    var v = children[i];
                    var result = filterTree(v, callback, node, folderMatch);
                    if (result) {
                        n.children = n.children || [];
                        n.children.push(result);
                        mark = true;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < children.length; i++) {
                var v = children[i];
                var result = filterTree(v, callback, node, folderMatch);
                if (result) {
                    n.children = n.children || [];
                    n.children.push(result);
                    mark = true;
                }
            }
        }
        if (mark) {
            return n;
        }
    }
    else {
        if (callback) {
            if (callback(n, pnode)) {
                return n;
            }
        }
    }
}

//检索树结构数据
function queryTreeData(text, node, tree) {
    var n = $.extend(true, {}, node);
    if (n.text.indexOf(text) >= 0) {
        return n;
    }
    else {
        n.children = [];
        var children = node.children;
        var mark = false;
        if (children && children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                var v = children[i];
                var result = queryTreeData(text, v, n, tree);
                if (result) {
                    n.children.push(result);
                    mark = true;
                }
            }
        }
        if (mark) {
            return n;
        }
        else {
            return null;
        }
    }
}

//清空所有树控件节点选中状态
function allTreeNodeUnChecked(tree) {
    var root = tree.tree("getRoots");
    $.loop(root, function (v, i) {
        tree.tree("uncheck", v.target);
        var nodes = tree.tree("getChildren", v.target);
        $.loop(nodes, function (v, i) {
            if (v.checked) {
                tree.tree("uncheck", v.target);
            }
        });
    });
}

//执行FRAME中的方法
function execFrameFunction(frame, fnname, args) {
    if (frame instanceof jQuery || frame.jquery) {
        frame = frame.get(0);
    }
    var win = frame.contentWindow;
    if ($.isFunction(win[fnname])) {
        args = args || [];
        args = $.isArray(args) ? args : [args];
        return win[fnname].apply(null, args);
    }
}

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

Date.prototype.isValid = function (year, month, day) {
    var mdays = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if ((year == "") || (month == "") || (day == "")) {
        return false;
    }
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false;
    }
    if (parseInt(month) > 12 || parseInt(month) < 1) {
        return false;
    }
    if (parseInt(day) < 1 || parseInt(day) > mdays[month - 1]) {
        return false;
    }
    //是否是闰年
    if (!(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))) {
        if ((month == 2) && (day > 28)) {
            return false;
        }
    }
    return true;
}


Date.prototype.getMonthWeek = function () {
    var offset = this.getDay();
    if (offset == 0) {
        offset = -6;
    }
    else {
        offset = (offset - 1) * -1;
    }
    sd = new Date(this.getFullYear(), this.getMonth(), this.getDate() + offset);
    ed = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate() + 6);
    return Math.ceil(parseInt(ed.format("dd")) / 7);
};

String.prototype.endWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substring(this.length - s.length) == s)
        return true;
    else
        return false;
    return true;
}

String.prototype.startWith = function (s) {
    if (s == null || s == "" || this.length == 0 || s.length > this.length)
        return false;
    if (this.substr(0, s.length) == s)
        return true;
    else
        return false;
    return true;
}

String.prototype.formatForXml = function () {
    return this.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/(^\s+)|(\s+$)/g, "");
    }
}

String.prototype.formatForXml = function () {
    return this.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
}

$.formatForXml = function (params) {
    if (typeof (params) == "string") {
        params = params.formatForXml();
    } else {
        for (var key in params) {
            if (typeof (params[key]) == "string") {
                params[key] = params[key].formatForXml();
            }
        }
    }
    return params;
}

$.formatUserName = function (name) {
    return name;
    //    if (typeof (name) != "undefined" && name.length > 0) {
    //        return "*" + name.substring(1);
    //    }
    //    return "";
}

//重写toFixed方法
Number.prototype.toFixed = function (len) {
    len = len ? len : 0;
    var t = Math.pow(10, len);
    var num = this * t;
    num = Math.round(num) / t;
    num = num.toString();
    var i = num.indexOf(".");
    var l = len;
    var temp = "";
    if (i >= 0) {
        temp = num.substr(i + 1);
    }
    else {
        if (l > 0) {
            num += ".";
            temp = "";
        }
    }
    l = l - temp.length;
    for (var n = 0; n < l; n++) {
        num += "0";
    }
    return num;
}

//两数字相除
Number.prototype.accDiv = function (arg2) {
    var arg1 = this;
    var t1 = 0, t2 = 0, r1, r2;
    var numstr1 = scienceNum(arg1.toString());
    var numstr2 = scienceNum(arg2.toString());
    try { t1 = numstr1.toString().split(".")[1].length } catch (e) { }
    try { t2 = numstr2.toString().split(".")[1].length } catch (e) { }
    with (Math) {
        var num1 = new Number(arg1.toString());
        var num2 = new Number(arg2.toString());
        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * pow(10, t2 - t1);
    }
}
//两数字相乘
Number.prototype.accMul = function (arg2) {
    var arg1 = this;
    var m = 0
    var s1 = arg1.toString();
    var s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

function scienceNum(value) {
    var num = 0;
    if ((num = value.indexOf('E')) != -1 || (num = value.indexOf('e')) != -1) {
        var doubleStr = value.substring(0, num);
        var eStr = value.substring(num + 1, value.length);
        eStr = parseInt(eStr);
        if (eStr < 0) {
            var doubleStrList = doubleStr.split('.');
            var doubleStr1 = doubleStrList[0];
            var doubleStr2 = doubleStrList[1] || "";
            var length = Math.abs(eStr) - doubleStr1;
            var str = "";
            for (var i = 0; i < length; i++) {
                str += '0';
            }
            doubleStr = "0." + str + doubleStr;
            value = doubleStr;
        }
        //千分位
    }
    return value;
}

$.fn.serializeToObject = function () {
    var ctls = $("#form1").find("*[name]:disabled");
    ctls.removeAttr("disabled");
    var array = this.find("*[name]").serializeArray();
    ctls.attr("disabled", "disabled");
    var obj = {};
    for (var i = 0; i < array.length; i++) {
        obj[array[i].name] = array[i].value;
    }
    return obj;
}


//获取当前页码起始编号和末尾编号
$.getMinToMaxByPageNumber = function (pageNumber, pageSize) {
    var p = pageNumber - 1;
    var min = p * pageSize + 1;
    var max = min + pageSize - 1;
    return { "min": min, "max": max };
}


$.loadXml = function (initXmlPath) {
    var xml = "";
    $.ajax({
        "url": initXmlPath,
        "type": "GET",
        "dataType": "text",
        "async": false,
        "success": function (result) {
            xml = result;
        }
    });
    return xml;
}

var __htmlEncodeElement = null;
function htmlEnCode(html) {
    //if (!__htmlEncodeElement) {
    //    __htmlEncodeElement = $("<DATA></DATA>");
    //}
    //__htmlEncodeElement.html("");
    //text = text || "";
    //__htmlEncodeElement.text(text);
    //var html = __htmlEncodeElement.html();
    //var reg = /["]/g;
    //html = html.replace(reg, "&quot;");

    //return html;
    var temp = document.createElement("div");
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;

}

function htmlDeCode(text) {
    //if (!__htmlEncodeElement) {
    //    __htmlEncodeElement = $("<DATA></DATA>");
    //}
    //__htmlEncodeElement.html("");
    //text = text || "";
    //__htmlEncodeElement.html(text);
    //var text = __htmlEncodeElement.text();
    //return text;

    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;

}

function objectToXml(obj, tagName, AttributePrefix) {
    var xml = "";
    var beginTag = "<" + tagName + "{0}>";
    var property = [];
    var innerText = "";
    for (var k in obj) {
        try {
            if (k == "text") {
                if (obj[k]) {
                    var text = obj[k];
                    if (typeof (text) == "object") {
                        text = JSON.stringify(obj[k]);
                    }
                    innerText = "<![CDATA[" + text + "]]>";
                }
            }
            else {
                if (obj[k] && typeof (obj[k]) == "object") {
                    if (obj[k].jquery || $.isFunction(obj[k])) {
                        continue;
                    }
                    if ($.isArray(obj[k])) {
                        for (var i = 0; i < obj[k].length; i++) {
                            xml += objectToXml(obj[k][i], k);
                        }
                    }
                    else {
                        xml += objectToXml(obj[k], k, AttributePrefix);
                    }
                }
                else {
                    var n = k;
                    if (AttributePrefix) {
                        if (n.indexOf(AttributePrefix) == 0) {
                            n = n.replace(AttributePrefix, "");
                        }
                    }
                    var t = htmlEnCode(obj[k]);
                    var reg = /["]/g;
                    t = t.replace(reg, "&quot;");
                    property.push(n + "=\"" + (t || "") + "\"");
                }
            }
        }
        catch (ex) {
            writeLog(k + "转换错误");
            continue;
        }
    }
    var p = property.length > 0 ? " " + (property.join(" ")) : "";
    beginTag = beginTag.replace(/\{\d+\}/, p);
    var endTag = "</" + tagName + ">";
    xml = beginTag + innerText + xml + endTag;
    return xml;
}

function xmlToObject(xml, AttributePrefix) {
    //xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + xml;
    var obj = {};
    var xmldoc = $.parseXML(xml);
    xmldoc = $(xmldoc);
    var root = xmldoc.children();
    var rootName = "";
    for (var i = 0; i < root.length; i++) {
        var n = root[i];
        rootName = n.tagName;
        fn(n, obj);
    }
    function fn(node, curObject) {
        if (node.nodeType == 8) {
            return;
        }
        var tag = node.tagName;
        var nobj = null;
        if (!curObject[tag]) {
            curObject[tag] = nobj = {};
        }
        else {
            if (!$.isArray(curObject[tag])) {
                curObject[tag] = [curObject[tag]];
            }
            nobj = {};
            curObject[tag].push(nobj);
        }
        if (node.attributes.length <= 0 && !node.hasChildNodes()) {
            if ($.isArray(curObject[tag])) {
                curObject[tag][curObject[tag].length - 1] = "";
            }
            else {
                curObject[tag] = "";
            }
        }
        else {
            var attributes = node.attributes;
            for (var i = 0; i < attributes.length; i++) {
                var attr = attributes[i];
                var name = AttributePrefix ? AttributePrefix + attr.name : attr.name;
                var value = attr.nodeValue;
                if (attr.nodeValue == "false") {
                    value = false;
                }
                else if (attr.nodeValue == "true") {
                    value = true;
                }
                else {
                    value = attr.nodeValue;
                }
                nobj[attr.name] = value;
            }
            if (node.hasChildNodes()) {
                var children = node.childNodes;
                for (var i = 0; i < children.length; i++) {
                    var c = children[i];
                    if (c.nodeType == 3) {
                        if ($.trim(c.wholeText || c.text || c.nodeValue)) {
                            nobj.text = $.trim(c.wholeText || c.text || c.nodeValue);
                        }
                    }
                    else if (c.nodeType == 4) {
                        if ($.trim(c.wholeText || c.text || c.nodeValue)) {
                            nobj.text = $.trim(c.wholeText || c.text || c.nodeValue);
                        }
                    }
                    else {
                        fn(c, nobj);
                    }
                }
            }
        }
    }
    return obj[rootName];
}


function getXmlObj(path) {
    var obj=getServerData({"path":path},"admin_client/office/xml/module/getJSONOfXmlFile.xml").Result || {};
    for(var key in obj) {
        return obj[key];
    }
    return {};
}

var _GLOBAL_XML_CONTENT = {};

function getServerXML(path) {
    //    if (_GLOBAL_XML_CONTENT[path]) return _GLOBAL_XML_CONTENT[path];
    var result = getServerData({ "path": path }, "admin_client/office/xml/module/getXmlContent.xml", false, null, "", "", { "isCache": false }).Result || "";
    if (result) {
        result = new Base64().decode(result);
    }
    _GLOBAL_XML_CONTENT[path] = result;
    return result;
}

function arithmetic(arg1, operator, arg2) {
    var r1, r2, n, mul, size;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    size = Math.max(r1, r2);
    switch (operator) {
        case "+":
        case "-":
            mul = size;
            break;
        case "*":
            mul = 2 * size;
            break;
        case "/":
            mul = 0;
            break;
    }
    //动态控制精度长度  
    n = (r1 >= r2) ? r1 : r2;
    return (eval((arg1 * Math.pow(10, size)) + operator + (arg2 * Math.pow(10, size))) / Math.pow(10, mul)).toFixed(n);
}


//获取SQLWHERE 条件
function createWhereSqlPart(item) {
    function getValue(item) {
        var operator = item.operator;
        var s = "";
        var vs = [];
        var itemvalue = $.isArray(item.value) ? item.value : [item.value];
        if (item.attributes.type == "数字") {
            $.loop(itemvalue, function (v, i) {
                vs.push(v);
            });
        }
        else if (item.attributes.type == "日期") {
            $.loop(itemvalue, function (v, i) {
                vs.push("TO_DATE('" + v + "','yyyy-mm-dd')");
            });
        }
        else {
            $.loop(itemvalue, function (v, i) {
                vs.push("'" + v + "'");
            });
        }
        if (operator == "IN" || operator == "NOT IN") {
            s = item.attributes.table.alias + "." + item.attributes.fieldName + " " + item.operator + " (" + vs.join(",") + ")";
        }
        else if (operator == "IS" || operator == "IS NOT") {
            s = item.attributes.table.alias + "." + item.attributes.fieldName + " " + item.operator + "NULL";
        }
        else if (operator == "BETWEEN") {
            s = item.attributes.table.alias + "." + item.attributes.fieldName + " " + item.operator + " " + vs.join(" AND ");
        }
        else if (operator == "LIKE") {
            s = item.attributes.table.alias + "." + item.attributes.fieldName + " " + item.operator + " '%'||" + vs.join() + "||'%'";
        }
        else {
            s = item.attributes.table.alias + "." + item.attributes.fieldName + item.operator + vs.join();
        }
        return s;
    }
    return getValue(item);
}
function initEasyUiValidatebox() {
    $.extend($.fn.validatebox.defaults.rules, {
        indicatorcode: {
            // 省份证号和市民卡号混合验证        
            validator: function (value) {
                if (value.length != 6) {
                    return false;
                } else {
                    return /^[0-9]+$/i.test(value);
                }
            },
            message: '编码长度不正确'
        }
    });
}

/**
* 获取资源文件常量配制信息 参数名必须全部大写字每，比如 (TJZD)统计制度模块
* @param moduleName 
*/
function getResource(moduleName) {
    var resultObj = getXmlObj("config/dsf.xml");
    var webName = null;
    if (resultObj.Application.ApplicationName) {
        webName = resultObj.Application.ApplicationName.value;
    } else {
        webName = "DefaultResource";
    }
    var resources = getXmlObj("config/resource.xml");
    var resource = null;
    if (resources[webName] && resources[webName][moduleName]) {
        resource = resources[webName][moduleName];
    } else {
        resource = resources["DefaultResource"][moduleName];
    }
    return resource;
}

/**
 * 获取当前服务器时间
 * @param format 参数为空默认返回当前毫秒值
 */
function getServerTime(format) {
    if (!format) {
        format = "";
    }
    var result = getServerData({ FORMAT: format }, "admin_client/tools/module/javagetservertime.xml");
    return result.TIME;
}

function fillSelect(jq, data, keyfield, valuefield) {
    keyfield = keyfield || 'id';
    valuefield = valuefield || 'text';
    $.each(data, function (i, v) {
        jq.append("<option value='" + v[keyfield] + "'>" + v[valuefield] + "</option>");
    });
}


function Base64() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        if (input == null) return null;

        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        if (input == null) return null;
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
/**
 * yangf
 * @param oldTableName
 * @param newTableName
 * @param isData y/n (是或否)
 */
function cloneTable(oldTableName, newTableName, isData) {
    var data = getServerData({
        "newTableName": newTableName,
        "sqltype": "ifExit"
    }, "admin_client/tools/module/clonetable.xml");
    if (data && data.children.length) {
        if (data.children[0].TABLE_COUNT == 0) {
            //not exit
            var flag = postServer({
                "sqltype": "clone",
                "oldTableName": oldTableName,
                "newTableName": newTableName,
                "isData": (isData == "y") ? "1=1" : "1=2"
            }, "admin_client/tools/module/clonetable.xml");
            if (flag) {
                return true;
            }
        }
        else {
            return true;
        }
    }
    return false;
}

/**
 * yangf
 * @param tables
 * @return true/false
 */
function cloneTableBatch(tables) {
    var rs = true;
    //tables = [{ oldTableName: "", newTableName: "", isData: "y" }];
    for (var i = 0; i < tables.length; i++) {
        var oldTableName = tables[i].oldTableName;
        var newTableName = tables[i].newTableName;
        var isData = tables[i].isData;
        var b = cloneTable(oldTableName, newTableName, isData);
        if (!b) {
            rs = false;
            break;
        }
    }
    return rs;
}

/**
 * yangf
 * @param {Object} a(color)
 * @desc 获取颜色的反色 颜色必须为'#000000'格式
 */
function oppositeColor(a) {
    if (a) {
        a = a.replace('#', '');
        var c16, c10, max16 = 15, b = [];
        for (var i = 0; i < a.length; i++) {
            c16 = parseInt(a.charAt(i), 16);//  to 16进制
            c10 = parseInt(max16 - c16, 10);// 10进制计算
            b.push(c10.toString(16)); // to 16进制
        }
        return '#' + b.join('');
    }
}

/**
 * 获取统计制度数据库参数
 */
function getDBParamByClassId(classid) {
    var result = getServerData({ Id: classid }, "admin_client/frame/module/getcategorybyid.xml")
    if (result) {
        var dbid = result.Category.DbId;
        return getDBParamByDBId(dbid);
    }
}

/**
 * 获取DBID具体类型
 */
function getDBParamByDBId(dbid) {
    var config = getSystemConfig();
    var DBConnections = config.DBConnections.DBConnection;
    for (var i = 0; i < DBConnections.length; i++) {
        var d = DBConnections[i];
        if (d.name == dbid) {
            return { DB_Name: dbid, DB_User: d.user, DB_Type: d.type };
        }
    }
}

function IsImpala(classId) {
    var dbParam = getDBParamByClassId(classId);
    if (dbParam && dbParam.DB_Name) {
        var dbInfo = getDBParamByDBId(dbParam.DB_Name);
        if (dbInfo.DB_Type == "dreamdata") {
            return true;
        }
    }
    return false;
}

function getVMContent(path) {
    var resultStr = "";
    $.ajax({
        url: __GlobalInfo.webroot + "/" + path,
        data: { time: new Date().getTime() },
        dataType: "text",
        type: "POST",
        async: false,
        success: function (result) {
            resultStr = result;
        },
        "error": function (result) {
            alert(result);
        }
    })
    return resultStr;
}


function getHtmlOfTemplate(template, jsonData) {
    var matchs = template.match(/{\@\w+}/ig) || [];
    var keys = [];
    var result = template;
    for (var index = 0; index < matchs.length; index++) {
        var match = matchs[index].replace("{@", "").replace("}", "");
        if ($.inArray(match, keys) > -1) {
            continue;
        }
        var value = "";
        if (match.indexOf(".") != -1) {
            var t = match.split('.');
            value = jsonData[t[0]][t[1]];
        } else {
            value = jsonData[match];
        }
        result = result.replace(new RegExp(matchs[index].replace("@", "\\@"), "ig"), value);  //正则表达式关键字
        keys.push(match);
    }
    return result;
}


function bsdiaglog(oo) {
    var obj = {};
    obj.id = 'bsdialog';
    obj.isFrame = true;
    obj.src = '';
    obj.width = 300;
    obj.height = 300;
    obj.title = '';
    obj.top = 0;
    obj.left = 0;
    obj.dialogArgs = '';
    obj.contentHtml = '';
    obj.buttons = [];
    obj = oo || obj;
    if($('#'+obj.id).length<1)
        $('body').append('<div id="'+obj.id+'" class="modal fade"></div>')
    var result = getServerData({ "PATH": 'admin_client/questionnaire/design1/views/model/dialog.htm' }, "admin_client/questionnaire/module/getfile.xml", false);
    if (result && result.File) {
        $("#" + obj.id).html(result.File);
    } else
        return false;
    var iframe = null;
    if (obj.src) {

        iframe = $("#" + obj.id).find(".mainframe").attr({'src':obj.src,'id':'bsf'+obj.id,'name':'bsf'+obj.id});
        if (obj.isFrame) {
            if (obj.dialogArgs && $(".mainframe").get(0))
                $(".mainframe").get(0).dialogArgs = obj.dialogArgs;
        } else {
            $("#" + obj.id).find("#content").load(obj.src);
            if (obj.dialogArgs)
                $("#" + obj.id).find("#content").data('dialogArgs', obj.dialogArgs);
        }
    }
    if (obj.width > 0)
        $("#" + obj.id).find('.modal-dialog').width(obj.width);
    if (obj.height > 0) {
        $("#" + obj.id).find('.modal-content').height(obj.height);
        $("#" + obj.id).find('.modal-body').height((obj.height - 125));
    }

    if (obj.contentHtml) {
        $("#" + obj.id).find("#content").html(obj.contentHtml);
        $("#" + obj.id).find('.modal-body').height((obj.height - 135));
    }

    if (obj.top)
        $("#" + obj.id).find(".modal-content").css({ 'position': 'relative', 'top': obj.top });
    if (obj.left)
        $("#" + obj.id).find(".modal-content").css({ 'position': 'relative', 'left': obj.left });
    var ua = navigator.userAgent.toLowerCase();
    var s = ua.match(/msie ([\d.]+)/);
    if (s) {
        if (parseInt(s[1], 10) < 9) {
            $("#" + obj.id).find(".modal-dialog").css({ 'left': ($(window).width()-obj.width)/2+"px"});
        }
    }

    if (obj.title)
        $("#" + obj.id).find("#bstitle").html(obj.title);
    if (obj.buttons && obj.buttons.length > 0) {
        var btn = $("#" + obj.id).find('.modal-footer');
        $.each(obj.buttons, function (index, val) {
            var button = $('<button>')
            for (var key in val){
                if(key=='handler'){
                    button.on('click', {'iframe': iframe,outer:iframe.closest('.modal')}, val.handler);
                }else
                    button.attr(key, val[key]);
            }
            button.html(val.text);
            btn.prepend(button);
        });
    }
    if (obj.id)
        $("#" + obj.id).modal('show').css('display', 'block');
}

/**********************************************************************************************
代码长度：24位；代码格式（年份-地区-行业-项目类型-流水号）具体标准如下。
年份编码：4位数字、年份
地区编码：6位数字、建设地点编码
行业编码：2位、使用国家统计局二级国标行业
项目类型编码：（2位数字： 01审批、02核准、03备案、00规划）
流水号：（6位数字、每年起始编号重置为1）
如：2013-110101-01-01-123456等，对应的是2013年北京东城区审批的农业某项目，序号为123456号
**********************************************************************************************/
function getItemNo() {
    //年度编码
    var year = (new Date()).getFullYear();
    //地区编码
    var area = "110101";
    //行业编码
    var industry = "01";
    //项目类型编码
    var item = "01";
    //流水号
    var serialnumber = 1;
    var storage = window.localStorage;
    if (storage) {
        var num = parseInt(storage.getItem("BJ_XMBH"), 10);
        if (!isNaN(num)) {
            serialnumber = num;
            storage.setItem("BJ_XMBH", (num + 1));
        } else {
            storage.setItem("BJ_XMBH", 2);
        }
        serialnumber = (1000000 + serialnumber).toString().substr(1);
    } else {
        var serialnumber = "";
        for (var i = 0; i < 6; i++) {
            serialnumber += Math.floor(Math.random() * 10);
        }
    }
    return year + "-" + area + "-" + industry + "-" + item + "-" + serialnumber;
}

var $SYS_PROP = {
    get:function(key){
        var Info = getServerData({KEY:key},"admin_client/tools/module/getSysProp.xml").Info;
        return Info;
    },
    set:function(key,value){
        getServerData({KEY:key,VALUE:value},"admin_client/tools/module/saveSysProp.xml");
    }
}
