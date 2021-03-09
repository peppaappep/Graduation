if (!$.browser) {
    $.browser = {};
    $.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
    $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
}



if ($.fn.accordion) {
    if (!$.support.leadingWhitespace) {
        $.fn.accordion.defaults.animate = false;
    }
    //if ($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")) {
        
    //}
}
if ($.fn.tree) {
    //if ($.browser.msie && ($.browser.version == "6.0" || $.browser.version == "7.0")) {
    //    $.fn.tree.defaults.animate = false;
    //}
    if (!$.support.leadingWhitespace) {
        $.fn.accordion.defaults.animate = false;
    }
}
if ($.fn.pagination) {
    $.fn.pagination.defaults.beforePageText = '第';
    $.fn.pagination.defaults.afterPageText = '共{pages}页';
    $.fn.pagination.defaults.displayMsg = '显示{from}到{to},共{total}记录';
}
if ($.fn.datagrid) {
    $.fn.datagrid.defaults.loadMsg = '正在处理，请稍待。。。';
}
if ($.fn.treegrid && $.fn.datagrid) {
    $.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg;
}
if ($.messager) {
    $.messager.defaults.ok = '确定';
    $.messager.defaults.cancel = '取消';
}
if ($.fn.validatebox) {
    $.fn.validatebox.defaults.missingMessage = '该输入项为必输项';
    $.fn.validatebox.defaults.rules.email.message = '请输入有效的电子邮件地址';
    $.fn.validatebox.defaults.rules.url.message = '请输入有效的URL地址';
    $.fn.validatebox.defaults.rules.length.message = '输入内容长度必须介于{0}和{1}之间';
    $.fn.validatebox.defaults.rules.remote.message = '请修正该字段';
    $.extend($.fn.validatebox.defaults.rules, {
        telephone: {
            validator: function (value, param) {
                var reg = /[0-9-()（）]{7,18}/;
                if (reg.test(value)) {
                    return true;
                }
                return false;
            },
            message: '请输入有效的电话号码。'
        },
        notEmpty: {
            validator: function (value, param) {
                return ($.trim(value) != "");
            },
            message: '必填项，不能为空。'
        },
        number: {
            validator: function (value, param) {
                var reg = /^[0-9]*$/;
                return reg.test(value);
            },
            message: '只允许输入数字。'
        },
        even: {
            validator: function (value, param) {
                var reg = /^[0-9]*$/;
                if (reg.test(value)) {
                    var num = parseInt(value);
                    if (num > 0 && num % 2 == 0) {
                        return true;
                    }
                    return false;
                }
                return false;
            },
            message: '只允许输入大于0的偶数。'
        },
        loginName: {
            validator: function (value, param) {
                var reg = /^[a-zA-Z0-9\u4e00-\u9fa5_]{2,16}$/;
                if (reg.test(value)) {
                    return true;
                }
                return false;
            },
            message: '用户名由字母数字下划线中文组成，长度为2到16位'
        },
        day: {
            validator: function (value, param) {
                var t = parseInt(value, 10);
                if (isNaN(t)) {
                    return false;
                }
                if (t >= 1 && t <= 31) {
                    return true;
                }
                return false;
            },
            message: '只允许输入日期数字。'
        },
        decimal: {
            validator: function (value, param) {
                var p = param ? param[0] : "";
                var reg = null;
                if (p) {
                    reg = new RegExp("^(-)?\\d+(\\.\\d{1," + p + "})?$");
                }
                else {
                    reg = new RegExp("^(-)?\\d+(\\.\\d+)?$");
                }
                return reg.test(value);
            },
            message: '只允许输入数字。'
        },
        money: {
            validator: function (value, param) {
                //var reg = /^\d+(\.\d{0,2})?$/;
                if(value && value.startWith("-")) return false;
                var reg = /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;
                return reg.test(value);
            },
            message: '只允许输入金额。'
        },
        moneyfour: {
            validator: function (value, param) {
                //var reg = /^\d+(\.\d{0,2})?$/;
                var reg = /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,4})?$/;
                return reg.test(value);
            },
            message: '小数点最多允许4位。'
        },
        html: {
            validator: function (value, param) {
                var reg = /^.+\.html|\.htm$/;
                return reg.test(value.toLowerCase());
            },
            message: '只允许导入网页文件（htm、html 格式）。'
        },
        minLength: {
            validator: function (value, param) {
                return value.length >= param[0];
            },
            message: '最小长度不允许小于{0}位'
        },
        allnumber: {
            validator: function (value, param) {
                var reg = /^-?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)([eE][+-]?[0-9]+)?$/;
                return reg.test(value);
            },
            message: '只允许输入数字。'
        },
        positiveFloat: {
            validator: function (value, param) {
                if(value && value.startWith("-")) return false;
                var reg = /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;
                return reg.test(value);
            },
            message: '只允许输入正浮点数。'
        }
    });
}
if ($.fn.numberbox) {
    $.fn.numberbox.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.combobox) {
    $.fn.combobox.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.combotree) {
    $.fn.combotree.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.combogrid) {
    $.fn.combogrid.defaults.missingMessage = '该输入项为必输项';
}
if ($.fn.calendar) {
    $.fn.calendar.defaults.weeks = ['日', '一', '二', '三', '四', '五', '六'];
    $.fn.calendar.defaults.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
}
if ($.fn.datebox) {
    $.fn.datebox.defaults.currentText = '今天';
    $.fn.datebox.defaults.closeText = '关闭';
    $.fn.datebox.defaults.okText = '确定';
    $.fn.datebox.defaults.missingMessage = '该输入项为必输项';
    $.fn.datebox.defaults.formatter = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
    };
    $.fn.datebox.defaults.parser = function (s) {
        if (!s) return new Date();
        var ss = s.split('-');
        var y = parseInt(ss[0], 10);
        var m = parseInt(ss[1], 10);
        var d = parseInt(ss[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m - 1, d);
        } else {
            return new Date();
        }
    };
}
if ($.fn.datetimebox && $.fn.datebox) {
    $.extend($.fn.datetimebox.defaults, {
        currentText: $.fn.datebox.defaults.currentText,
        closeText: $.fn.datebox.defaults.closeText,
        okText: $.fn.datebox.defaults.okText,
        missingMessage: $.fn.datebox.defaults.missingMessage
    });
}


