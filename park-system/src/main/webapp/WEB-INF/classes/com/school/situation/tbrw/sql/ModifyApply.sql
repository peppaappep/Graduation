#namespace("school.situation.tbrw.sql.ModifyApply")
  #sql("updateStatus")

    UPDATE situation_tbrw_modify_apply
        SET
            #if(approveStatus)
                approveStatus = #para(approveStatus),
            #end
            #if(approve_remark)
                approve_remark = #para(approve_remark),
            #end
            ds_update_time = NOW(),
            ds_update_user_id = #para(userId),
            ds_update_user_name = #para(userName)
        WHERE situation_tbrw_modify_apply_id = #para(id)
  #end


#end