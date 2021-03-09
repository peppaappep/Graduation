cordova.define("org.apache.cordova.toast.ToastPlugin", function(require, exports, module) {
var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');


var execute = {
       "show":function(text){
           //1、成功回调函数 2、错误回调函数 3、接口方提供的对象名称  4、插件方法 5、参数 是一个数据组
           exec(null,null, "ToastPlugin", "execute", ["show",{text:text}]);
       }
};

module.exports = execute;

});


