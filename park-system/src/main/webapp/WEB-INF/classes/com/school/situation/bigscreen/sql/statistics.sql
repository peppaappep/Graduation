#namespace("school.situation.bigScreen.sql.statistics")

#sql ("orgLeaderStatistics")
        SELECT
            cast(AVG(leaderLectureParcent) AS decimal(15,2)) AS leaderLectureParcent,
            SUM(governmentNumber) AS governmentNumber,
            SUM(partySchoolNumber) AS partySchoolNumber,
            SUM(leaderNumber) AS leaderNumber
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_leadership AS l ON f.fill_project_id = l.situation_tbrw_fill_leadership_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            AND n.dsfa_oua_unit_id IN (
            SELECT dqjgid FROM teas_zzjgcj
            WHERE ds_deleted = 0
                 #if(statisticsTyp == 2)
                    AND (pid = #para(unitId)  OR dqjgid = #para(unitId))
                 #end
                 ORDER BY dqjgjb_value ASC
            )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'OL'
            AND f.completeStatus_value ='Y'
	        AND f.ds_deleted = 0
	        AND l.ds_deleted = 0
	        AND l.save_flag = 1
#end

#sql ("trainStatistics")
        SELECT
            SUM( totalClass ) AS totalClass,
            SUM( planTotalClass ) AS planTotalClass,
            SUM( planTotalStd ) AS planTotalStd,
            SUM( eduAndNoPlanTotalClass ) AS eduAndNoPlanTotalClass,
            SUM( eduAndNoPlanTotalStd ) AS eduAndNoPlanTotalStd
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_train AS t ON f.fill_project_id = t.situation_tbrw_fill_train_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years)  and ds_deleted='0' )
            AND n.dsfa_oua_unit_id IN (
            SELECT dqjgid FROM teas_zzjgcj
            WHERE ds_deleted = 0
                 #if(statisticsTyp == 2)
                    AND (pid = #para(unitId)  OR dqjgid = #para(unitId))
                 #end
                 ORDER BY dqjgjb_value ASC
            )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'TS'
            AND f.completeStatus_value ='Y'
            AND f.ds_deleted = 0
            AND t.ds_deleted = 0
            AND t.save_flag = 1
#end

#sql ("educationStatistics")
        SELECT
            SUM(teacher_base_sum) AS teacherBaseSum,
           	AVG(stdTestSatisfiedPercent) AS stdTestSatisfiedPercent,
           	SUM(eduTrainNumber) + SUM(youngTrainNumber) +SUM(ztytbqs) +SUM(szpxbqs) AS planTotalClass,
           	SUM(jxbxys) + SUM(pxbxys) +SUM(ztytbxys) +SUM(szpxbxys) AS planTotalStd,
           	SUM(localentrucla) + SUM(unlocalentrucla) +SUM(foreignentrucla)  AS eduAndNoPlanTotalClass,
           	SUM(localentrustu) + SUM(unlocalentrustu) +SUM(foreignentrustu)  AS eduAndNoPlanTotalStd,
           	SUM(eduTrainNumber) + SUM(youngTrainNumber) +SUM(ztytbqs) +SUM(szpxbqs)+SUM(localentrucla) + SUM(unlocalentrucla) +SUM(foreignentrucla) AS totalClass
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_education AS e ON f.fill_project_id = e.situation_tbrw_fill_education_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            AND n.dsfa_oua_unit_id IN (
            SELECT dqjgid FROM teas_zzjgcj
            WHERE ds_deleted = 0
                 #if(statisticsTyp == 2)
                    AND (pid = #para(unitId)  OR dqjgid = #para(unitId))
                 #end
                 ORDER BY dqjgjb_value ASC
            )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'ET'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND e.ds_deleted = 0
            AND e.save_flag = 1
#end

#sql ("scientificStatistics")
        SELECT
            SUM(academicArticles ) AS academicArticles ,
            SUM(research_sum) AS researchSum,
            SUM(subject_sum) AS subjectSum,
            SUM(policy_period) AS policyPeriod,
            SUM(policy_total_people) AS policyTotalPeople,
            SUM(publicationStatus) AS publicationStatus
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_scientific AS s ON f.fill_project_id = s.situation_tbrw_fill_scientific_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            AND n.dsfa_oua_unit_id IN (
            SELECT dqjgid FROM teas_zzjgcj
            WHERE ds_deleted = 0
                 #if(statisticsTyp == 2)
                    AND (pid = #para(unitId)  OR dqjgid = #para(unitId))
                 #end
                 ORDER BY dqjgjb_value ASC
            )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'SRC'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND s.ds_deleted = 0
            AND s.save_flag = 1
#end

#sql ("teamBuildingStatistics")
        SELECT
            SUM( org_num ) AS orgNum,
            SUM( staff_num ) AS staffNum,
            SUM( teacher_num ) AS teacherNum,
            SUM( assistant_high ) + SUM( main_high ) AS assistantHigh,
            SUM( first_level ) + SUM( second_level ) AS firstevel,
            SUM( teacher_doctor_num ) + SUM( teacher_master_num ) AS teacherDoctorNum
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_team_building AS t ON f.fill_project_id = t.situation_tbrw_fill_team_building_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years)  and ds_deleted='0' )
            AND n.dsfa_oua_unit_id IN (
            SELECT dqjgid FROM teas_zzjgcj
            WHERE ds_deleted = 0
                 #if(statisticsTyp == 2)
                    AND (pid = #para(unitId)  OR dqjgid = #para(unitId))
                 #end
                 ORDER BY dqjgjb_value ASC
            )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'TC'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND t.ds_deleted = 0
            AND t.save_flag = 1
#end


#sql ("guaranteeStatistics")
        SELECT
            cast(SUM(school_size) AS decimal(15,2)) AS schoolSize,
            SUM( school_under_size ) AS schoolUnderSize,
            SUM( classroom_num ) AS classroomNum,
            SUM( dormitory_beds_num ) AS dormitoryBedsNum,
            SUM(zxjf)+SUM(gyjf)+SUM(jxky)+SUM(xxhjs)+SUM(jbjs) AS financialAllocationsTotal
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_service_guarantee AS s ON f.fill_project_id = s.situation_tbrw_fill_service_guarantee_id
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            AND n.dsfa_oua_unit_id IN (
            SELECT dqjgid FROM teas_zzjgcj
            WHERE ds_deleted = 0
                 #if(statisticsTyp == 2)
                    AND (pid = #para(unitId)  OR dqjgid = #para(unitId))
                 #end
                 ORDER BY dqjgjb_value ASC
            )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.fillProject_value = 'SG'
            AND f.completeStatus_value = 'Y'
            AND f.ds_deleted = 0
            AND s.ds_deleted = 0
            AND s.save_flag = 1
#end

#sql("orgLeaderMonitor")
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
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0')
            #if(statisticsTyp == 2)
            AND (z.pid = #para(unitId)  OR z.dqjgid = #para(unitId))
            #end
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

#sql("educationMonitor")
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
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0')
            #if(statisticsTyp == 2)
            AND (z.pid = #para(unitId)  OR z.dqjgid = #para(unitId))
            #end
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

#sql("trainingMonitor")
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
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            #if(statisticsTyp == 2)
            AND (z.pid = #para(unitId)  OR z.dqjgid = #para(unitId))
            #end
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

#sql ("scientificMonitor")
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
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            #if(statisticsTyp == 2)
            AND (z.pid = #para(unitId)  OR z.dqjgid = #para(unitId))
            #end
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

#sql ("teamMonitor")
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
            LEFT JOIN (SELECT * FROM situation_tbrw_fill_team_building_part_time_teacher WHERE ds_deleted = 0 )  AS tt ON t.situation_tbrw_fill_team_building_id = tt.situation_tbrw_fill_team_building_id
           and tt.job_title_value=1
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            #if(statisticsTyp == 2)
            AND (z.pid = #para(unitId)  OR z.dqjgid = #para(unitId))
            #end
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

#sql ("serverMonitor")
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
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) and ds_deleted='0' )
            #if(statisticsTyp == 2)
            AND (z.pid = #para(unitId)  OR z.dqjgid = #para(unitId))
            #end
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