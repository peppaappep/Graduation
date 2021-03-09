!function(){
    page.event.on(PageEvent.LOADED,function(args){
      //此处编写扩展代码
      if(dsf.url.queryString("update")=="1"){
		  page.getControl("type").hide();
	  }
    });
}();
