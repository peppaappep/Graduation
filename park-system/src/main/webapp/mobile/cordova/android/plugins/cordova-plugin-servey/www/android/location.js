cordova.define("dreambox-BaiduLocation", function(require, exports, module) {

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
                    exec(success, error, "BaiduLocation", "execute", [param.method,param.param]);
                },
                getLocation:function(imgUrl,success,error){
                   req.execute({method:"getLocation",param:imgUrl},success,error)
                },
                openLocation:function(imgUrl,success,error){
                                   req.execute({method:"openLocation",param:imgUrl},success,error)
                                }

            };

    module.exports = req;

});
