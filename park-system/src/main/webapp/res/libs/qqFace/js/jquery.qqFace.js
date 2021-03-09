// QQ表情插件
jQuery.fn.extend({
	setCaret: function(){
		if(!$.browser.msie) return; 
		var initSetCaret = function(){ 
			var textObj = $(this).get(0); 
			textObj.caretPos = document.selection.createRange().duplicate(); 
		}; 
		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
	}, 
	insertAtCaret: function(textFeildValue){
		var textObj = $(this).get(0);
        var str = textFeildValue.replace(/\[em_([0-9]*)\]/g,'<img src="arclist/$1.gif" border="0" />');
        if(textObj.innerHTML){
            textObj.innerHTML+= str
        }else{
            textObj.innerHTML= str
        }
        $("#show").html( textObj.innerHTML  );
	}
});
