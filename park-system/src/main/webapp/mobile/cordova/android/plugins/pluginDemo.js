cordova.define("pluginId", function(require, exports, module) {
var argscheck = require('cordova/argscheck'),
    exec = require('cordova/exec');


var execute = {
       "":function(){
           exec(success,error, "PluginName", "execute", ["method",{}]);
       }
};

module.exports = execute;

});