if ($.fn.datagrid && $.fn.datagrid.defaults && $.fn.datagrid.defaults.editors) {
    //为EASYUI的datagrid附加上更多编辑功能
    $.extend($.fn.datagrid.defaults.editors, {
        url: {
            init: function (container, options) {
                var grid = container;
                while (!grid.hasClass("datagrid-view")) {
                    grid = grid.parent();
                }
                grid = grid.children("table:hidden");
                var rowIndex =grid.data("rowIndex").toString()?parseInt(grid.data("rowIndex")):-1;
                if(rowIndex<0){
                    return;
                }
                grid.propertygrid("selectRow", rowIndex);
                var row = null;
                row = grid.propertygrid("getSelected");
                if (!row) {
                    row = grid.datagrid("getSelected");
                }
                //alert(row.value);
                var dialog = null;
                //alert(options)
                var html = $("<table class='more'><tr><td width='99%'><label class='ellipsis moreContext'></label></td><td nowrap='nowrap'><a style='color:blue' href='javascript:void(0)' >" + (options.readonly ? "查看" : "编辑") + "..</a></td></tr></table>").appendTo(container);
                html.find("a").bind("click", function (evt) {
                    var w = options.width || 400;
                    var h = options.height || 400;
                    var minimizable = options.minimizable || false;
                    var maximized = options.maximized || false;
                    var resizable = options.resizable == false ? false : true;
                    var draggable = options.draggable == false ? false : true;
                    var title = (options.title ? options.title : "属性") + (options.readonly ? "查看" : "编辑");
                    var cancelButton = options.cancelButton;
                    var url = options.url;
                    if (options.readonly) {
                        url += (url.indexOf("?") > 0 ? "&" : "?") + "readonly=1";
                    }
                    var win = window.self;
                    if (options.windowLevel) {
                        win = window[options.windowLevel];
                    }
                    var data = grid.propertygrid("getData") || {};
                    var owner = data.owner;
                    if ($.isFunction(url)) {
                        var rows = grid.datagrid("getData").rows;
                        url = url(rows);
                    }

                    var dialogOptions = {
                        "width": w,
                        "height": h,
                        "opener": window.self,
                        "minimizable": minimizable,
                        "maximized": maximized,
                        "draggable": draggable,
                        "title": title,
                        "cancelButton": options.cancelButton || true,
                        "close": options.close,
                        "url": url,
                        "dialogArgs": row.value,
                        "dialogArgs2": owner,
                        "dialogArgs3": row,
                        "isClose": true,
                        "isFrame": true,
                        "resizable": resizable,
                        "windowLevel": options.windowLevel,
                        "buttons": [{
                            "text": "确  定",
                            "iconCls": "icon-ok",
                            "handler": function () {
                                if (OkButtonClick(grid, dialog, options)) {
                                    dialog.dialog("close");
                                }
                                return false;
                            }
                        }]
                    };
                    if (options.buttons) {
                        for (var i = 0; i < options.buttons.length; i++) {
                            var handler = options.buttons[i].handler;
                            options.buttons[i].handler = function () {
                                buttonClickDelegate(handler, grid, dialog, options);
                                dialog.dialog("close");
                                return false;
                            };
                            dialogOptions.buttons.push(options.buttons[i]);

                        }
                    }
                    dialog = win.OpenDialog(dialogOptions);
                    return false;
                });
                return html;
            },
            getValue: function (target) {
                var label = $(target).find("label");
                return label.data("val");
            },
            setValue: function (target, value) {
                var label = $(target).find("label");
                label.data("val", value);
            },
            resize: function (target, width) {
                var target = $(target);
                var label = target.find("label");
                var link = target.find("a");
                if ($.boxModel == true) {
                    target.width(width - (target.outerWidth() - target.width()));
                    label.width(target.width() - link.outerWidth() - 10);
                } else {
                    target.width(width);
                    label.width(width - link.outerWidth() - 10);
                }
            }
        }
    });
    //不可修改只读编辑器
    $.extend($.fn.datagrid.defaults.editors, {
        readonly: {
            init: function (container, options) {
                var html = $("<table><tr><td><label class='ellipsis' style='color:gray'></label></td></tr></table>").appendTo(container);
                return html;
            },
            getValue: function (target) {
                var label = $(target).find("label");
                return label.data("val");
                //return label.html();
            },
            setValue: function (target, value) {
                var label = $(target).find("label");
                label.data("val", value);
                label.html(value.toString());
            },
            resize: function (target, width) {
                var target = $(target);
                var label = target.find("label");
                if ($.boxModel == true) {
                    target.width(width - (target.outerWidth() - target.width()));
                    label.width(target.width());
                } else {
                    target.width(width);
                    label.width(width);
                }
            }
        }
    });

    //不可修改只读编辑器
    $.extend($.fn.datagrid.defaults.editors, {
        htmlCodeText: {
            init: function (container, options) {
                var text = $("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(container);
                return text;
            },
            getValue: function (target) {
                var str = $(target).val();
                str = str.replace(/&/g, "&amp;");
                str = str.replace(/</g, "&lt;");
                str = str.replace(/>/g, "&gt;");
                return str;
            },
            setValue: function (target, value) {
                var str = value;
                str = str.replace(/&lt;/g, "<");
                str = str.replace(/&gt;/g, ">");
                str = str.replace(/&amp;/g, "&");
                $(target).val(str);
            },
            resize: function (target, width) {
                var jq = $(target);
                if ($.boxModel == true) {
                    jq.width(width - (jq.outerWidth() - jq.width()));
                } else {
                    jq.width(width);
                }
            }
        }
    });

    //偶数编辑器
    $.extend($.fn.datagrid.defaults.editors, {
        even: {
            init: function (container, options) {
                var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
                input.numberbox(options);
                input.validatebox({
                    validType: "even"
                });
                return input;
            },
            destroy: function (target) {
                $(target).numberbox('destroy');
            },
            getValue: function (target) {
                $(target).blur();
                return $(target).numberbox('getValue');
            },
            setValue: function (target, value) {
                $(target).numberbox('setValue', value);
            },
            resize: function (target, width) {
                $(target)._outerWidth(width);
            }
        }
    });
    //数字编辑器
    $.extend($.fn.datagrid.defaults.editors, {
        decimalbox: {
            init: function (container, options) {
                var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
                //input.numberbox(options);
                input.validatebox({
                    validType: "decimal"
                });
                return input;
            },
            destroy: function (target) {
                //$(target).numberbox('destroy');
                $(target).remove();
            },
            getValue: function (target) {
                $(target).blur();
                return $(target).val();
            },
            setValue: function (target, value) {
                $(target).val(value);
            },
            resize: function (target, width) {
                $(target)._outerWidth(width);
            }
        }
    });

    //自定义编辑器
    $.extend($.fn.datagrid.defaults.editors, {
        manybox: {
            init: function (container, options) {
                var input = $('<input type="text" style="height:18px;" class=" datagrid-editable-input ds_textbox">').appendTo(container);
                var rules =  "[" + options.rules.toString() + "]";
                input.validatebox({
                    validType: "many" + rules
                });
                return input;
            },
            getValue: function (target) {
                $(target).blur();
                return $(target).val();
            },
            setValue: function (target, value) {
                $(target).val(value);
            },
            resize: function (target, width) {
                $(target)._outerWidth(width);
            }
        }
    });


    function buttonClickDelegate(fn,grid, dialog, options) {
        var view = grid.parent();
        var row = grid.propertygrid("getSelected");
        var index = grid.propertygrid("getRowIndex", row);
        grid.propertygrid("beginEdit", index);
        var iframe = dialog.find("iframe");
        if (iframe.length > 0) {
            var win = iframe.get(0).contentWindow;
            if ($.isFunction(win[fn])) {
                var returnVal = win[fn]();
                var tr = view.find("tr[datagrid-row-index=" + index + "]");
                var table = tr.find("table.more");
                $.fn.datagrid.defaults.editors.url.setValue(table, returnVal);
            }
        }
        grid.propertygrid("endEdit", index);

    }
    function OkButtonClick(grid, dialog, options) {
        var view = grid.parent();
        var row = grid.propertygrid("getSelected");
        var index = grid.propertygrid("getRowIndex", row);
        var iframe = dialog.find("iframe");
        if (iframe.length > 0) {
            var win = iframe.get(0).contentWindow;
            if (win.chkReturnValue && $.isFunction(win.chkReturnValue)) {
                if (win.chkReturnValue()==false) {
                    return false;
                }
            }
        }
        grid.propertygrid("beginEdit", index);
        if (iframe.length > 0) {
            if ($.isFunction(win.getReturnValue)) {
                var returnVal = win.getReturnValue();
                var tr = view.find("tr[datagrid-row-index=" + index + "]");
                var table = tr.find("table.more");
                $.fn.datagrid.defaults.editors.url.setValue(table, returnVal);
            }
        }
        grid.propertygrid("endEdit", index);
        return true;
    }
}

var c = 0;
//扩展验证功能

if ($.fn.validatebox && $.fn.validatebox.defaults) {
    $.extend($.fn.validatebox.methods, {
        remove: function (jq, newposition) {
            return jq.each(function () {
                $(this).removeClass("validatebox-text validatebox-invalid").unbind('focus').unbind('blur');
            });
        },
        reduce: function (jq, newposition) {
            return jq.each(function () {
                var opt = newposition || $(this).data().validatebox.options;
                $(this).addClass("validatebox-text").validatebox(opt);
            });
        }
    });

    $.extend($.fn.validatebox.defaults.rules, {
        regExp: {
            validator: function (value, param) {
                var reg = param[0];
                if (value.match(reg)) {
                    return true;
                }
                else {
                    return false;
                }
            },
            message: '输入值与正则表达式{0}不匹配'
        }
    });
    $.extend($.fn.validatebox.defaults.rules, {
        //正则
        regExp: {
            validator: function (value, param) {
                var reg = param[0];
                if (value.match(reg)) {
                    return true;
                }
                else {
                    return false;
                }
            },
            message: '输入正则表达式{0}不符合要求'
        },
        customer: {
            validator: function (value, param) {
                var p = null;
                if (param[0]) {
                    p = eval(param[0]);
                }
                if ($.isFunction(p)) {
                    var result = p(value, param[1]);
                    if (result.success) {
                        return true;
                    }
                    else {
                        $.fn.validatebox.defaults.rules.customer.message = result.message || $.fn.validatebox.defaults.rules.customer.message;
                        return false;
                    }
                }
                return true;
            },
            message: '输入错误'
        },
        //唯一
        unique: {
            validator: function (value, param) {
                var p = param[0];
                var domain = p.domain;
                var uqkey = p.key;
                if (domain && uqkey) {
                    if (!$(window).data(domain)) {
                        $(window).data(domain, []);
                    }
                    var array = $(window).data(domain);
                    for (var i = 0; i < array.length; i++) {
                        var v = array[i];
                        if (v.uqkey != uqkey) {
                            if (v.value == value) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            },
            message: '输入值存在重复'
        },
        //多验证器
        many: {
            validator: function (value, param) {
                var rules = param;
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    var ruleGroup = /([a-zA-Z_]+)(.*)/.exec(rule);
                    var ruleName = ruleGroup[1];
                    var ruleParam = eval(ruleGroup[2]);
                    if (!$.fn.validatebox.defaults.rules[ruleName]["validator"](value, ruleParam)) {
                        var message = $.fn.validatebox.defaults.rules[ruleName].message;
                        if (ruleParam && $.isArray(ruleParam)) {
                            for (var i = 0; i < ruleParam.length; i++) {
                                message = message.replace(new RegExp("\\{" + i + "\\}", "g"), ruleParam[i]);
                            }
                        }
                        $.fn.validatebox.defaults.rules.many.message = message;
                        return false;
                    }
                }
                return true;
            },
            message: ''
        },
        //多验证或关系
        manyForOr: {
            validator: function (value, param) {
                var rules = param;
                var result = [];
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];
                    var ruleGroup = /([a-zA-Z_]+)(.*)/.exec(rule);
                    var ruleName = ruleGroup[1];
                    var ruleParam = eval(ruleGroup[2]);
                    if (!$.fn.validatebox.defaults.rules[ruleName]["validator"](value, ruleParam)) {
                        var message = $.fn.validatebox.defaults.rules[ruleName].message;
                        if (ruleParam && $.isArray(ruleParam)) {
                            for (var i = 0; i < ruleParam.length; i++) {
                                message = message.replace(new RegExp("\\{" + i + "\\}", "g"), ruleParam[i]);
                            }
                        }
                        result.push(false);
                    }
                    else {
                        result.push(true);
                    }
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i]) {
                        return true;
                    }
                }
                return false;
            },
            message: '输入值不符合要求'
        },
        keyWordMark: {
            validator: function (value, param) {
                var reg = /\[@([^\[@]*)\]/g;
                return reg.test(value);
            },
            message: '输入值不符合要求'
        }
    });
}

