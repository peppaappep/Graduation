!function(){
    page.event.on(PageEvent.LOADED,function(args){
      //此处编写扩展代码
      
      
    });
    window.setCheckedData = function (v) {
        for (var i in v) {
            v[i]._id = v[i]["_id"];
            v[i].url = v[i]["url"];
            v[i].name = v[i]["name"];
        }
        page.getControl('typeselectpri').value = v;
    }
    window.getCheckedData = function () {
        return page.getControl('typeselectpri').value;
    }
}();
