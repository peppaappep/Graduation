cordova.define("dreambox-offline", function(require, exports, module) {

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
                    exec(success, error, "OffLinePlugin", "execute", [param.method,param.param]);
                },
                init:function(param,success,error){
                    req.execute({method:"init",param:param},success,error)
                },
                query:function(param,success,error){
                    req.execute({method:"query",param:param},success,error)
                },
                save:function(param,success,error){
                    req.execute({method:"save",param:param},success,error)
                }
            };

    module.exports = req;

});
