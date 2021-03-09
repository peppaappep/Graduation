!function(){
    page.event.on(PageEvent.LOADED,function(args){
      //此处编写扩展代码
      
      
    });
    window.setCheckedData = function (v) {
        page.getControl('typeselectpri').value = v;
    }
    window.getCheckedData = function () {
        return page.getControl('typeselectpri').value;
    }
}();