#namespace("school.situation.bigScreen.sql.analysis")

#sql ("findTeamBuildByUnits")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         tb.staff_num AS staffNum
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_team_building AS tb ON f.fill_project_id = tb.situation_tbrw_fill_team_building_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
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
            LEFT JOIN situation_tbrw_fill_service_guarantee AS sg ON f.fill_project_id = sg.situation_tbrw_fill_service_guarantee_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0')
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND sg.ds_deleted = 0
            AND f.ds_deleted = 0
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
            LEFT JOIN situation_tbrw_fill_train AS t ON f.fill_project_id = t.situation_tbrw_fill_train_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0')
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND t.ds_deleted = 0
            AND f.ds_deleted = 0
            AND t.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(firstUnitId),#para(secondUnitId))
#end


#sql("findEducationByUnits")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         stdArrivePercent,
         stdTestSatisfiedPercent,
         (eduTrainNumber + youngTrainNumber + ztytbqs + szpxbqs) AS planTotalClass,
         totalStdNumber AS totalStd
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_education AS e ON f.fill_project_id = e.situation_tbrw_fill_education_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0')
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
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
            LEFT JOIN situation_tbrw_fill_scientific AS s ON f.fill_project_id = s.situation_tbrw_fill_scientific_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0')
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
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
            LEFT JOIN situation_tbrw_fill_team_building AS tb ON f.fill_project_id = tb.situation_tbrw_fill_team_building_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted='0' )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(unitId))
#end


#sql ("findServiceGuaranteeByYears")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         tb.school_size AS schoolSize
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_service_guarantee AS tb ON f.fill_project_id = tb.situation_tbrw_fill_service_guarantee_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0')
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(unitId))
#end


#sql ("findTrainByYears")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         tb.planTotalClass AS planTotalClass,
         tb.totalStd AS totalStd
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_train AS tb ON f.fill_project_id = tb.situation_tbrw_fill_train_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0')
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(unitId))
#end


#sql ("findEducationByYears")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         tb.stdArrivePercent AS stdArrivePercent,
         tb.stdTestSatisfiedPercent AS stdTestSatisfiedPercent,
          (tb.eduTrainNumber + tb.youngTrainNumber + tb.ztytbqs + tb.szpxbqs) AS planTotalClass,
         tb.totalStdNumber AS totalStd
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_education AS tb ON f.fill_project_id = tb.situation_tbrw_fill_education_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(unitId))
#end


#sql ("findScientificByYears")
        SELECT
         n.dsfa_oua_unit_id AS unitId,
         n.unit AS unitName,
         tb.academicArticles AS academicArticles,
         tb.subject_sum AS sumSubjectSum,
         tb.policy_period AS policyPeriod,
         tb.policy_total_people AS totalPolicyPeople
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_scientific AS tb ON f.fill_project_id = tb.situation_tbrw_fill_scientific_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND n.dsfa_oua_unit_id in (#para(unitId))
#end

#sql ("findDistrictParentCity")
        SELECT
            dqjgid AS dqjgid,
            dqjgmc AS dqjgmc,
            px AS px
        FROM teas_zzjgcj
        WHERE  ds_deleted='0' AND dqjgid IN
          #for (id:ids)
                    #(for.first ?"(":"")   #para(id) #(for.last ?")":",")
           #end
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
            LEFT JOIN situation_tbrw_fill_leadership AS l ON f.fill_project_id = l.situation_tbrw_fill_leadership_id
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
            stdTestSatisfiedPercent,
            (localentrucla+unlocalentrucla+foreignentrucla) AS eduAndNoPlanTotalClass
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_education AS e ON f.fill_project_id = e.situation_tbrw_fill_education_id
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
            LEFT JOIN situation_tbrw_fill_train AS t ON f.fill_project_id = t.situation_tbrw_fill_train_id
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted = 0  )
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
            LEFT JOIN situation_tbrw_fill_scientific AS s ON f.fill_project_id = s.situation_tbrw_fill_scientific_id
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
            ROUND( ( t.teacher_master_num + t.teacher_doctor_num ) / t.teacher_num, 2 ) AS doctorScale,
            tt.job_title_value AS jobTitle
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_team_building AS t ON f.fill_project_id = t.situation_tbrw_fill_team_building_id
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
            LEFT JOIN (SELECT * FROM situation_tbrw_fill_team_building_part_time_teacher WHERE ds_deleted = 0 ) AS tt ON t.situation_tbrw_fill_team_building_id = tt.situation_tbrw_fill_team_building_id
            and tt.job_title_value=1
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
            LEFT JOIN situation_tbrw_fill_service_guarantee AS g ON f.fill_project_id = g.situation_tbrw_fill_service_guarantee_id
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