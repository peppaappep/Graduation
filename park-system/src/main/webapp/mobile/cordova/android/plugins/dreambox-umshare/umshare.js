cordova.define("dreambox-umshare", function(require, exports, module) {

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
                    exec(success, error, "UMShare", "execute", [param.method,param.param]);
                },
                shareText:function(text,success,error){
                    req.execute({method:"shareText",param:{"text":text}},success,error)
                },
                 shareHtml:function(params,success,error){
                     req.execute({method:"shareHtml",param:params},success,error)
                 },
                   shareImgUrl:function(imgUrl,success,error){
                       req.execute({method:"shareImgUrl",param:{"imgUrl":imgUrl}},success,error)
                   }
            };

    module.exports = req;

});