//扩展datagrid动态编辑器功能
if ($.fn.datagrid.methods) {
    $.extend($.fn.datagrid.methods, {
        "disableEditor": function (jq, param) {
            var field = param;
            if (field) {
                var d = $(jq);
                var e = d.datagrid('getColumnOption', field);
                if (!d.data("editors")) {
                    d.data("editors", {});
                }
                if (!d.data("editors")["@" + field]) {
                    d.data("editors")["@" + field] = e.editor;
                }
                e.editor = {};
            }
        },
        "enableEditor": function (jq, param) {
            var field = param;
            if (field) {
                var d = $(jq);
                var e = d.datagrid('getColumnOption', field);
                if (!d.data("editors")) {
                    d.data("editors", {});
                }
                if (d.data("editors")["@" + field]) {
                    e.editor = d.data("editors")["@" + field];
                }

            }
        }
    });
}

//扩展 layout 动态编辑器功能
if ($.fn.layout.methods) {
    $.extend($.fn.layout.methods, {
        remove: function (jq, region) {
            return jq.each(function () {
                var panel = $(this).layout("panel", region);
                if (panel) {
                    panel.panel("destroy");
                    var panels = $.data(this, 'layout').panels;
                    panels[region] = $('>div[region=' + region + ']', $(this));
                    $.data(this, 'layout').panels = panels;
                    $(this).layout("resize");
                }
            });
        },
        add: function (jq, params) {
            return jq.each(function () {
                var container = $(this);
                var panel = $('>div[region=' + params.region + ']', container);
                if (!panel.length) {
                    var pp = $('<div/>').attr("region", params.region).addClass('layout-body').appendTo(container);
                    var cls = 'layout-panel layout-panel-' + params.region;
                    pp.panel($.extend({}, params.options, {
                        cls: cls
                    }));
                    var panels = $.data(this, 'layout').panels;
                    panels[params.region] = pp;
                    $.data(this, 'layout').panels = panels;
                    $(this).layout("resize");
                }
            });
        }
    });
}


