cordova.define("dreambox-gps", function(require, exports, module) {


var  exec = require('cordova/exec');

 var req ={
 	"getLocation":function(success,error){
 		var param = {method:"getLocation"};
 		req.excute(param,success,error);
 	},
 	"excute":function(arg,success,error) {
        var param = {
            method:"",
            param:{}
        }
        $.extend(param,arg);
        if(!param.method){
            alert("请指定方法名!");
            return;
        }
        exec(success, error, "BDGPS", "excute", [param.method,param.param]);
    }
 }
 
 module.exports = req;

});
