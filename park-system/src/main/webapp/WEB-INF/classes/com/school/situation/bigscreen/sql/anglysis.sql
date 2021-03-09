#namespace("school.situation.bigscreen.sql.anglysis")

#sql ("findTeamBuildByUnits")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         tb.staff_num AS staffNum
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_team_building AS tb ON f.situation_tbrw_notice_fillTask_id = tb.fillTaskId
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(firstUnitId),#para(secondUnitId))
#end




#sql ("findServiceGuaranteeByUnits")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         sg.school_size AS schoolSize
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_service_guarantee AS sg ON f.situation_tbrw_notice_fillTask_id = sg.fillTaskId
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND sg.ds_deleted = 0
            AND sg.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(firstUnitId),#para(secondUnitId))
#end

#sql("findTrainByUnits")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         planTotalClass,
         totalStd
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_train AS t ON f.situation_tbrw_notice_fillTask_id = t.fillTaskId
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND t.ds_deleted = 0
            AND t.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(firstUnitId),#para(secondUnitId))
#end


#sql("findEducationByUnits")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         stdArrivePercent,
         stdTestSatisfiedPercent
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_education AS e ON f.situation_tbrw_notice_fillTask_id = e.fillTaskId
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND e.ds_deleted = 0
            AND e.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(firstUnitId),#para(secondUnitId))
#end

#sql ("findScientificByUnits")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         academicArticles,
         subject_sum AS subjectSum,
         policy_period AS policyPeriod,
         policy_total_people AS totalPeople
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_scientific AS s ON f.situation_tbrw_notice_fillTask_id = s.fillTaskId
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND s.ds_deleted = 0
            AND s.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(firstUnitId),#para(secondUnitId))
#end


#sql ("findTeamBuildByYears")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         tb.staff_num AS staffNum
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_team_building AS tb ON f.situation_tbrw_notice_fillTask_id = tb.fillTaskId
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(unitId))
#end

#sql("singleOrgLeaderMonitor")
        SELECT
            z.dqjgmc,
            z.dqjgid,
            z.dqjgjb_text,
            z.dqjgjb_value,
            leaderLectureParcent,
            leaderNumber
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_leadership AS l ON f.situation_tbrw_notice_fillTask_id = l.fillTaskId
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted = 0 )
            AND z.dqjgid = #para(unitId)
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'OL'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND l.ds_deleted = 0
            AND z.ds_deleted = 0
            AND l.save_flag = 1
            AND z.dqjgjb_value > 1

#end

#sql("singleEducationMonitor")
        SELECT
            z.dqjgmc,
            z.dqjgid,
            z.dqjgjb_text,
            z.dqjgjb_value,
            theoryPercent,
            stdTestSatisfiedPercent
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_education AS e ON f.situation_tbrw_notice_fillTask_id = e.fillTaskId
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted = 0  )
            AND  z.dqjgid = #para(unitId)
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'ET'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND e.ds_deleted = 0
            AND z.ds_deleted = 0
            AND e.save_flag = 1
            AND z.dqjgjb_value > 1
#end


#sql("singleTrainingMonitor")
        SELECT
            z.dqjgmc,
            z.dqjgid,
            z.dqjgjb_text,
            z.dqjgjb_value,
            eduAndNoPlanTotalClass
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_train AS t ON f.situation_tbrw_notice_fillTask_id = t.fillTaskId
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted = 0 )
            AND z.dqjgid = #para(unitId)
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'TS'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND t.ds_deleted = 0
            AND z.ds_deleted = 0
            AND t.save_flag = 1
            AND z.dqjgjb_value > 1
#end


#sql ("singleScientificMonitor")
        SELECT
            z.dqjgmc,
            z.dqjgid,
            z.dqjgjb_text,
            z.dqjgjb_value,
            ( national_issues + provincial_subject + hall_subject ) AS subjects,
            policy_period AS policyPeriod
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_scientific AS s ON f.situation_tbrw_notice_fillTask_id = s.fillTaskId
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted = 0 )
            AND z.dqjgid = #para(unitId)
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'SRC'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND s.ds_deleted = 0
            AND z.ds_deleted = 0
            AND s.save_flag = 1
            AND z.dqjgjb_value > 1
#end


#sql ("singleTeamMonitor")
        SELECT
            z.dqjgmc,
            z.dqjgid,
            z.dqjgjb_text,
            z.dqjgjb_value,
            t.teacher_scale_staff AS teacherScaleStaff,
            ROUND( ( t.teacher_master_num + t.teacher_doctor_num ) / t.teacher_num, 1 ) AS doctorScale,
            tt.job_title_value AS jobTitle
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_team_building AS t ON f.situation_tbrw_notice_fillTask_id = t.fillTaskId
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
            LEFT JOIN situation_tbrw_fill_team_building_part_time_teacher AS tt ON t.situation_tbrw_fill_team_building_id = tt.situation_tbrw_fill_team_building_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted = 0  )
            AND z.dqjgid = #para(unitId)
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'TC'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND t.ds_deleted = 0
            AND z.ds_deleted = 0
            AND t.save_flag = 1
            AND tt.ds_deleted = 0
            AND z.dqjgjb_value > 1
#end


#sql ("singleServerMonitor")
        SELECT
            z.dqjgmc,
            z.dqjgid,
            z.dqjgjb_text,
            z.dqjgjb_value,
            school_size AS  schoolSize,
            school_under_size AS schoolUnderSize,
            dormitory_room_num AS dormitoryRoomNum,
            dormitory_beds_num AS dormitoryBedsNum,
            logistics_canteen_table_num AS  canteenTableNum
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_service_guarantee AS g ON f.situation_tbrw_notice_fillTask_id = g.fillTaskId
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted = 0)
            AND z.dqjgid = #para(unitId)
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'SG'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND g.ds_deleted = 0
            AND z.ds_deleted = 0
            AND g.save_flag = 1
            AND z.dqjgjb_value > 1

#end

#end