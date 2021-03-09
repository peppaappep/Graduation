cordova.define("dreambox-version", function(require, exports, module) {

    var  exec = require('cordova/exec');
    var req = {
                execute:function(arg,success,error) {
                    var param = {
                        method:"",
                        param:{}
                    }
                    $.extend(param,arg);
                    if(!param.method){
                        alert("请指定方法名!");
                        return;
                    }
                    exec(success, error, "VersionPlugin", "execute", [param.method,param.param]);
                },
                getCurrentVersion:function(success,error){
                    req.execute({method:"getCurrentVersion"},success,error)
                }
            };

    module.exports = req;

});
