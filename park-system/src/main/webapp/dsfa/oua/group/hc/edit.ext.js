!function(){
    page.event.on(PageEvent.LOADED,function(args){
      //此处编写扩展代码
      
      
       page.getControl("member").event.on('subtable_datachoice', function(d) {
                if (d.data && d.data.length > 0) {
                    for (var i = 0; i < d.data.length; i++) {
                        var atts = d.data[i].Atts;
                        var parentAtts=d.data[i].parentAtts;
                        var repeat = d.ui.value.filter(function(value, index) {
                            //判断部门ID和用户ID的唯一性
                            var deptId=value["dsfa_oua_user_role.dept"]?value["dsfa_oua_user_role.dept"].value:"";
                            var userId=value["dsfa_oua_user_role.dsfa_oua_user_id"]?value["dsfa_oua_user_role.dsfa_oua_user_id"]:"";
                            return deptId == parentAtts.ID && userId == atts.ID;
                        });
                        if (repeat.length <= 0) {
                            var obj = {};
                            obj["dsfa_oua_group_member.rank"] = { "text": atts.rank_text, "value": atts.rank_value };
                            obj["dsfa_oua_group_member.member"] = { "text": atts.NAME, "value": atts.ID };
                            obj["dsfa_oua_group_member.dept"] = { "text": parentAtts.NAME, "value": parentAtts.ID };
                            d.ui.value.push(obj);
                        }
                    }
                    d.ui.reload();
                }

            });
    });
}();