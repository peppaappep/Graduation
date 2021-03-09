var dsf;
if (window.top == window) {
  document.write('<script src="https://g.alicdn.com/dingding/dingtalk-jsapi/2.7.13/dingtalk.open.js"></script>');
}

$(function() {
  window.systemOpen = window.open;
  try {
    if (top.dd && top.dd.version) {
      window.systemOpen = window.open;
      window.open = function(url) {
        dsf.layer.openDialog({
          offset: 0,
          title: '',
          type: 2,
          resize: false,
          area: ['100%', '100%'],
          content: url,
          closeBtn: 2,
          dialogLoaded: function(layero, index, win) {}
        });
      };
    }
  } catch (ex) {

  } finally {}

});


! function(dsf) {
  if (dsf && !dsf.extend) {
    dsf.extend = function(namespace, _module) {
      if (dsf[namespace]) {
        throw "模块名称已经存在";
      }
      dsf[namespace] = _module;
    }
  }
  var noop = function() {}

  //修复低版本浏览器的API缺陷
  function repair() {
    //增加string的startsWith
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function(prefix) {
        return this.slice(0, prefix.length) === prefix;
      };
    }

    //增加string的endsWith
    if (typeof String.prototype.endsWith != 'function') {
      String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
      };
    }

    if (typeof Array.prototype.forEach != 'function') {
      Array.prototype.forEach = function(callback) {
        for (var i = 0; i < this.length; i++) {
          callback(this[i], i);
        }
      }
    }
    if (typeof Array.prototype.filter != 'function') {
      Array.prototype.filter = function(callback) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
          var r = callback(this[i]);
          if (r === true) {
            result.push(this[i]);
          }
        }
        return result;
      }
    }

    //解决IE9下元素不支持classList问题
    if (!("classList" in document.documentElement)) {
      Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function() {
          var self = this;

          function update(fn) {
            return function(value) {
              var classes = self.className.split(/\s+/g),
                index = classes.indexOf(value);

              fn(classes, index, value);
              self.className = classes.join(" ");
            }
          }

          return {
            add: update(function(classes, index, value) {
              if (!~index) classes.push(value);
            }),

            remove: update(function(classes, index) {
              if (~index) classes.splice(index, 1);
            }),

            toggle: update(function(classes, index, value) {
              if (~index)
                classes.splice(index, 1);
              else
                classes.push(value);
            }),

            contains: function(value) {
              return !!~self.className.split(/\s+/g).indexOf(value);
            },

            item: function(i) {
              return self.className.split(/\s+/g)[i] || null;
            }
          };
        }
      });
    }
  }
  repair();

  var hasConsole = typeof console === 'object';
  var writeToConsole = {
    log: function() {
      if (hasConsole) {
        Function.apply.call(console.log, console, arguments);
      }
    },
    time: function() {
      if (hasConsole) {
        var method = console.time;
        Function.apply.call(method, console, arguments);
      }
    },
    timeEnd: function() {
      if (hasConsole) {
        var method = console.timeEnd;
        Function.apply.call(method, console, arguments);
      }
    },
    warn: function() {
      if (hasConsole) {
        var method = console.warn || console.log;
        Function.apply.call(method, console, arguments);
      }
    },
    error: function() {
      if (hasConsole) {
        var method = console.error || console.log;
        Function.apply.call(method, console, arguments);
      }
    }
  }

  dsf.extend("noop", noop);
  dsf.extend("type", function(v) {
    return $.type(v);
  })
  dsf.extend("use", function(nameSpace, lib) {
    if (!dsf[nameSpace]) {
      dsf[nameSpace] = {};
    }
    for (var k in lib) {
      dsf[nameSpace][k] = lib[k];
    }
  });

  dsf.extend("isNaN", function(v) {
    if (dsf.isUnDef(v) || v == "" || isNaN(v)) {
      return true;
    }
    return false;
  })
  dsf.extend("register", function(name, code, className, ctor) {
    ctor.prototype.ctrl_code = code;
    ctor.prototype.ctrl_type = className;
    window._controlMap.code[code] = {
      code: code,
      handler: ctor,
      name: name,
      target: className
    };
    window._controlMap.className[className] = {
      code: code,
      handler: ctor,
      name: name,
      target: className
    }
  });

  dsf.extend("getControlClassForCode", function(code) {
    return window._controlMap.code[code].handler;
  });

  //判断浏览器对日志测处理
  dsf.extend("log", writeToConsole.log);
  dsf.extend("warn", writeToConsole.warn)
  dsf.extend("error", writeToConsole.error)
  dsf.extend("time", writeToConsole.time);
  dsf.extend("timeEnd", writeToConsole.timeEnd)
  dsf.extend("isDef", function(v) {
    return v !== undefined && v !== null;
  });
  dsf.extend("isUnDef", function(v) {
    return v === undefined || v === null;
  });

  dsf.extend("event", {
    stop: function(evt) {
      evt.stopPropagation();
    },
    prevent: function(evt) {
      evt.preventDefault();
    }
  })

  /**
   * eg: var inputGrade = new dsf.inputGrade.init(config);
   * inputGrade.setValue();
   */
  dsf.extend("inputGrade", {
    init: function(config) {
      var defaultConfig = {
        inputJqDom: "",
        id: dsf.uuid(),
        value: "",
        boxJqDom: ""
      }
      config = $.extend(true, defaultConfig, config);

      if (!config.inputJqDom) {
        dsf.layer.message('请配置绑定输入框"inputJqDom"', false);
        return
      } else if (!config.inputJqDom.val) {
        //inputJqDom首页要是输入框并且还是jq对象
        dsf.layer.message('请配置正确的inputJqDom', false);
        return
      }

      if (config.boxJqDom && !config.boxJqDom[0]) {
        // boxJqDom要是Jq对象
        dsf.layer.message('请配置正确的boxJqDom', false);
        return
      } else if (!config.boxJqDom) {
        config.boxJqDom = config.inputJqDom.parent();
      }

      if (config.value) {
        config.inputJqDom.val(config.value);
      }
      if (config.inputJqDom.attr('inputLevelId')) {
        $('#' + config.inputJqDom.attr('inputLevelId')).remove();
      }
      config.inputJqDom.attr('inputLevelId', config.id);
      config.inputJqDom.on("input propertychange", function() {
        console.log(1);
        setValue(evt.target.value);
      });

      var ul = $("<ul class='ds_inputgrade' id='" + config.id + "'></ul>");
      ul.html('<li>非常弱</li><li>弱</li><li>一般</li><li>强</li><li>非常强</li><li>安全</li><li>非常安全</li>');
      config.boxJqDom.append(ul);

      setValue(config.value);

      function setValue(v) {
        if (!v && config.inputJqDom && config.inputJqDom.on) {
          v = config.inputJqDom.val();
        }
        if (!v) {
          ul.attr("class", 'ds_inputgrade');
          return
        }
        var lth = v.length;
        var score = lth <= 4 ? 5 : lth >= 8 ? 25 : 10;
        var dxx = 0;
        var sz = false;
        var fh = false;
        if (/[a-z]/.test(v)) {
          if (/[A-Z]/.test(v)) {
            score += 20;
            dxx = 2;
            // 大小写都有
          } else {
            // 只有小写
            score += 10
            dxx = true;
          }
        } else if (/[A-Z]/.test(v)) {
          // 只有大写
          score += 10
          dxx = true;
        }

        if (/[0-9]/.test(v)) {
          sz = true;
          if (v.match(/([0-9])/g).length >= 3) {
            score += 20
          } else {
            score += 10
          }
        }

        var reg = new RegExp("[-`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]", "g");
        if (reg.test(v)) {
          fh = true;
          if (v.match(reg).length > 1) {
            score += 20
          } else {
            score += 10
          }
        }

        if (fh && sz && dxx === 2) {
          score += 5
        } else if (dxx && sz && fh) {
          score += 3
        } else if (dxx && sz) {
          score += 2
        }

        ul.attr("class", 'ds_inputgrade');
        if (score >= 90) {
          ul.addClass('level7')
        } else if (score >= 80) {
          ul.addClass('level6')
        } else if (score >= 70) {
          ul.addClass('level5')
        } else if (score >= 60) {
          ul.addClass('level4')
        } else if (score >= 50) {
          ul.addClass('level3')
        } else if (score >= 25) {
          ul.addClass('level2')
        } else if (score > 0) {
          ul.addClass('level1')
        }
      }

      this.verify = setValue;
      this.config = config;
      this.$dom = ul;

      this.destroy = function() {
        ul.remove();
        config.inputJqDom.off("input propertychange");
        config.inputJqDom.removeAttr('inputLevelId')
      }
    }
  })

  var prompt = {
    "savesuccess": "保存成功",
    "savefail": "保存失败",
    "loaddatafail": "加载数据失败",
    "loadcountfail": "获取记录数失败",
    "initfail": "初始化失败",
    "deletesuccess": "删除成功",
    "deletefail": "删除失败",
    "uploadsuccess": "上传成功",
    "uploadfail": "上传出现错误",
    "publishsuccess": "发布成功",
    "publishfail": "发布失败",
    "cancelsuccess": "取消成功",
    "cancelfail": "取消失败"
  }

  var globalCache = {};
  var url = {
    queryObject: function(url) {
      url = url || window.location.search;
      if (url) {
        if (url.indexOf("?") < 0) {
          url += "?" + url;
        }
        var params = {};
        var urls = url.split("?");
        var arr = urls[1].split("&");
        var l;
        for (var i = 0, l = arr.length; i < l; i++) {
          var a = arr[i].split("=");
          params[a[0]] = a[1];
        }
        return params;
      }
      return {};
    },
    queryString: function(key) {
      if (!globalCache["url_queryString"]) {
        globalCache["url_queryString"] = {}
      }
      if (!globalCache["url_queryString"][key]) {
        var url = window.location.search;
        var oRegex = new RegExp('[\?&]' + key + '=([^&]+)', 'i');
        var oMatch = oRegex.exec(url);
        if (oMatch && oMatch.length > 1) {
          var val = decodeURI(oMatch[1]);
          globalCache["url_queryString"][key] = val;
          return val;
        } else {
          return "";
        }
      }
      return globalCache["url_queryString"][key];
    },
    hashString: function(key) {
      if (!globalCache["url_hashString"]) {
        globalCache["url_hashString"] = {}
      }
      if (!globalCache["url_hashString"][key]) {
        var url = window.location.hash;
        var oRegex = new RegExp('[#&]' + key + '=([^&]+)', 'i');
        var oMatch = oRegex.exec(url);
        if (oMatch && oMatch.length > 1) {
          var val = decodeURI(oMatch[1]);
          globalCache["url_hashString"][key] = val;
          return val;
        } else {
          return "";
        }
      }
      return globalCache["url_hashString"][key];
    },
    //解析url,将所有query参数进行编码返回一个新的url
    analysis: function(url) {
      var searchStr = url.substr(url.indexOf("?"));
      var oRegex = /[\?&](\w+)=([^&]+)?/gi;
      url = url.replace(oRegex, function(a, b, c, d) {
        var s = a.substr(0, 1);
        s += b + "=" + encodeURI(c || "");
        return s
      })
      return url;
    },
    getWebPath: function(url) {
      if(!url) return '';
      if (url.indexOf("/") == 0) {
        url = url.substr(1);
      }
      return dsf.config.webRoot + url;
    },
    getAbsolutePath: function(url) {
      if (url.indexOf("~/") == 0) {
        url = dsf.url.getWebPath(url.substr(1));
      } else if (url.indexOf("/") == 0) {
        url = dsf.url.getWebPath(url.substr(1));
      }
      return url;
    },

    getQuestionUrl: function(ispd, mark, title, pname, nameScpace) {
      if (!ispd) {
        var ns = null;
        if (!nameScpace) {
          var url = window.location.pathname;
          var appName = dsf.url.getWebPath("");
          var u = url.substr(appName.length);
          u = u.substring(0, u.indexOf("/views/"));
          u = u.split("/");
          ns = u.join("/");
        } else {
          ns = nameScpace.split(".").join("/")
        }
        var result = dsf.url.getWebPath(ns + "/qi" + mark + "/views/" + pname + ".html");
        return result;
      } else {
        var ns = {
          "B": "",
          "M": ""
        };
        if (!nameScpace) {
          var url = window.location.pathname;
          var appName = dsf.url.getWebPath("");
          var u = url.substr(appName.length);
          u = u.substring(0, u.indexOf("/views/"));
          u = u.split("/");
          ns.B = u[0];
          ns.M = u.slice(1).join(".") + ".qi" + mark;
        } else {
          var arr = nameScpace.split(".");
          ns.B = arr[0];
          ns.M = arr.slice(1).join(".") + ".qi" + mark;
        }
        var result = dsf.url.getWebPath("dsfa/pd/views/pd.html?B=" + ns.B + "&M=" + ns.M + "&pname=" + pname + "&title=" +
          title);
        return result;
      }

    },
    
    //为一个url增加额外的查询参数
    addParams: function (url, params) {
      try {
        if (!params){
          return url
        }
        if (url.indexOf("?") === -1) {
          url += "?"
        }
        else if (url.split("?")[1]){
          url += "&"
        }

        _.forOwn(params, function (value, key) {
          url = url + key +"="+ value +"&";
        });
        var lastIndex = url.length - 1;
        var urlStr = url.charAt(lastIndex)==="&"? url.substring(0, lastIndex): url;
        return urlStr
      }
      catch (err) {
        dsf.error(err)
      }
    },

  }

  var uuid = (function(len, radix) {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    return function(len, radix) {
      var chars = CHARS,
        uuid = [],
        i;
      radix = radix || chars.length;
      len = len || 16;
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
    }
  })();

  function countQuotes(str) {
    return str.split('"').length - 1;
  }
  var SheetClip = {
    "parse": function(str) {
      var r, rlen, rows, arr = [],
        a = 0,
        c, clen, multiline, last;
      rows = str.split('\n');
      if (rows.length > 1 && rows[rows.length - 1] === '') {
        rows.pop();
      }
      for (r = 0, rlen = rows.length; r < rlen; r += 1) {
        rows[r] = rows[r].split('\t');
        for (c = 0, clen = rows[r].length; c < clen; c += 1) {
          if (!arr[a]) {
            arr[a] = [];
          }
          if (multiline && c === 0) {
            last = arr[a].length - 1;
            arr[a][last] = arr[a][last] + '\n' + rows[r][0];
            if (multiline && (countQuotes(rows[r][0]) & 1)) { //& 1 is a bitwise way of performing mod 2
              multiline = false;
              arr[a][last] = arr[a][last].substring(0, arr[a][last].length - 1).replace(/""/g, '"');
            }
          } else {
            if (c === clen - 1 && rows[r][c].indexOf('"') === 0) {
              arr[a].push(rows[r][c].substring(1).replace(/""/g, '"'));
              multiline = true;
            } else {
              arr[a].push(rows[r][c].replace(/""/g, '"'));
              multiline = false;
            }
          }
        }
        if (!multiline) {
          a += 1;
        }
      }
      return arr;
    },
    "stringify": function(arr) {
      var r, rlen, c, clen, str = '',
        val;
      for (r = 0, rlen = arr.length; r < rlen; r += 1) {
        for (c = 0, clen = arr[r].length; c < clen; c += 1) {
          if (c > 0) {
            str += '\t';
          }
          val = arr[r][c];
          if (typeof val === 'string') {
            if (val.indexOf('\n') > -1) {
              str += '"' + val.replace(/"/g, '""') + '"';
            } else {
              str += val;
            }
          } else if (val === null || val === void 0) { //void 0 resolves to undefined
            str += '';
          } else {
            str += val;
          }
        }
        str += '\n';
      }
      return str;
    }
  }

  var copyTo = function(element, options) {
    var text = $("#copyTextBox");
    if (text.length <= 0) {
      text = $(
        "<textarea id=\"copyTextBox\" style=\"display:none;position:absolute;z-index:100000;top:0px;left:0px\"></textarea>"
      ).appendTo($("body"));
    }
    options = $.extend({}, options);

    function __ctrlv(evt) {
      if (evt.ctrlKey && evt.keyCode == 86) {
        if ($.isFunction(options.invokeDefaultEvent)) {
          if (options.invokeDefaultEvent(evt)) {
            return true;
          }
        }
        if ($.isFunction(options.onBeforeCopy)) {
          if (options.onBeforeCopy(evt) == false) {
            return false;
          }
        }
        text.fadeTo(10, 0);
        window.focus();
        text.focus().select();
        window.setTimeout(function() {
          dealwithData(evt)
        }, 10);
      }
    }
    element.bind("keydown", __ctrlv);

    function dealwithData(evt) {
      text.blur();
      text.hide();
      try {
        var rows = dsf.SheetClip.parse(text.val());
        if (rows.length == 1 && rows[0].length == 1) {
          var textBox = $(evt.target);
          if (textBox.get(0).tagName == "TEXTAREA" || (textBox.get(0).tagName == "INPUT" || textBox.attr("type") == "text")) {
            if (!textBox.prop("readonly") && !textBox.prop("disabled")) {
              // textBox.val(text.val());
              //查看是否是个控件
              var ctrlEl = textBox.closest(".ds_control");
              var ctrl = ctrlEl.data("Object");
              if (ctrl && (ctrl instanceof dsf.Controls.FormControl)) {
                ctrl.value = text.val();
                if (ctrl.$metadata && ctrl.$metadata.level == 1) {
                  var row = ctrl.element.closest(".dataRow").data("Object");
                  if (row) {
                    row._data[ctrl.metadata_fullcode] = ctrl.value;
                  }
                }
              } else {
                textBox.val(text.val());
              }
            }
          }

        } else {
          if ($.isFunction(options.onCopySuccess)) {
            var val = "";
            if (options.replaceStatrEndWrap != false) {
              val = text.val().replace(/^[\r\n]*/g, '').replace(/[\r\n]*$/g, '');
            } else {
              val = text.val();
            }
            options.onCopySuccess(rows, evt);
            if (options.one == true) {
              $("body").unbind("keydown", __ctrlv);
            }
          }

        }

      } catch (ex) {} finally {}
    }
  }

  function queue(isloading) {
    var index = 0;
    var self = this;
    var functionQueue = [];
    var _catch = function() {};
    var _finally = function() {};
    var loadingIndex = null;
    this.step = function(fn) {
      functionQueue.push(fn);
      return this;
    }
    this.finally = function(fn) {
      _finally = fn;
      return self;
    }
    this.catch = function(fn) {
      _catch = fn;
      return self;
    }
    this.exec = function() {
      if (isloading) {
        loadingIndex = dsf.layer.loadding()
      }
      var fn = functionQueue[index];
      _exec(fn);
      return self;
    }

    function _exec(callback, args) {
      if (index > functionQueue.length) {
        return;
      } else if (index == functionQueue.length) {
        _finally();
        if (loadingIndex) {
          dsf.layer.close(loadingIndex);
        }
        return;
      }
      var def = $.Deferred();
      var wait = function() {
        if (callback) {
          try {
            callback(def, args);
          } catch (ex) {
            if (console && console.error) {
              console.error(ex);
            }
            _catch(ex);
          }
        }
        return def;
      }
      $.when(wait(def))
        .done(function(result) {
          index++;
          _exec(functionQueue[index], result);
        })
        .fail(function(result) {
          if (result && console && console.error) {
            console.error(result);
          }
          _catch(result);
          _finally();
          if (loadingIndex) {
            dsf.layer.close(loadingIndex);
          }
        });
    }
  }

  function dateFormatter() {
    function UTCDate() {
      return new Date(Date.UTC.apply(Date, arguments));
    }
    var formatType = 'standard';
    var dates = {
      "zh-CN": {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日",
        format: "yyyy年mm月dd日",
        weekStart: 1,
        meridiem: []
      }

    }
    var DPGlobal = {
      modes: [{
          clsName: 'days',
          navFnc: 'Month',
          navStep: 1
        },
        {
          clsName: 'months',
          navFnc: 'FullYear',
          navStep: 1
        },
        {
          clsName: 'years',
          navFnc: 'FullYear',
          navStep: 10
        }
      ],
      isLeapYear: function(year) {
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
      },
      parseFormat: function(format, type) {
        type = type || formatType;
        var separators = format.replace(this.validParts(type), ',').split(','),
          parts = format.match(this.validParts(type));
        if (!separators || !separators.length || !parts || parts.length == 0) {
          throw new Error("Invalid date format.");
        }
        return {
          separators: separators,
          parts: parts
        };
      },
      validParts: function(type) {
        if (type == "standard") {
          return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
        } else if (type == "php") {
          return /[dDjlNwzFmMnStyYaABgGhHis]/g;
        } else {
          throw new Error("Invalid format type.");
        }
      },
      nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
    }
    return {
      //格式化日期
      format: function(date, format, language, type) {
        type = type || formatType;
        language = language || "zh-CN";
        if (date == null) {
          return '';
        }
        if (typeof(date) == "string") {
          try {
            date = dataHepler.parse(date);
          } catch (ex) {
            return "";
          }
        } else if (typeof(date) == "number") {
          try {
            date = new Date(date);
            date = dataHepler.parse(date);
          } catch (ex) {
            return "";
          }
        }
        format = DPGlobal.parseFormat(format, type);
        var val;
        if (type == 'standard') {
          val = {
            // year
            yy: date.getFullYear().toString().substring(2),
            yyyy: date.getFullYear(),
            // month
            m: date.getMonth() + 1,
            M: dates[language].monthsShort[date.getMonth()],
            MM: dates[language].months[date.getMonth()],
            // day
            d: date.getDate(),
            D: dates[language].daysShort[date.getDay()],
            DD: dates[language].days[date.getDay()],
            p: (dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getHours() < 12 ? 0 : 1] : ''),
            // hour
            h: date.getHours(),
            // minute
            i: date.getMinutes(),
            // second
            s: date.getSeconds()
          };
          val.H = (val.h % 12 == 0 ? 12 : val.h % 12);
          val.HH = (val.H < 10 ? '0' : '') + val.H;
          val.P = val.p.toUpperCase();
          val.hh = (val.h < 10 ? '0' : '') + val.h;
          val.ii = (val.i < 10 ? '0' : '') + val.i;
          val.ss = (val.s < 10 ? '0' : '') + val.s;
          val.dd = (val.d < 10 ? '0' : '') + val.d;
          val.mm = (val.m < 10 ? '0' : '') + val.m;
        } else {
          throw new Error("Invalid format type.");
        }
        var date = [],
          seps = $.extend([], format.separators);
        for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
          if (seps.length) {
            date.push(seps.shift())
          }
          date.push(val[format.parts[i]]);
        }
        if (seps.length) {
          date.push(seps.shift());
        }
        return date.join('');
      },
      //日期字符转日期对象
      parse: function(date, format, language, type) {
        type = type || formatType;
        language = language || "zh-CN";
        if (date instanceof Date) {
          var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
          dateUTC.setMilliseconds(0);
          return dateUTC;
        } else if (date) {
          if (!format) {
            if (/^\d{4}\-\d{1,2}$/.test(date)) {
              format = DPGlobal.parseFormat('yyyy-mm', type);
            }
            if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
              format = DPGlobal.parseFormat('yyyy-mm-dd', type);
            }
            if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
              format = DPGlobal.parseFormat('yyyy-mm-dd hh:ii', type);
            }
            if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}:\d{1,2}(\.\d{1,3})?$/.test(date)) {
              format = DPGlobal.parseFormat('yyyy-mm-dd hh:ii:ss', type);
            }
            if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
              format = DPGlobal.parseFormat('yyyy-mm-dd hh:ii:ss', type);
            }
          } else {
            format = DPGlobal.parseFormat(format, type);
          }
        }
        var parts = date && date.match(DPGlobal.nonpunctuation) || [],
          date = new Date(0, 0, 0, 0, 0, 0, 0),
          parsed = {},
          setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H',
            'HH', 'p', 'P'
          ],
          setters_map = {
            hh: function(d, v) {
              return d.setHours(v);
            },
            h: function(d, v) {
              return d.setHours(v);
            },
            HH: function(d, v) {
              return d.setHours(v == 12 ? 0 : v);
            },
            H: function(d, v) {
              return d.setHours(v == 12 ? 0 : v);
            },
            ii: function(d, v) {
              return d.setMinutes(v);
            },
            i: function(d, v) {
              return d.setMinutes(v);
            },
            ss: function(d, v) {
              return d.setSeconds(v);
            },
            s: function(d, v) {
              return d.setSeconds(v);
            },
            yyyy: function(d, v) {
              return d.setFullYear(v);
            },
            yy: function(d, v) {
              return d.setFullYear(2000 + v);
            },
            m: function(d, v) {
              v -= 1;
              while (v < 0) v += 12;
              v %= 12;
              d.setUTCMonth(v);
              while (d.getMonth() != v)
                d.setDate(d.getDate() - 1);
              return d;
            },
            d: function(d, v) {
              return d.setDate(v);
            },
            p: function(d, v) {
              return d.setHours(v == 1 ? d.getHours() + 12 : d.getHours());
            }
          },
          val, filtered, part;
        setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
        setters_map['dd'] = setters_map['d'];
        setters_map['P'] = setters_map['p'];
        for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
          val = parseInt(parts[i], 10);
          part = format.parts[i];
          if (isNaN(val)) {
            switch (part) {
              case 'MM':
                filtered = $(dates[language].months).filter(function() {
                  var m = this.slice(0, parts[i].length),
                    p = parts[i].slice(0, m.length);
                  return m == p;
                });
                val = $.inArray(filtered[0], dates[language].months) + 1;
                break;
              case 'M':
                filtered = $(dates[language].monthsShort).filter(function() {
                  var m = this.slice(0, parts[i].length),
                    p = parts[i].slice(0, m.length);
                  return m == p;
                });
                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                break;
              case 'p':
              case 'P':
                val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
                break;
            }
          }
          parsed[part] = val;
        }
        for (var i = 0, s; i < setters_order.length; i++) {
          s = setters_order[i];
          if (s in parsed && !isNaN(parsed[s]))
            setters_map[s](date, parsed[s])
        }
        return date;
      }
    }
  }

  /**
   * ajax请求
   */
  var http = function(options) {
    var _this = this;
    var done = null;
    var error = null;
    var always = null;
    this.options = options;
    this.done = function(callback) {
      done = callback;
      return _this;
    }
    this.error = function(callback) {
      error = callback;
      return _this;
    }
    this.always = function(callback) {
      always = callback;
      return _this;
    }
    this.exec = function() {
      var method = this.options.method || "POST";
      var contentType = "",
        defaultContentType = 'application/x-www-form-urlencoded;charset=UTF-8';
      if ($.isFunction(this.options.contentType)) {
        contentType = defaultContentType
      } else {
        contentType = this.options.contentType || defaultContentType
      }
      $.ajax({
        "url": this.options.url,
        "dataType": "json",
        "type": method,
        "async": this.options.async == false ? false : true,
        "data": this.options.args || null,
        "cache": false,
        "contentType": contentType,
        // "contentType": 'application/json;charset=utf-8',
        "beforeSend": function(request) {
          request.setRequestHeader("code", "PC");
          if (method.toUpperCase() == "POST") {
            request.setRequestHeader("X-XSRF-TOKEN", dsf.getCookie("XSRF-TOKEN") || "");
          }
        },
        "success": function(response, textStatus, jqXHR) {
          if (done) {
            done(response);
          }
        },
        "error": function(response, textStatus, errorThrown) {
          console.log(JSON.stringify(response));
          //如果response的状态为0则表示ajax被取消，会导致页面提示错误，所以加判断不执行错误事件
          if (response.status != 0) {
            if (error) {
              error(response, textStatus, errorThrown);
            }
          }
        },
        "complete": function(XHR, TS) {
          if (always) {
            always(XHR, TS);
          }
        }
      });
    }
  }

  /**
   * 弹出
   */
  var layer = {
    "alert": function(message, options, yes) {
      layui.layer.alert(message, options, yes || dsf.noop);
    },
    "confirm": function(message, buttons, yes, no, noTop) {
      var _layui = setLayuiSite.call(this, window);
      if (noTop) {
        _layui = layui;
      }
      if ($.isFunction(buttons)) {
        no = yes;
        yes = buttons;
        buttons = ['确定', '取消'];
      }
      _layui.layer.confirm(message, {
        'offset': '150px',
        "title": "提醒",
        'btn': buttons,
        'yes': function(index, layero) {
          if (yes && $.isFunction(yes)) {
            yes(index, layero)
          }
          _layui.layer.close(index);
        },
        "btn2": function(index, layero) {
          if (no && $.isFunction(no)) {
            no(index, layero);
          }
          _layui.layer.close(index);
        }
      });
    },
    "message": function(message, status, noTop) {
      var icon = 1,
        _layui = setLayuiSite.call(this, window);

      if (noTop) {
        _layui = layui;
      }
      if (status === true) {
        icon = 1
      } else if (status === false) {
        icon = 2;
      } else {
        icon = status;
      }
      if (icon == 2 || icon == 5) {
        _layui.layer.msg(message, {
          icon: 5,
          shift: 6,
          time: 2000
        });
      } else {
        _layui.layer.msg(message, {
          icon: icon,
          time: 2000
        });
      }
    },
    "loadding": function(isTop) {
      var _layui = layui;
      if (isTop) {
        var _layui = setLayuiSite.call(this, window);
      }
      //loading时加载取消右键菜单
      // $("body")
      var loadding = _layui.layer.load(0);
      $(".layui-layer-shade").on("contextmenu", function(evt) {
        dsf.event.stop(evt);
        dsf.event.prevent(evt);
      })
      return loadding;
    },
    "close": function(index, isTop) {
      var _layui = layui;
      if (isTop) {
        _layui = setLayuiSite.call(this, window);
      }
      _layui.layer.close(index);
    },
    "openDialog": function(options) {
      var topWin = setTopSite.call(this, window);
      var optionsDefault = {
        'offset': options.offset == undefined ? ($(topWin).height() * 0.1) + "px" : "150px",
        'title': "标题",
        'type': 2,
        'content': '',
        'area': ['200px', '300px']
      }
      var btn = options.btn;
      delete options.btn;
      options = $.extend({}, optionsDefault, options);
      for (var i = 0; i < (btn && btn.length); i++) {
        var b = btn[i]
        if (!options.btn) {
          options.btn = [];
        }
        options.btn.push(b.text);
        var buttonkey = "btn" + (i + 1);
        if (i == 0) {
          buttonkey = "yes"
        }
        var handler = function(b) {
          var button = b;
          return function(index, layero) {
            var frame = layero.find("iframe");
            var win = frame.get(0).contentWindow;
            var result = button.handler(index, layero, win);
            if (result == false) {
              return false;
            }
            topWin.layui.layer.close(index);
          }
        }
        options[buttonkey] = handler(b);
      }
      var dialog = null;
      options.createIframe = function(layero, index) {
        dialog = {
          "ownerWin": topWin,
          "opener": window.self,
          "closeWindow": function() {
            topWin.dsf.layer.close(index)
          },
          "args": options.args || {}
        }
        var frame = layero.find("iframe")
        var frameDom=frame.get(0)
        if(frameDom){
          try {
            frameDom.dialogIndex = index;
            frameDom.ownerWin = dialog.ownerWin;
            frameDom.opener = dialog.opener;
            frameDom.closeWindow = dialog.closeWindow;
            frameDom.args = dialog.args
          } catch (ex) {
            console.error(ex);
          }
        }
      }
      options.success = function(layero, index) {
        // dialog = {
        //     "ownerWin": topWin,
        //     "opener": window.self,
        //     "closeWindow": function() {
        //         topWin.dsf.layer.close(index)
        //     },
        //     "args":options.args
        // }
        // var frame = layero.find("iframe");
        // var win = frame.get(0).contentWindow;
        // try {
        //     frame.get(0).dialogIndex = index;
        //     frame.get(0).ownerWin = dialog.ownerWin;
        //     frame.get(0).opener = dialog.opener;
        //     frame.get(0).closeWindow = dialog.closeWindow;
        //     frame.get(0).args=dialog.args
        // } catch (ex) {
        //     console.error(ex);
        // }
        var frame = layero.find("iframe");
        var win = frame.get(0).contentWindow;
        //如果不是表单自定义配置出来的页面直接回调options.dialogLoaded
        if (!win.page) {
          if (options.dialogLoaded) {
            options.dialogLoaded(layero, index, win)
          }
        } else {
          //如果是表单自定义配置出来的页面,先判断页面是否加载完毕，
          //chrome执行较快可能已经渲染完毕则直接调用dialogLoaded，
          //IE慢则将dialogLoaded函数传递给iframe,并由page对象执行完毕后自动调用
          if (options.dialogLoaded) {
            if (!win.page._isRender) {
              frame.get(0).dialogLoaded = function() {
                options.dialogLoaded(layero, index, win);
              }
            } else {
              options.dialogLoaded(layero, index, win);
            }
          }
        }
        if (win.dialogInit) {
          win.dialogInit(options.args);
        }
      }
      if (topWin.layui) {
        options.content = dsf.url.analysis(options.content);
        topWin.layui.layer.open(options);
      }
      return dialog;
    },
    "openWindow": function(url) {
      url = dsf.url.analysis(url);
      window.open(url);
    },
    "openHTMLView": function(htmlString, options) {
      options = options || {};
      options.content = htmlString;
      options.type = 1;
      return layui.layer.open(options);
    }
  }

  /**
   * btn loading
   */
  var btnLoading = function (btnNode) {
    if (!(btnNode instanceof jQuery)) {
      console.warn("调用btnLoading方法传入的必须是jQuery节点对象, 否则无效");
      return false;
    }
    btnNode.addClass("layui-btn-disabled").attr("disabled", true);
    $("<i class='layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop'></i>").prependTo(btnNode);
  }
  /**
   * btn loading stop
   */
  var btnStopLoading = function (btnNode) {
    if (!(btnNode instanceof jQuery)) {
      console.warn("调用btnStopLoading方法传入的必须是jQuery节点对象, 否则无效");
      return false;
    }
    btnNode.removeClass("layui-btn-disabled").attr("disabled", false);
    btnNode.children("i.layui-icon-loading.layui-anim-loop").remove();
  }

  var validate = {
    //是否不为空
    "isNotNull": function(data, nullValue) {
      if (nullValue !== undefined && data === nullValue) {
        return false;
      }
      data = $.isArray(data) ? data : [data];
      if (data.length <= 0) {
        return false;
      }
      for (var i = 0; i < data.length; i++) {
        if ($.trim(data[i]) == "" || $.trim(data[i]) == "[]" || $.trim(data[i]) == "{}") {
          return false;
        }
      }
      return true;
    },
    //是否为空
    "isNull": function(data) {
      data = $.isArray(data) ? data : [data];
      for (var i = 0; i < data.length; i++) {
        if ($.trim(data[i]) != "" && $.trim(data[i]) != "[]" && $.trim(data[i]) != "{}") {
          return false;
        }
      }
      return true;
    },
    //是否是数字
    "isNumber": function(data, precision) {
      data = $.isArray(data) ? data : [data];
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          var reg = null;
          if (precision && precision > 0) {
            reg = new RegExp("^-?([0-9]\\d*|0(?!\\.0+$))(\\.\\d{1," + precision + "})?$", 'ig');
          } else {
            reg = new RegExp("^-?[0-9]\\d*$", 'ig');
          }
          if (!reg.test(data[i])) {
            return false;
          }
        }

      }
      return true;
    },
    //验证正则
    "testExpress": function(data, express) {
      data = $.isArray(data) ? data : [data];
      for (var i = 0; i < data.length; i++) {
        if (data[1] != "") {
          var reg = new RegExp(express);
          if (!reg.test(data[i])) {
            return false;
          }
        }

      }
      return true;
    },
    //是否小于num
    "isUnder": function(data, num) {
      data = $.isArray(data) ? data : [data];
      var ismark = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          if (!isNaN(data[i])) {
            if (parseFloat(data[i]) < num) {
              ismark = true;
              break;
            }
          }
        }

      }
      return ismark;
    },
    //是否大于num
    "isOver": function(data, num) {
      data = $.isArray(data) ? data : [data];
      var ismark = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          if (!isNaN(data[i])) {
            if (parseFloat(data[i]) > num) {
              ismark = true;
              break;
            }
          }
        }
      }
      return ismark;
    },
    //是否小于num长度
    "isUnderLength": function(data, num) {
      data = $.isArray(data) ? data : [data];
      var ismark = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          if (data[i].length < num) {
            ismark = true;
            break;
          }
        }
      }
      return ismark;
    },
    //是否大于num长度
    "isOverLength": function(data, num) {
      data = $.isArray(data) ? data : [data];
      var ismark = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          if (data[i].length > num) {
            ismark = true;
            break;
          }
        }
      }
      return ismark;
    },
    //是否符合身份号码
    "isIDCard": function(data) {
      data = $.isArray(data) ? data : [data];
      //身份证正则表达式(15位)
      isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
      //身份证正则表达式(18位)
      isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          if (!isIDCard1.test(data[i]) && !isIDCard2.test(data[i])) {
            return false;
          }
        }
      }
      return true;
    },
    //是否是手机
    "isMobile": function(data) {
      data = $.isArray(data) ? data : [data];
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          var reg = /^1(3|4|5|7|8|9|6)\d{9}$/;
          if (!reg.test(data[i])) {
            return false;
          }
        }

      }
      return true;
    },
    //是否是座机
    "isTelPhone": function(data) {
      data = $.isArray(data) ? data : [data];
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          var reg = /^(0\d{2,3}-)?\d{7,8}$/;
          if (!reg.test(data[i])) {
            return false;
          }
        }

      }
      return true;
    },
    //是否是手机或座机
    "isMobileOrTelPhone": function(data) {
      data = $.isArray(data) ? data : [data];
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          var mobile = /^1(3|4|5|7|8|9|6)\d{9}$/;
          var tel = /^(0\d{2}-)?\d{7,8}$/;
          if (!mobile.test(data[i]) && !tel.test(data[i])) {
            return false;
          }
        }
      }
      return true;
    },
    //是否是email
    "isEmail": function(data) {
      data = $.isArray(data) ? data : [data];
      for (var i = 0; i < data.length; i++) {
        //邮箱
        if (data[i] != "") {
          var reg = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
          if (!reg.test(data[i])) {
            return false;
          }
        }

      }
      return true;
    },
    //是否是车牌号码
    "isPlateNumber": function(data) {
      data = $.isArray(data) ? data : [data];
      for (var i = 0; i < data.length; i++) {
        if (data[i] != "") {
          var reg =
            /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
          if (reg.test(data[i])) {
            return false;
          }
        }
      }
      return true;
    }

  }

  //对各类组件的值判断
  function getEffectiveValue(data, control) {
    //如果控件元数据属性只有一个值，就是字符串或数字类型直接返回数据
    if (control.$metadata.valueAttributes.length == 1) {
      return data;
    }
    //值为复杂对象
    else {
      //如果是枚举类型的，可能返回单一个text,value或者返回多个text,value的数组
      if (dsf.Controls.ItemsControl && control instanceof dsf.Controls.ItemsControl) {
        var v = $.isArray(data) ? data : [data];
        return _.map(v, "value").join(",");
      }
      //表单填空
      else if (dsf.Controls.FormFill && control instanceof dsf.Controls.FormFill) {
        var v = [];
        for (var k in data) {
          v.push(data[k]);
        }
        return v;
      }
      //日期区间
      else if (dsf.Controls.DateIntervalPicker && control instanceof dsf.Controls.DateIntervalPicker) {
        return [data.sdate, data.edate];
      }
      //问卷填空题，多个填写项
      else if (dsf.Controls.Fill && control instanceof dsf.Controls.Fill) {
        var v = [];
        for (var k in data) {
          v.push(data[k]);
        }
        return v;
      } else if ((dsf.Controls.QsRadio && control instanceof dsf.Controls.QsRadio) || (dsf.Controls.QsCheckBox && control instanceof dsf
          .Controls.QsCheckBox)) {
        var v = $.isArray(data) ? data : [data];
        var other = _.find(v, {
          value: "else"
        });
        if (other) {
          var r = _.filter(v, function(o) {
            return o.value != "else";
          });
          r = _.map(r, "value");
          if (!other.attach_text) {
            r = [];
          } else {
            r.push(other.attach_text)
          }
          return r;
        } else {
          var r = _.map(v, "value");
          return r;
        }
      }
    }
    return null;
  }

  var formVaildate = function(control) {
    var metadata = control.metadata;
    var mvalidate = metadata.validate
    var code = (mvalidate && metadata.validate && metadata.validate.code) ? metadata.validate.code : {
      javascript: ''
    };
    var jsCode = code.javascript || "";
    var validateObject = Object.create(validate);
    validateObject.dsf_validate = function(valid, mesage) {
      !valid && this.error.push(mesage);
    }
    validateObject.get = function(key) {
      return this.root[key];
    }
    var vaildateCodeArr = [
      'with(__local__||{}){',
      jsCode,
      "}"
    ]

    var fn = new Function('__local__', vaildateCodeArr.join("\n"));
    var _validator;
    //空验证
    var _emptyValidator = {
      id: "",
      exec: function() {
        return null;
      }
    }
    //附加二次开发自定义的验证函数
    if (control.customerValidate) {
      return {
        id: dsf.uuid(),
        exec: function() {
          var result = {
            id: this.id,
            errorMsg: control.customerValidate()
          }
          page.event.trigger("FormValidate", {
            ui: page,
            target: control,
            validateResult: result
          });
          return result;
        }
      }
    }
    //附加元数据验证
    else if (code) {
      try {
        _validator = {
          id: dsf.uuid(),
          exec: function() {
            validateObject.currentValue = getEffectiveValue(control.value, control);
            validateObject.error = [];
            if (control.scopeControl == control.root) {
              validateObject.root = validateObject.scope = control.root.getControlsData();
            } else {
              //获取控件数据所在子表的行
              index = dsf.Dom.getRowIndexByContrl(control);
              validateObject.root = control.root.getControlsData();
              validateObject.scope = control.scopeControl.value[index]
            }
            fn(validateObject);
            var result = {
              id: this.id,
              errorMsg: validateObject.error.join("、")
            }
            page.event.trigger("formValidate", {
              ui: page,
              target: control,
              validateResult: result
            });
            return result;
          }
        }
      } catch (ex) {
        _validator = _emptyValidator;
      }
      return _validator;
    }
    //附加空验证器
    else {
      _validator = _emptyValidator;
    }
    return _emptyValidator;
  }

  //base64(DataUrl) 转 Blob数据
  function dataUrl2Blob(dataUrl) {
    try {
      var arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bStr = atob(arr[1]),    //解码
        n = bStr.length,
        unit8Array = new Uint8Array(n);
      while (n--) {
        unit8Array[n] = bStr.charCodeAt(n);
      }
      return new Blob([unit8Array], { type: mime });
    }catch (err) {
      console.log(err)
    }
  }

  //IE10+需要用到的方法
  var IE10 = {
    download: function (urlData, downloadFileName) {
      if (!window.navigator.msSaveBlob) {
        console.log("此浏览器不支持IE原生的msSaveBlob方法")
        return false
      }
      try {
        var data = dataUrl2Blob(urlData)
        downloadFileName = downloadFileName? downloadFileName: '下载文件.png';
        window.navigator.msSaveBlob(data, downloadFileName);
      }
      catch (e) {
        console.log(e);
      }
    }
  }
  
  //check browser version(此方法只能保证检测出浏览器的模拟版本，检测真实版本请使用 ES6/res/libs/check-browser.js)
  function checkBrowser(){
    var userAgent = navigator.userAgent;
    var rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
    var rFirefox = /(firefox)\/([\w.]+)/;
    var rOpera = /(opera).+version\/([\w.]+)/;
    var rChrome = /(chrome)\/([\w.]+)/;
    var rSafari = /version\/([\w.]+).*(safari)/;
    var uaMatch = function (ua) {
      var match = rMsie.exec(ua);
      if (match != null) {
        return { browser : "IE", version : match[2] || "0" };
      }
      var match = rFirefox.exec(ua);
      if (match != null) {
        return { browser : match[1] || "", version : match[2] || "0" };
      }
      var match = rOpera.exec(ua);
      if (match != null) {
        return { browser : match[1] || "", version : match[2] || "0" };
      }
      var match = rChrome.exec(ua);
      if (match != null) {
        return { browser : match[1] || "", version : match[2] || "0" };
      }
      var match = rSafari.exec(ua);
      if (match != null) {
        return { browser : match[2] || "", version : match[1] || "0" };
      }
      if (match != null) {
        return { browser : "", version : "0" };
      }
    }
    var browserMatch = uaMatch(userAgent.toLowerCase());
    if (!browserMatch.browser) return "none browser";
    return {
      browser: browserMatch.browser,
      version: +browserMatch.version
    }
  }
  dsf.extend('checkBrowser', checkBrowser);

  //base64(DataUrl) 转 Blob数据
  dsf.extend("dataUrl2Blob", dataUrl2Blob);

  //IE10+工具集
  dsf.extend("IE10", IE10);

  // 切换身份、班级
  dsf.extend("changeUser", function(res) {
    // 切换身份、班级
    if (res.data) {
      localStorage.setItem("RXDC_VALUE", res.data.rxdc_value);
      if (res.data.account && res.data.account.type_value) {
        localStorage.setItem("userType", res.data.account.type_value);
      }
    }
    if (window.parent) {
      if (res.data.account.type_value == '1') {
        window.parent.location.href = dsf.url.getWebPath('teas/portals/views/main_strips.html');
      } else {
        window.parent.location.href = dsf.url.getWebPath('teas/portals/views/main.html');
      }
    }
  });

  dsf.extend("prompt", prompt);
  //验证函数
  dsf.extend("validate", validate);

  //按钮loading
  dsf.extend("btnLoading", btnLoading);
  //按钮loading stop
  dsf.extend("btnStopLoading", btnStopLoading);

  //表单伪代码验证
  dsf.extend("formVaildate", formVaildate);

  //生成uuid
  dsf.extend("uuid", uuid);

  //xss攻击配置
  dsf.extend("xssOptions", {
    whiteList: {
      a: ['target', 'href', 'title', 'class', 'style'],
      abbr: ['title', 'class', 'style'],
      address: ['class', 'style'],
      area: ['shape', 'coords', 'href', 'alt'],
      article: [],
      aside: [],
      audio: ['autoplay', 'controls', 'loop', 'preload', 'src', 'class', 'style'],
      b: ['class', 'style'],
      bdi: ['dir'],
      bdo: ['dir'],
      big: [],
      blockquote: ['cite', 'class', 'style'],
      br: [],
      caption: ['class', 'style'],
      center: [],
      cite: [],
      code: ['class', 'style'],
      col: ['align', 'valign', 'span', 'width', 'class', 'style'],
      colgroup: ['align', 'valign', 'span', 'width', 'class', 'style'],
      dd: ['class', 'style'],
      del: ['datetime'],
      details: ['open'],
      div: ['class', 'style'],
      dl: ['class', 'style'],
      dt: ['class', 'style'],
      em: ['class', 'style'],
      font: ['color', 'size', 'face'],
      footer: [],
      h1: ['class', 'style'],
      h2: ['class', 'style'],
      h3: ['class', 'style'],
      h4: ['class', 'style'],
      h5: ['class', 'style'],
      h6: ['class', 'style'],
      header: [],
      hr: [],
      i: ['class', 'style'],
      img: ['src', 'alt', 'title', 'width', 'height', 'id', '_src', 'loadingclass', 'class', 'data-latex'],
      ins: ['datetime'],
      li: ['class', 'style'],
      mark: [],
      nav: [],
      ol: ['class', 'style'],
      p: ['class', 'style'],
      pre: ['class', 'style'],
      s: [],
      section: [],
      small: [],
      span: ['class', 'style'],
      sub: ['class', 'style'],
      sup: ['class', 'style'],
      strong: ['class', 'style'],
      table: ['width', 'border', 'align', 'valign', 'class', 'style'],
      tbody: ['align', 'valign', 'class', 'style'],
      td: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
      tfoot: ['align', 'valign', 'class', 'style'],
      th: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
      thead: ['align', 'valign', 'class', 'style'],
      tr: ['rowspan', 'align', 'valign', 'class', 'style'],
      tt: [],
      u: [],
      ul: ['class', 'style'],
      video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width', 'class', 'style']
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: true
  })

  //url工具
  dsf.extend("url", url);

  //ajax
  dsf.extend("http", {
    "request": function(url, args, method, contentType, inside) {
      // if(inside){
      //     url=dsf.config.httpUrl+"/"+url;
      // }
      var options = {
        "url": url,
        "args": args || null,
        "method": method || "POST",
        "async": true,
        "contentType": contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
      }
      var httpRequest = new http(options);
      return httpRequest;
    },
    "request_sync": function(url, args, method, contentType, inside) {
      var options = {
        "url": url,
        "args": args || null,
        "method": method || "POST",
        "async": false,
        "contentType": contentType || 'application/x-www-form-urlencoded;charset=UTF-8'
      }
      var httpRequest = new http(options);
      return httpRequest;
    }
  });
  //弹出层
  dsf.extend("layer", layer);

  //元数据格式验证
  dsf.extend("metadata", {
    vaildateBusinessName: function(name) {
      var reg = /^[a-zA-Z]+\w*$/g;
      return reg.test(name);
    },
    vaildateModuleName: function(name) {
      var reg = /^[a-zA-Z]([a-zA-Z0-9]*)(.[a-zA-Z]([a-zA-Z0-9]*))*$/g;
      return reg.test(name);
    },
    vaildatePageName: function(name) {
      var reg = /^[a-zA-Z]+\w*$/g;
      return reg.test(name);
    },
    vaildateMetaName: function(name) {
      var reg = /^[_a-zA-Z]+\w*$/g;
      return reg.test(name);
    }
  });

  //队列执行
  dsf.extend("queue", function(isloading) {
    return new queue(isloading);
  });

  //日期 start
  var dataHepler = dateFormatter();
  dataHepler.dateStrFormatter = function(dateStr, format) {
    try {
      var date = dataHepler.parse(dateStr, format);
      return dataHepler.format(date, format);
    } catch (ex) {
      return dateStr || "";
    }
  }
  dataHepler.getWeekDay = function(d) {
    var weekday = d.getDay();
    weekday = weekday == 0 ? 7 : weekday;
    return weekday;
  }
  dataHepler.getCalendar = function(year, month) {
    var currentMonth_firstDay = new Date(year, month, 1);
    var currentMonth_lastDay = new Date(year, month + 1, 0);
    var weekFirst = 1,
      weekLast = 7;
    var weekday = this.getWeekDay(currentMonth_firstDay);
    var offset_before = weekday - weekFirst;
    weekday = this.getWeekDay(currentMonth_lastDay);
    var offset_after = weekLast - weekday;
    var totalDays = currentMonth_lastDay.getDate();

    totalDays = totalDays + offset_before + offset_after;
    var rows = [];
    var rowsLength = totalDays / 7;
    for (var i = 0; i < rowsLength; i++) {
      var arr = [];
      for (var n = 1; n <= 7; n++) {
        var date = (i * 7) + n;
        var d = new Date(year, month, date - offset_before);
        arr.push({
          date: d,
          offset: d.getMonth() != month ? true : false
        });
      }
      rows.push(arr);
    }
    return rows;
  }
  dataHepler.addDate = function(date, days) {
    if (days == undefined || days == '') {
      days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
  }
  dataHepler.getMonthWeek = function(year, month, day) {
    // 当前日期是这个月的第几周
    var date = new Date(year, month, day);
    day = date.getDate();
    // 当月第一天的日期
    var monthFirstDayDate = new Date(year, month, 1);
    // 当月第一天的星期
    var monthFirstDayOfWeek = monthFirstDayDate.getDay();
    if (monthFirstDayOfWeek == 0) {
      monthFirstDayOfWeek = 7;
    }
    // 计算补全第一天第一周相差天数
    day = day + (monthFirstDayOfWeek - 1);
    return Math.ceil(day / 7);
  }
  dataHepler.getMonthWeekDate = function(year, month, day) {
    // 获取这个星期7天的时间
    var list = this.getCalendar(year, month) || [];
    var monthWeek = this.getMonthWeek(year, month, day) || 0;
    return {
      week: monthWeek,
      year: year,
      month: month,
      list: (list[monthWeek - 1] || [])
    };
  }
  dataHepler.getBeforDate = function(year, month, day, dayDiff) {
    // 往前dayDiff天，dayDiff默认为上一周
    dayDiff = dayDiff || 7;
    day = parseInt(day) - parseInt(dayDiff);
    return new Date(year, month, day);
  }
  dataHepler.getAfterDate = function(year, month, day, dayDiff) {
    // 往后dayDiff天，dayDiff不填则为下一周
    dayDiff = dayDiff || 7;
    day = parseInt(day) + parseInt(dayDiff);
    return new Date(year, month, day);
  }

  dataHepler.diffDays = function(date1, date2) {
    dateSpan = date2 - date1;
    dateSpan = Math.abs(dateSpan);
    iDays = dateSpan / (24 * 3600 * 1000); // Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays;
  }

  dataHepler.toDay = function() {
    var d = new Date();
    return dsf.date.parse(dsf.date.format(d, "yyyy-mm-dd"));
  }
  dataHepler.now = function() {
    return new Date();
  }

  dataHepler.formatRangeDateTime = function(sd, ed) {
    var result = ""
    if (sd && ed) {
      var sd = dsf.date.parse(sd);
      var ed = dsf.date.parse(ed);
      if (sd.getFullYear() == ed.getFullYear() && sd.getMonth() == ed.getMonth() && sd.getDate() == ed.getDate()) {
        result = dsf.date.format(sd, "yyyy-mm-dd") + " " + dsf.date.format(sd, "hh:ii") + "-" + dsf.date.format(ed,
          "hh:ii")
      } else {
        result = dsf.date.format(sd, "yyyy-mm-dd hh:ii") + "-" + dsf.date.format(ed, "yyyy-mm-dd hh:ii")
      }
    }

    return result;
  }

  //日期 end
  dsf.extend("date", dataHepler);

  //excel数据格式解析
  dsf.extend("SheetClip", SheetClip);
  //拷贝
  dsf.extend("copyTo", copyTo);

  //数组转字符串
  dsf.extend("arrayToString", function(array, key, split) {
    array = $.isArray(array) ? array : [array];
    var result = _.map(array, key);
    return result.join(split)
  });

  //hash生成
  dsf.extend("hashKey", "$$hash");

  //是否为空对象
  dsf.extend("isEmpty", function(obj) {
    if (obj == undefined) {
      return true;
    }
    if (obj == null) {
      return true;
    }
    if (typeof(obj) == "object") {
      if ($.isEmptyObject(obj)) {
        return true;
      }
      return false;
    } else if ($.isArray(obj)) {
      if (obj.length <= 0) {
        return true;
      }
    }
    if (typeof(obj) == "string") {
      if (obj == "") {
        return true;
      }
    }
    return false;

  })

  function loadSourceFile(_files, options) {
    var opts = {
      pos: "head",
      success: dsf.noop,
      always: dsf.noop
    }
    var scripList = $("script");
    var linkList = $("link");

    if ($.type(options) == "function") {
      opts.always = options;
    } else {
      opts = $.extend(opts, options);
    }
    if ($.type(_files) == "string") {
      _files.split(",");
    }
    var fs = _files.slice(0);
    var classcodes = [];

    /*获取文件类型,后缀名，小写*/
    function GetFileType(url) {
      if (url != null && url.length > 0) {
        if (url.lastIndexOf("?") > 0) {
          url = url.substr(0, url.lastIndexOf("?"));
        }
        return url.substr(url.lastIndexOf(".")).toLowerCase();
      }
      return "";
    }

    function checkExist(url, type) {
      if (url != null && url.length > 0) {
        //验证JS是否存在
        if (type == ".js") {
          var isJsExist = false;
          for (var i = 0; i < scripList.length; i++) {
            var src = scripList[i].getAttribute("src");
            if (src == url) {
              isJsExist = true;
              break;
            }
          }
          return isJsExist;
        } else {
          var isCssExist = false;
          for (var i = 0; i < linkList.length; i++) {
            var src = linkList[i].getAttribute("href");
            if (src == url) {
              isCssExist = true;
              break;
            }
          }
          return isCssExist;
        }
      }
    }

    function fn() {
      var f = fs.shift();
      if (f) {
        var type = GetFileType(f);
        var url = dsf.url.getWebPath(f);
        if (checkExist(url, type)) {
          fn();
          classcodes.push(url)
          return;
        } else {
          var fileObj = null;
          if (type == ".js") {
            fileObj = document.createElement('script');
            fileObj.src = url;
          } else if (type == ".css") {
            fileObj = document.createElement('link');
            fileObj.href = url;
            fileObj.type = "text/css";
            fileObj.rel = "stylesheet";
          } else if (type == ".less") {
            fileObj = document.createElement('link');
            fileObj.href = url;
            fileObj.type = "text/css";
            fileObj.rel = "stylesheet/less";
          }
          fileObj.onload = fileObj.onreadystatechange = function() {
            if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
              opts.success && opts.success(url);
              fn();
              classcodes.push(url)
            }
          }
          fileObj.onerror = function() {
            fn();
          }
          document.getElementsByTagName(opts.pos)[0].appendChild(fileObj);
        }
      } else {
        opts.always && opts.always(classcodes);
      }
    }

    fn();
  }

  //导入js或Css
  dsf.extend("Import", loadSourceFile);

  //下载文件
  dsf.extend("downLoad", function(id, fileName) {
    var url = dsf.url.getWebPath("file/download");
    $('<form action="' + url + '" method="get">' + // action请求路径及推送方法
        '<input type="text" name="files" value="' + id + '"/>' + // id^fileName
        '<input type="text" name="zipName" value="' + (fileName || "") + '"/>' + // 压缩包名称
        '</form>')
      .appendTo('body').submit().remove();
  });

  //获取cookie
  dsf.extend("getCookie", function(name) {
    if (!globalCache["cookie"]) {
      globalCache["cookie"] = {};
    }
    if (!globalCache["cookie"][name]) {
      var strcookie = document.cookie; //获取cookie字符串
      var arrcookie = strcookie.split("; "); //分割
      //遍历匹配
      for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) {
          var val = decodeURI(arr[1]);
          globalCache["cookie"][name] = val;
          return val;
        }
      }
      return "";
    }
    return globalCache["cookie"][name];
  });

  //dom元素工具
  dsf.extend("Dom", {
    scrollToElement: function(element, offset) {
      $('html, body').animate({
        scrollTop: element.offset().top + offset
      }, 500);
    },
    isDOMInner: function(outer, inner) {
      if (document.compareDocumentPosition) {
        var compare = outer.compareDocumentPosition(inner);
        if ((compare & 16)) {
          return true;
        }
      } else if (document.contains) {
        var compare = outer.contains(inner);
        if (compare) {
          return true;
        }
      }
      return false;
    },
    getControlByElem: function(el) {
      el = $(el);
      var ctrl = $(el).data("Object");
      return ctrl;
    },
    getRowIndexByContrl: function(ctrl) {
      if (ctrl.scopeControl == ctrl.root) {
        return;
      } else {
        var splitStr = "_";
        var s = ctrl.caption;
        var startStr = ctrl.scopeControl.caption + splitStr;
        s = s.slice(startStr.length);
        s = s.slice(0, s.indexOf(splitStr));
        if (dsf.isDef(s) && s !== "" && !isNaN(s)) {
          return parseFloat(s);
        }
      }
      return;
    },
    getControlSimpleCaption: function(ctrl) {
      if (ctrl.scopeControl == ctrl.root) {
        return ctrl.caption;
      } else {
        var splitStr = "_";
        var s = ctrl.caption;
        var startStr = ctrl.scopeControl.caption + splitStr;
        s = s.slice(startStr.length);
        s = s.slice(s.indexOf(splitStr) + 1);
        return s;
      }
    }
  });

  dsf.extend("UI", {
    renderDelay: function(type, filter) {
      if (filter) {
        layui.form.render(type, filter);
      } else {
        layui.form.render(type);
      }
    },
    renderSelect: _.debounce(function(callback, filter) {
      this.renderDelay("select", filter);
      if (callback) {
        callback();
      }
    }, 100),
    renderRadio: _.debounce(function(callback, filter) {
      this.renderDelay("radio", filter);
      if (callback) {
        callback();
      }
    }, 100),
    renderCheckbox: _.debounce(function(callback, filter) {
      this.renderDelay("checkbox", filter);
      if (callback) {
        callback();
      }
    }, 100),
    render: function(type, isDelay, callback, filter) {
      if (isDelay) {

        if (type == "select") {
          this.renderSelect(callback, filter);
        } else if (type == "radio") {
          this.renderRadio(callback, filter);
        } else if (type == "checkbox") {
          this.renderCheckbox(callback, filter);
        }
      } else {
        this.renderDelay(type);
      }
    }

  });
  dsf.extend("props", {
    definePrivateProp: function(obj, key, val) {
      Object.defineProperty(obj, key, {
        value: val,
        enumerable: false,
        writable: true,
        configurable: true
      })
    }
  });
  dsf.extend("Math", {
    toChinesNum: function(num) {
      var changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
      var unit = ["", "十", "百", "千", "万"];
      num = parseInt(num);
      var getWan = function(temp) {
        var strArr = temp.toString().split("").reverse();
        var newNum = "";
        for (var i = 0; i < strArr.length; i++) {
          newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[
            strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
      }
      var overWan = Math.floor(num / 10000);
      var noWan = num % 10000;
      if (noWan.toString().length < 4) noWan = "0" + noWan;
      return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    },
    numToEnglishLetter: function(number) {
      var char = "";
      var array = [];
      // Switch ASCII
      var numToStringAction = function(nnum) {
        var num = nnum - 1;
        var a = parseInt(num / 26);
        var b = num % 26;
        array.push(b);
        if (a > 0) {
          numToStringAction(a);
        }
      }
      numToStringAction(number);
      array = array.reverse();
      // Return excel letter: such => C / AA / BBA
      for (var i = 0; i < array.length; i++) {
        char += String.fromCharCode(64 + parseInt(array[i] + 1));
      }
      return char;
    },
    /**
     * 弧度转角度
     */
    r2a: function(r) {
      return 180 / (Math.PI / r);
    },
    /**
     * 角度转弧度
     */
    a2r: function(a) {
      return Math.PI * (a) / 180
    },
    /**
     * 计算两点直线的角度
     */
    getRadina: function(p1, p2, angle) {
      var d = Math.atan((p2.y - p1.y) / (p2.x - p1.x));
      d = d + (angle || 0);

      //修正第二、三象限中的弧度
      if ((p2.y - p1.y > 0 && p2.x - p1.x < 0) || (p2.y - p1.y < 0 && p2.x - p1.x < 0)) {
        d += Math.PI;
      }
      // 修正第一象限弧度
      else if (p2.y - p1.y < 0 && p2.x - p1.x > 0) {
        d += Math.PI * 2;
      }
      // x轴负方向 180度
      if (p2.x < p1.x && p2.y == p1.y) {
        // console.log("x轴负方向");
        d = Math.PI;
      }
      // y轴负方向 270度
      else if (p2.x == p1.x && p2.y < p1.y) {
        d = 1.5 * Math.PI;
      }
      // console.log(d * 180 / Math.PI)
      return d
    },
    //获取以指定点按中心点旋转一定角度后所在的位置
    getRotatedPiont: function(x, y, xcenter, ycenter, angle) {
      var radian = Math.PI * angle / 180;
      var x2 = (x - xcenter);
      var y2 = (y - ycenter)
      var x1 = x2 * Math.cos(radian) - y2 * Math.sin(radian) + xcenter;
      var y1 = x2 * Math.sin(radian) + y2 * Math.cos(radian) + ycenter;
      return {
        x: x1,
        y: y1
      }
    },
    //计算亮距离
    getDistance: function(p1, p2) {
      if (!p1 || !p2) {
        return 0;
      }
      var x_len = p2.x - p1.x;
      var y_len = p2.y - p1.y;
      var len = Math.sqrt(Math.pow(x_len, 2) + Math.pow(y_len, 2));
      return len;
    },

    //坐标系转换
    convertLocalCoordinate:function(el, global, scale) {
      el = $(el);
      var offset = el.offset();
      var top = offset.top;
      var left = offset.left;
      var local = {
        x: 0,
        y: 0
      }
      local.x = global.x - left;
      local.y = global.y - top;
      scale
      if (!dsf.isDef(scale)) {
        scale = 1;
      }
      local.x /= scale;
      local.y /= scale;
      return local;
    }

  });

  dsf.extend("MD5", function(sMessage) {
    function RotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);

      if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        else return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      } else return (lResult ^ lX8 ^ lY8);
    }

    function F(x, y, z) {
      return (x & y) | ((~x) & z);
    }

    function G(x, y, z) {
      return (x & z) | (y & (~z));
    }

    function H(x, y, z) {
      return (x ^ y ^ z);
    }

    function I(x, y, z) {
      return (y ^ (x | (~z)));
    }

    function FF(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));

      return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));

      return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));

      return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));

      return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(sMessage) {
      var lWordCount;
      var lMessageLength = sMessage.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;

      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition));

        lByteCount++;
      }

      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }

    function WordToHex(lValue) {
      var WordToHexValue = "",
        WordToHexValue_temp = "",
        lByte, lCount;

      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }

      return WordToHexValue;
    }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d
    var S11 = 7,
      S12 = 12,
      S13 = 17,
      S14 = 22;
    var S21 = 5,
      S22 = 9,
      S23 = 14,
      S24 = 20;
    var S31 = 4,
      S32 = 11,
      S33 = 16,
      S34 = 23;
    var S41 = 6,
      S42 = 10,
      S43 = 15,
      S44 = 21;

    // Steps 1 and 2. Append padding bits and length and convert to words
    x = ConvertToWordArray(sMessage);

    // Step 3. Initialise
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    // Step 4. Process the message in 16-word blocks
    for (k = 0; k < x.length; k += 16) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
      b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
      a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
      c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
      c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
      a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
      a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
      a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
      a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
      c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
      c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
      b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
      c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
      d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
      c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
      a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
      d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
      b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
      a = AddUnsigned(a, AA);
      b = AddUnsigned(b, BB);
      c = AddUnsigned(c, CC);
      d = AddUnsigned(d, DD);
    }

    // Step 5. Output the 128 bit digest
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
  })

  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var _utf8_encode = function(string) {
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
  var _utf8_decode = function(utftext) {
    var string = "";
    var i = 0;
    var c = 0,
      c1 = 0,
      c2 = 0,
      c3 = 0;
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
  var base64 = {
    encode: function(input) {
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
    },
    decode: function(input) {
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
  }

  dsf.extend('Base64', base64)


  var openUrl = function(mode, url, target) {
    if (mode === 1) {
      window.open(url, target);
    } else {
      location.href = url;
    }
  };
  dsf.extend("openUrl", openUrl);


}(dsf || (dsf = {}));


function setTopSite(target) {
  var win = target.self;
  while (win) {
    try {
      //尝试获取当前窗体的document,如果不可访问则是跨域
      var doc = win.document;
      var parentWin = win.parent;
      if (!parentWin || win == parentWin) {
        break;
      }
      if (parentWin.dsf && parentWin.layui) {
        win = parentWin;
      } else {
        break;
      }
    } catch (ex) {
      break;
    }
  }
  return win;
}


function setLayuiSite(target) {
  var win = target.self;
  while (win) {
    try {
      //尝试获取当前窗体的document,如果不可访问则是跨域
      var doc = win.document;
      var parentWin = win.parent;
      if (!parentWin || win == parentWin) {
        break;
      }
      if (parentWin.dsf && parentWin.layui) {
        win = parentWin;
      } else {
        break;
      }
    } catch (ex) {
      break;
    }
  }
  return win.layui || layui;
}
