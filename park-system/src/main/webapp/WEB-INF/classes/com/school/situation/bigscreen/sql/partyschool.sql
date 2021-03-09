#namespace("school.situation.bigScreen.sql.partySchool")

#sql ("leaderIndexAnglysis")
        SELECT
            n.dsfa_oua_unit_id AS unitId,
            n.unit AS unitName,
            m.year_value AS year,
            z.dqjgjb_value AS level,
            tb.leaderLectureParcent,
            tb.leaderNumber
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN teas_zzjgcj   AS z ON n.dsfa_oua_unit_id = z.dqjgid
            LEFT JOIN situation_notice_report_manage AS m ON m.situation_notice_report_manage_id = n.situation_notice_report_manage_id
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_leadership AS tb ON f.fill_project_id = tb.situation_tbrw_fill_leadership_id
        WHERE
            n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND m.ds_deleted = 0
            AND z.ds_deleted = 0
            AND f.ds_deleted = 0
            AND m.year_value = #para(years)
            AND n.dsfa_oua_unit_id = #para(unitId)
        ORDER BY
            m.year_value ASC
#end

#sql ("educationIndexAnglysis")
        SELECT
            n.dsfa_oua_unit_id AS unitId,
            n.unit AS unitName,
            m.year_value AS year,
            z.dqjgjb_value AS level,
            tb.theoryPercent,
            tb.stdTestSatisfiedPercent,
            (tb.eduTrainNumber + tb.youngTrainNumber + tb.ztytbqs + tb.szpxbqs) AS planTotalClass,
            (tb.localentrucla + tb.unlocalentrucla + tb.foreignentrucla) AS unPlanTotalClass,
            (tb.eduTrainNumber + tb.youngTrainNumber + tb.ztytbqs + tb.szpxbqs + tb.localentrucla + tb.unlocalentrucla + tb.foreignentrucla) AS totalClass,
            (tb.jxbxys + tb.pxbxys + tb.ztytbxys + tb.szpxbxys) AS planTotalClassStudentSum,
            (tb.localentrustu + tb.unlocalentrustu + tb.foreignentrustu) AS unPlanTotalClassStudentSum,
            (tb.jxbxys + tb.pxbxys + tb.ztytbxys + tb.szpxbxys + tb.localentrustu + tb.unlocalentrustu + tb.foreignentrustu) AS totalClassStudentSum
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN teas_zzjgcj   AS z ON n.dsfa_oua_unit_id = z.dqjgid
            LEFT JOIN situation_notice_report_manage AS m ON m.situation_notice_report_manage_id = n.situation_notice_report_manage_id
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_education AS tb ON f.fill_project_id = tb.situation_tbrw_fill_education_id
        WHERE
            n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND z.ds_deleted = 0
            AND m.ds_deleted = 0
            AND f.ds_deleted = 0
            AND m.year_value = #para(years)
            AND n.dsfa_oua_unit_id = #para(unitId)
        ORDER BY
            m.year_value ASC
#end

#sql ("trainIndexAnglysis")
        SELECT
            n.dsfa_oua_unit_id AS unitId,
            n.unit AS unitName,
            m.year_value AS year,
            z.dqjgjb_value AS level,
            tb.eduAndNoPlanTotalClass,
            tb.planTotalClass,
            (tb.noPlanDepClass + tb.noPlanOutClass) AS unPlanTotalClass,
            (tb.eduPartyClass + tb.eduOtherClass + tb.eduOverseasClass) AS academicEducation,
            tb.planTotalStd AS planTotalClassStudentSum,
            tb.totalStd AS totalClassStudentSum,
            (tb.noPlanDepStd + tb.noPlanOutStd) AS unPlanTotalClassStudentSum,
            (tb.eduPartyStd + tb.eduOtherStd + tb.eduOverseasStd) AS academicEducationStudentSum,
            tb.totalClass
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN teas_zzjgcj   AS z ON n.dsfa_oua_unit_id = z.dqjgid
            LEFT JOIN situation_notice_report_manage AS m ON m.situation_notice_report_manage_id = n.situation_notice_report_manage_id
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_train AS tb ON f.fill_project_id = tb.situation_tbrw_fill_train_id
        WHERE
            n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND m.ds_deleted = 0
            AND z.ds_deleted = 0
            AND f.ds_deleted = 0
            AND m.year_value = #para(years)
            AND n.dsfa_oua_unit_id = #para(unitId)
        ORDER BY
            m.year_value ASC
