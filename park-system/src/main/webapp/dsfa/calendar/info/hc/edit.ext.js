!function(){
    page.event.on(PageEvent.LOADED,function(args){
      //此处编写扩展代码
      dsf.http.request('http://localhost:8080/dsfa/calendar/test2',{
	"dsfaCalendarInfoId": "1",
	"users": [
		{
			"dsfaCalendarUserId": "11"
		},
		{
			"dsfaCalendarUserId": "22"
		}
	]
},"POST").done(function(response){debugger}).error(function(response){debugger}).always(function(){debugger}).exec()
    });
}();