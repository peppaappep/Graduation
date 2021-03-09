cordova.define("dreambox-netChange", function(require, exports, module) {

    var  exec = require('cordova/exec');
    var receiverCallback = function(param){//默认网络变化监听回调
    }
    window.__netChange = function(params){
        receiverCallback(params);
    }

    var req = {
        netChangeReceiver:function(callback){//网络监听
            receiverCallback = callback;
        }
    };

    module.exports = req;

});
