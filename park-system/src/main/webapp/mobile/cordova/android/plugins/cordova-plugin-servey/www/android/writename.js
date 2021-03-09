cordova.define("dreambox-ESurvey", function(require, exports, module) {

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
                    exec(success, error, "ESurvey", "execute", [param.method,param.param]);
                },

                writeName:function(imgUrl,success,error){
                req.execute({method:"writeName",param:imgUrl},success,error)
                                }
            };

    module.exports = req;

});