#end

#sql("scientificIndexAnglysis")
         SELECT
            n.dsfa_oua_unit_id AS unitId,
            n.unit AS unitName,
            m.year_value AS year,
            z.dqjgjb_value AS level,
            tb.academicArticles,
            tb.research_sum AS researchSum,
            tb.subject_sum AS subjectSum,
            (tb.national_issues + tb.provincial_subject + tb.hall_subject) AS hallLevelSubject,
            tb.policy_period AS policyPeriod
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN teas_zzjgcj   AS z ON n.dsfa_oua_unit_id = z.dqjgid
            LEFT JOIN situation_notice_report_manage AS m ON m.situation_notice_report_manage_id = n.situation_notice_report_manage_id
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_scientific AS tb ON f.fill_project_id = tb.situation_tbrw_fill_scientific_id
        WHERE
            n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND m.ds_deleted = 0
            AND z.ds_deleted = 0
            AND f.ds_deleted = 0
            AND m.year_value = #para(years)
            AND n.dsfa_oua_unit_id = #para(unitId)
        ORDER BY
            m.year_value ASC

#end

#sql ("teamBuildIndexAnglysis")
        SELECT
            n.dsfa_oua_unit_id AS unitId,
            n.unit AS unitName,
            m.year_value AS year,
            z.dqjgjb_value AS level,
            ROUND (( tb.teacher_master_num + tb.teacher_doctor_num ) / tb.teacher_num, 2 ) AS doctorScale,
            tt.job_title_value AS jobTitle,
            tb.staff_num AS staffNum,
            tb.staff_avg_age AS staffAvgAge,
            tb.staff_admin_num AS staffAdminNum,
            ROUND(tb.staff_admin_num/tb.staff_num,2) AS  staffAdminScale,
            tb.staff_admin_avg_age AS staffAdminAvgAge,
            tb.staff_teacher_num AS staffTeacherNum,
            tb.teacher_scale_staff AS teacherScaleStaff,
            tb.staff_teacher_avg_age AS staffTeacherAvgAge
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN teas_zzjgcj   AS z ON n.dsfa_oua_unit_id = z.dqjgid
            LEFT JOIN situation_notice_report_manage AS m ON m.situation_notice_report_manage_id = n.situation_notice_report_manage_id
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_team_building AS tb ON f.fill_project_id = tb.situation_tbrw_fill_team_building_id
            LEFT JOIN  (SELECT * FROM situation_tbrw_fill_team_building_part_time_teacher WHERE ds_deleted = 0)  AS tt ON tb.situation_tbrw_fill_team_building_id = tt.situation_tbrw_fill_team_building_id
        WHERE
            n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND m.ds_deleted = 0
            AND z.ds_deleted = 0
            AND f.ds_deleted = 0
            AND m.year_value = #para(years)
            AND n.dsfa_oua_unit_id = #para(unitId)
        ORDER BY
            m.year_value ASC
#end

#sql ("serviceGuaranteeIndexAnglysis")
        SELECT
            n.dsfa_oua_unit_id AS unitId,
            n.unit AS unitName,
            m.year_value AS year,
            z.dqjgjb_value AS level,
            tb.school_size AS schoolSize,
            tb.school_under_size AS schoolUnderSize,
            tb.dormitory_room_num AS dormitoryRoomNum,
            tb.dormitory_beds_num AS dormitoryBedsNum,
            tb.logistics_canteen_table_num AS logisticsCanteenTableNum,
            tb.classroom_size AS classRoomSize,
            tb.financial_allocations_total AS totalAllocations

        FROM
            situation_tbrw_notice AS n
            LEFT JOIN teas_zzjgcj   AS z ON n.dsfa_oua_unit_id = z.dqjgid
            LEFT JOIN situation_notice_report_manage AS m ON m.situation_notice_report_manage_id = n.situation_notice_report_manage_id
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN situation_tbrw_fill_service_guarantee AS tb ON f.fill_project_id = tb.situation_tbrw_fill_service_guarantee_id
        WHERE
            n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.completeStatus_value = 'Y'
            AND tb.ds_deleted = 0
            AND tb.save_flag = 1
            AND m.ds_deleted = 0
            AND z.ds_deleted = 0
            AND f.ds_deleted = 0
            AND m.year_value = #para(years)
            AND n.dsfa_oua_unit_id = #para(unitId)
        ORDER BY
            m.year_value ASC
#end
#end