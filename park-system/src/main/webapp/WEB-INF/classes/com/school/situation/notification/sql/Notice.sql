#namespace("school.situation.notification.sql.Notice")

 #sql("findOrganization")
       SELECT
            dqjgid AS dsfa_oua_unit_id ,
            dqjgmc AS `name`,
            qtid AS treeinfo_globalid
        FROM
            teas_zzjgcj
        WHERE
            ds_deleted = 0
 #end

 #sql("verify")
        SELECT
            COUNT( 1 ) AS sum
        FROM
            situation_notice_report_manage
        WHERE
            `year_value` = #para(yearValue)
           #if(id != null && id !='')
             AND situation_notice_report_manage_id != #para(id)
           #end
           	AND ds_deleted = 0
 #end

 #sql("updateNoticeEndDate")
     UPDATE situation_tbrw_notice
        SET activeDateEnd = #para(endDate)
        WHERE
            situation_notice_report_manage_id = #para(mId)
 #end

 #sql("findNotices")
        SELECT
            situation_tbrw_notice_id AS id,
            latestInDate,
            latestCirculateLog,
            taskStatus_text,
            taskStatus_value,
            approve_status,
            current_process_link,
            linkId,
            `handler`,
            initial_originatr_id,
            initial_originatr,
            reset_flag,
            annual_value
        FROM
            situation_tbrw_notice
        WHERE
            situation_notice_report_manage_id = #para(id)
            AND ds_deleted = 0
 #end


 #sql ("batchReset")
     UPDATE situation_tbrw_notice
        SET latestInDate = NULL,
        latestCirculateLog = NULL,
        taskStatus_text = #para(taskStatus),
        taskStatus_value = 'NOT_SUBMITTED',
        approve_status = NULL,
        reset_flag = 1
        WHERE
            situation_tbrw_notice_id IN (
                #for(id:ids)
                    #(for.index > 0 ? ", " : "")"#(id)"
                #end
                )
 #end

 #sql ("findWfFirstNode")
     SELECT
            dsfa_wf_process_link_id AS sCurLinkID,
            dsfa_wf_process_id AS sPID
        FROM
            dsfa_wf_process_link
        WHERE
            dsfa_wf_process_id = (
            SELECT
                dsfa_wf_process_id
            FROM
                dsfa_wf_process_link
            WHERE
            dsfa_wf_process_link_id IN ( SELECT linkId FROM situation_tbrw_notice WHERE situation_tbrw_notice_id = #para(noticeId)))
        ORDER BY
            create_time,
            receivetime
            LIMIT 0,1
 #end

 #sql ("modifyNotice")
    UPDATE situation_notice_report_manage
    SET claim = #para(claim),
    end_date = #para(endDate)
    WHERE
        situation_notice_report_manage_id = #para(id)
 #end

#end