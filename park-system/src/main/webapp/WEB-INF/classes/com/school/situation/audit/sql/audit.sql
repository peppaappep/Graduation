#namespace("school.situation.audit.sql.audit")
  #sql("findUnitLevel")
       SELECT
            dqjgid AS unit_id,
            dqjgjb_value AS LEVEL
        FROM
            teas_zzjgcj
        WHERE
            dqjgid = #para(id);
  #end

  #sql("findSuperiorTreeInfoId")
        SELECT
           treeinfo_globalid
        FROM
            dsfa_oua_unit
            WHERE INSTR(#para(GID),treeinfo_globalid) > 0
        and level_value = 0 and
        ds_deleted = 0 ORDER BY LENGTH(treeinfo_globalid) DESC LIMIT 1,1;
  #end

  #sql("findAllDepartment")
        SELECT
            dsfa_oua_unit_id,
            level_value,
            `name`,
            treeinfo_globalid
        FROM
            dsfa_oua_unit
        WHERE
            INSTR( treeinfo_globalid, #para(globalId))
            AND treeinfo_globalid != #para(globalId)
            AND ds_deleted = 0
  #end


  #sql("findSubDeptartment")
        SELECT
            dsfa_oua_unit_id,
            level_value,
            `name`,
            treeinfo_globalid
        FROM
            dsfa_oua_unit
        WHERE
            treeinfo_globalid
        REGEXP#para(globalIds) AND level_value!=0 AND ds_deleted = 0;
  #end


  #sql("findReviewer")
        SELECT
            us.dsfa_oua_user_id as userId,
            us.`name` as userName
        FROM
            dsfa_oua_unit AS unit
            LEFT JOIN dsfa_oua_user_userdept dept ON dept.dsfa_oua_unit_id = unit.dsfa_oua_unit_id and dept.ds_deleted='0'
            LEFT JOIN dsfa_oua_user AS us ON us.dsfa_oua_user_id = dept.dsfa_oua_user_id
            LEFT JOIN dsfa_oua_user_role role ON role.dsfa_oua_user_id = us.dsfa_oua_user_id and role.ds_deleted='0'
        WHERE
             unit.level_value != 0
             and  us.ds_deleted = 0
            AND role.dsfa_oua_role_id = #para(auditRoleId)
            #if(unitIds != null && unitIds != '')
                AND unit.dsfa_oua_unit_id in (
                    #for(unitId:unitIds)
                         #(for.index > 0 ? ", " : "")"#(unitId)"
                    #end
                )
            #end
  #end

  #sql("findSendUsers")
        SELECT
            dsfa_oua_user_id as sID ,
	        `name` as  sName
        FROM
            dsfa_oua_user
        WHERE
             #if(userIds != null && userIds != '')
                dsfa_oua_user_id in (
                #for(id:userIds)
                    #(for.index > 0 ? ", " : "")"#(id)"
                #end
                )
            #end
            and  ds_deleted = 0
  #end

  #sql("findNextLink")
        SELECT
            dsfa_wf_process_link_id as linkId,
            dsfa_wf_process_id as processId,
            objectid,
            objectname
        FROM
            dsfa_wf_process_link
        WHERE
            parentlinkid = #para(parentlinkid)
            ORDER BY create_time DESC LIMIT 0,1;
  #end

  #sql ("closeCurTodo")
    UPDATE dsfa_todo
    SET status_value = 2
    WHERE
        dsfa_todo_id = #para(id)
  #end

  #sql("closeFirstTodo")
   update  dsfa_todo
    SET status_value = 2
    WHERE
        handleuser_value = #para(userId)
        AND objectid = #para(mId)
  #end

  #sql ("loadModifyRecord")
    SELECT
        operation_user AS operationUser,
        DATE_FORMAT( modify_time, '%Y-%m-%d %H:%i:%s' ) AS modifyTime,
        operation_type AS operationType,
        `name` AS fieldName,
        old_value AS oldValue,
        new_value AS newValue
    FROM
        situation_trbw_modify_record
    WHERE
        fill_task_id = #para(fillTaskId)
    ORDER BY
        modify_time DESC LIMIT #para(pageIndex) ,#para(pageSize)
  #end

  #sql("updateReset")
     UPDATE situation_tbrw_notice
        SET reset_flag = 0
        WHERE
            situation_tbrw_notice_id = #para(noticeId)
  #end

#end