//扩展 tree 异步加载功能
if ($.fn.tree.methods) {
    $.extend($.fn.tree.methods, {
        loadDataAsync: function (jq, args) {
            return jq.each(function () {
				var row = args.row;
				var url = args.url;
            	
				var treeopenId = $(this).data("expandNode");
				
                if (!treeopenId) {
                	treeopenId = [];
                }

		        if ($.inArray(row.id, treeopenId) != -1) {
		            return;
		        };
		        var result = getDatatreeByFid(row.id);
		        var rows = [];
		        treeopenId.push(row.id);
				if($.isFunction(args.getData)){
					rows = args.getData(result);
				}else{
					if (result.children != undefined) {
			            rows = result.children;
			        }
				}
		        
		        var nodes = addAttribute(rows);
		        if(args.permssionName){
		        	nodes = (superLimit ? nodes : treeDataPermssionFilter(nodes, args.permssionName, 1))
		        }
		        $(this).tree('append', {
		            parent: (row ? row.target : null),
		            data:nodes
		        });
		        
		        $(this).data("expandNode", treeopenId);
		        
		        function getDatatreeByFid(fid) {
		            var result = getServerData(args.params?$.extend(args.params,{ "FID": fid}):{ "FID": fid}, url);
		            return result;
		        }

            });
        }
    });
}

