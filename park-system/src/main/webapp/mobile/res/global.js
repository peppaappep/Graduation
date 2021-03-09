!(function () {
    //外部函数引入
    if(/DreamSoft/.test(window.navigator.userAgent)){
        if(parent && parent.window && parent.window.cordova){
            let t = new Date().getTime();
            let modulemapper = parent.window.cordova.require("cordova/modulemapper");
            modulemapper.mapModules(window);
            let initLayoutInterval = window.setInterval(function(){
                if(window.golbalGetLayout){
                    window.clearInterval(initLayoutInterval);
                    window.golbalGetLayout();
                    let t2 = new Date().getTime();
                    console.log("load globalGetLayout",t2-t);
                }
            },10);
        }else{
            let script = document.createElement("script");
            let regBaseDir = /[^\{}]*\{(.*)\}[^\}]*/;
            script.type = "text/javascript";
            script.src = window.navigator.userAgent.replace(regBaseDir,'$1')+"/mobile/cordova/android/cordova.js";
            document.head.appendChild(script);
            document.addEventListener('deviceready',onDeviceReady, false);
            function onDeviceReady(){
                console.log('current page cordova ready');
                if(navigator && navigator.splashscreen){
                    navigator.splashscreen.hide();
                }
                window.golbalGetLayout();
            }
        }

    }
    //审核对象注册
    window.ev = {
        evList: [],//验证规则
        evResult: {},//用对象的形式，方便通过key查找，子表对应val为value
        addRule(options, getter) {
            if (typeof getter != 'function') {
                throw '验证方法必须是一个function函数'
            }
            var evObj = {
                key: options.key || Date.now(),
                getter: getter,
                prop: options.prop || "",
                level: options.level==1 ? 1 :0,//0 提示性，1必要性
                errorMsg: options.errorMsg || "",
                rel: options.rel || []
            };
            //是否有重复的key，有则覆盖
            var index = -1;
            for (var i = 0, length = this.evList.length; i < length; i++) {
                if (this.evList[i]['key'] == options['key']) {
                    index = i;
                    break;
                }
            }
            index > -1 ? this.evList[index] = evObj : this.evList.push(evObj);
        },
        /**
         * 执行验证方法
         * @param data 需要验证的数据
         */
        exec(data) {
            if (Object.prototype.toString.call(data) != '[object Object]') {
                throw '验证参数必须是一个object对象'
            }
            this.evResult={};
            for (var n = 0, length = this.evList.length; n < length; n++) {
                //子表特殊处理
                if(this.evList[n]['prop']){
                    if(!data[this.evList[n]['prop']]){
                        throw '不存在的子表名称'
                    }
                    //遍历子表每一个小子表的这一条规则
                    for(var c=0,childLength=data[this.evList[n]['prop']].length;c<childLength;c++){
                        with (data) {
                            //key直接就能访问对象值，而不用data.key
                            var fn = '(' + this.evList[n]['getter'].toString() + ')(' + c + ')';
                            var ok=eval(fn);
                            //初始化子表sub[sub]=[]
                            this.evResult[this.evList[n]['prop']]==undefined&&(this.evResult[this.evList[n]['prop']]=[]);
                            //初始化子表每个小子表下的数组存放对象sub[sub]=[{},{}]
                            !this.evResult[this.evList[n]['prop']][c]&&(this.evResult[this.evList[n]['prop']][c]={});
                            this.evResult[this.evList[n]['prop']][c][this.evList[n]['key']]={
                                ok:ok,
                                level:this.evList[n]['level'],
                                errorMsg:ok?'':this.evList[n]['errorMsg'],
                                pid:this.evList[n]['prop']
                            };
                        }
                    }
                }else{
                    with (data) {
                        //key直接就能访问对象值，而不用data.key
                        var fn = '(' + this.evList[n]['getter'].toString() + ')()';
                        var ok=eval(fn);
                        this.evResult[this.evList[n]['key']]={
                            ok:ok,
                            level:this.evList[n]['level'],
                            errorMsg:ok?'':this.evList[n]['errorMsg']
                        };
                    }
                }
            }
        }
    };
})()