//扩展TABS控件修改选项卡标题
if ($.fn.tabs.methods) {
    $.fn.tabs.methods.setTitle = function (jq, args) {
        var pp = args.tab;
        var opts = pp.panel("options");
        opts.title = args.title;
        var tab = opts.tab;
        var _2c0 = tab.find("span.tabs-title");
        _2c0.html(opts.title);
    }
}

//为combotree注册一个选中值的函数，原因是EASYUI1.4.1版本setValue函数不再触发onSelect事件
if ($.fn.combo.methods) {
    $.fn.combo.methods.setValue2 = function (jq, args) {
        jq.combotree("setValue", args);
        var comtree = jq.combotree("tree");
        var node = comtree.tree("getSelected");
        jq.combotree("options").onSelect(node);
    }
}


/**
 * 添加分页处理方法
 * 1.在datagrid属性里面添加pagination:true,pageSize:10
 * 2.在loadData后面添加clientPaging方法
 * 如$("#grid").datagrid("loadData", data).datagrid('clientPaging');
 * 注意：加载的data要么是一个纯粹的数组格式，要么是带有total的格式，
 * 		不能是{rows:rows}(这种带有rows但是不带total的)
 */
(function ($) {
    var loadDataMethod = $.fn.datagrid.methods.loadData;
    $.extend($.fn.datagrid.methods, {
        clientPaging: function (jq) {
			if(!jq.data("isFirstInvokeClientPaging")){
				jq.data("isFirstInvokeClientPaging",true);
				return jq.each(function () {
	                var dg = $(this);
	                var state = dg.data('datagrid');
	                var opts = state.options;
	                opts.loadFilter = pagerFilter;
	                var onBeforeLoad = opts.onBeforeLoad;
	                opts.onBeforeLoad = function (param) {
	                    state.allRows = null;
	                    return onBeforeLoad.call(this, param);
	                }
	                dg.datagrid('getPager').pagination({
	                    onSelectPage: function (pageNum, pageSize) {
	                        opts.pageNumber = pageNum;
	                        opts.pageSize = pageSize;
	                        $(this).pagination('refresh', {
	                            pageNumber: pageNum,
	                            pageSize: pageSize
	                        });
	                        dg.datagrid('loadData', state.allRows);
	                    }
	                });
	                $(this).datagrid('loadData', state.data);
	                if (opts.url) {
	                    $(this).datagrid('reload');
	                }
	            });
			}
        },
        loadData: function (jq, data) {
            jq.each(function () {
                $(this).data('datagrid').allRows = null;
            });
            return loadDataMethod.call($.fn.datagrid.methods, jq, data);
        },
        getAllRows: function (jq) {
            return jq.data('datagrid').allRows;
        }
    })
    function pagerFilter(data) {
        if ($.isArray(data)) {    // is array
            data = {
                total: data.length,
                rows: data
            }
        }
        var dg = $(this);
        var state = dg.data('datagrid');
        var opts = dg.datagrid('options');
        if (!state.allRows) {
            state.allRows = (data.rows);
        }
        var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
        var end = start + parseInt(opts.pageSize);
        data.rows = $.extend(true, [], state.allRows.slice(start, end));
        return data;
    }
})(jQuery);

