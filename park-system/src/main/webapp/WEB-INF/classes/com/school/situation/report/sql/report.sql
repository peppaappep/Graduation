#namespace("school.situation.report.sql.report")

  #sql("leadership")
        SELECT *
        FROM
(
          SELECT
            any_value ( fillTaskId ) AS fillTaskId,
            any_value ( unit ) AS unit,
            any_value ( headmaster_text ) headmaster_text,
            any_value ( headmaster_value ) headmaster_value,
            any_value ( vicePresident_text ) vicePresident_text,
            any_value ( vicePresident_value ) vicePresident_value,
			any_value (	zhkhdc_text) zhkhdc_text,
			any_value (	zhkhdc_value) zhkhdc_value,
            any_value ( leaderFlag_text ) leaderFlag_text,
            any_value ( leaderFlag_value ) leaderFlag_value,
            any_value ( includeLocalFlag_text ) includeLocalFlag_text,
            any_value ( includeLocalFlag_value ) includeLocalFlag_value,
            any_value ( leaderLectureParcent ) leaderLectureParcent,
            any_value ( governmentNumber ) governmentNumber,
            any_value ( partySchoolNumber ) partySchoolNumber,
            any_value ( leaderNumber ) leaderNumber,
            any_value ( partySchoolPlan ) partySchoolPlan,
            any_value ( dqjgjb_value ) dqjgjb_value,
            any_value ( px ) px
        FROM
            (
            SELECT
                leadership.fillTaskId,
                notice.unit,
                leadership.headmaster_text,
                leadership.headmaster_value,
                leadership.vicePresident_text,
                leadership.vicePresident_value,
				leadership.zhkhdc_text,
				leadership.zhkhdc_value,
                leadership.leaderFlag_text,
                leadership.leaderFlag_value,
                leadership.includeLocalFlag_text,
                leadership.includeLocalFlag_value,
                leadership.leaderLectureParcent,
                leadership.governmentNumber,
                leadership.partySchoolNumber,
                leadership.leaderNumber,
                leadership.partySchoolPlan,
                zzjgcj.dqjgjb_value,
                zzjgcj.px
            FROM
                situation_notice_report_manage man
                left JOIN situation_tbrw_notice notice ON man.situation_notice_report_manage_id = notice.situation_notice_report_manage_id and notice.ds_deleted='0'
                left JOIN teas_zzjgcj  zzjgcj ON notice.dsfa_oua_unit_id = zzjgcj.dqjgid and zzjgcj.ds_deleted='0'
                left JOIN situation_tbrw_notice_filltask filltask ON notice.situation_tbrw_notice_id = filltask.situation_tbrw_notice_id and filltask.ds_deleted='0'
                LEFT JOIN situation_tbrw_fill_leadership leadership ON filltask.fill_project_id = leadership.situation_tbrw_fill_leadership_id and leadership.ds_deleted='0'
            WHERE
                man.year_value =  #para(yearValue)
                and man.ds_deleted='0'
                and filltask.completeStatus_value='Y'
                and fillProject_value='OL'
                #if(unitIds != null && unitIds != '')
                  AND  notice.dsfa_oua_unit_id in (
                #for(id:unitIds)
                    #(for.index > 0 ? ", " : "")"#(id)"
                #end
                )
                #end
            ) A
        GROUP BY
            A.fillTaskId
 ) B
          ORDER BY
               B.dqjgjb_value,B.px
  #end

  #sql("train")
  SELECT *
  FROM
  (
  SELECT
       any_value (dsfa_oua_unit_id) AS unitid,
		any_value (fillTaskId) AS fillTaskId,
		any_value (unit) AS unit,
		any_value (theoryPercent) theoryPercent,
		any_value (dxjykzzksbz) dxjykzzksbz,
		any_value (jxgzkhmyd) jxgzkhmyd,
		any_value (stdTestSatisfiedPercent) stdTestSatisfiedPercent,
		any_value (xyhqmyd) xyhqmyd,
		any_value (stdArrivePercent) stdArrivePercent,
		any_value (totalClassNumber) totalClassNumber,
		any_value (totalStdNumber) totalStdNumber,
		any_value (trainClassNumber) trainClassNumber,
		any_value (trainStdNumber) trainStdNumber,
		any_value (eduTrainNumber) eduTrainNumber,
		any_value (jxbxys) jxbxys,
		any_value (youngTrainNumber) youngTrainNumber,
		any_value (pxbxys) pxbxys,
		any_value (ztytbqs) ztytbqs,
		any_value (ztytbxys) ztytbxys,
		any_value (szpxbqs) szpxbqs,
		any_value (szpxbxys) szpxbxys,
		any_value (localentrucla) localentrucla,
		any_value (localentrustu) localentrustu,
		any_value (unlocalentrucla) unlocalentrucla,
		any_value (unlocalentrustu) unlocalentrustu,
		any_value (foreignentrucla) foreignentrucla,
		any_value (foreignentrustu) foreignentrustu,
		any_value (xjcs) xjcs,
		any_value (jkrc) jkrc,
		any_value (bouticountry) bouticountry,
		any_value (boutiprovincial) boutiprovincial,
		any_value (bouticity) bouticity,
		any_value (bouticounty) bouticounty,
		any_value (teacher_base_central) teacher_base_central,
		any_value (teacher_base_provincial) teacher_base_provincial,
		any_value (teacher_base_city) teacher_base_city,
		any_value (teacher_base_county) teacher_base_county,
		any_value (teacher_base_sum) teacher_base_sum,
		any_value (dqjgjb_value) dqjgjb_value,
		any_value (px) px
		FROM
  (
   SELECT
	  notice.dsfa_oua_unit_id,
		education.fillTaskId,
		notice.unit,
		education.theoryPercent,
		education.dxjykzzksbz,
		education.jxgzkhmyd,
		education.stdTestSatisfiedPercent,
		education.xyhqmyd,
		education.stdArrivePercent,
		education.totalClassNumber,
		education.totalStdNumber,
		education.trainClassNumber,
		education.trainStdNumber,
		education.eduTrainNumber,
		education.jxbxys,
		education.youngTrainNumber,
		education.pxbxys,
		education.ztytbqs,
		education.ztytbxys,
		education.szpxbqs,
		education.szpxbxys,
		education.localentrucla,
		education.localentrustu,
		education.unlocalentrucla,
		education.unlocalentrustu,
		education.foreignentrucla,
		education.foreignentrustu,
		education.xjcs,
		education.jkrc,
		education.bouticountry,
		education.boutiprovincial,
		education.bouticity,
		education.bouticounty,
		education.teacher_base_central,
		education.teacher_base_provincial,
		education.teacher_base_city,
		education.teacher_base_county,
		education.teacher_base_sum,
		zzjgcj.dqjgjb_value,
		zzjgcj.px
	FROM
		situation_notice_report_manage man
		LEFT JOIN situation_tbrw_notice notice ON man.situation_notice_report_manage_id = notice.situation_notice_report_manage_id and notice.ds_deleted='0'
		LEFT JOIN teas_zzjgcj  zzjgcj ON notice.dsfa_oua_unit_id = zzjgcj.dqjgid and zzjgcj.ds_deleted='0'
		LEFT JOIN situation_tbrw_notice_filltask filltask ON notice.situation_tbrw_notice_id = filltask.situation_tbrw_notice_id and filltask.ds_deleted='0'
		LEFT JOIN situation_tbrw_fill_education education ON filltask.fill_project_id = education.situation_tbrw_fill_education_id and education.ds_deleted='0'
	WHERE
		 man.year_value =  #para(yearValue)
		 and man.ds_deleted='0'
		 and filltask.completeStatus_value='Y'
		 and fillProject_value='ET'
                #if(unitIds != null && unitIds != '')
                  AND  notice.dsfa_oua_unit_id in (
                #for(id:unitIds)
                    #(for.index > 0 ? ", " : "")"#(id)"
                #end
                )
                #end
) A
   GROUP BY
        A.fillTaskId
) B
    	ORDER BY
		B.dqjgjb_value,B.px
  #end

  #sql("cientific")
  SELECT *
  FROM
  (
   SELECT
        any_value ( fillTaskId ) AS fillTaskId,
        any_value ( unit ) AS unit,
        any_value(academicArticles)   academicArticles,
        any_value(publicationStatus)   publicationStatus,
        any_value(first_prize_research_country) first_prize_research_country,
        any_value(second_prize_research_country) second_prize_research_country,
        any_value(third_prize_research_country) third_prize_research_country,
        any_value(other_prize_research_country) other_prize_research_country,
        any_value(first_prize_research_provincial)   first_prize_research_provincial,
        any_value(second_prize_research_provincial)   second_prize_research_provincial,
        any_value(third_prize_research_provincial)   third_prize_research_provincial,
        any_value(other_prize_research_provincial)   other_prize_research_provincial,
        any_value(first_prize_research_hall)   first_prize_research_hall,
        any_value(second_prize_research_hall)   second_prize_research_hall,
        any_value(third_prize_research_hall)   third_prize_research_hall,
        any_value(other_research_hall)   other_research_hall,
        any_value(research_county_sum)   research_county_sum,
        any_value(other_sum)   other_sum,
        any_value(national_issues)   national_issues,
        any_value(provincial_subject)   provincial_subject,
        any_value(hall_subject)   hall_subject,
        any_value(county_subject)   county_subject,
        any_value(other_subject)   other_subject,
        any_value(policy_period)   policy_period,
        any_value(policy_total_people)   policy_total_people,
        any_value(policy_total_articles)   policy_total_articles,
		any_value(articlenumber) articlenumber,
		any_value(dqjgjb_value) dqjgjb_value,
		any_value(px) px
    FROM
        (
        SELECT
            cientific.fillTaskId,
            notice.unit,
            cientific.academicArticles,
            cientific.publicationStatus,
            cientific.first_prize_research_country,
            cientific.second_prize_research_country,
            cientific.third_prize_research_country,
            cientific.other_prize_research_country,
            cientific.first_prize_research_provincial,
            cientific.second_prize_research_provincial,
            cientific.third_prize_research_provincial,
            cientific.other_prize_research_provincial,
			cientific.first_prize_research_hall,
            cientific.second_prize_research_hall,
            cientific.third_prize_research_hall,
            cientific.other_research_hall,
			cientific.research_county_sum,
			cientific.other_sum,
			cientific.national_issues,
			cientific.provincial_subject,
            cientific.hall_subject,
            cientific.county_subject,
            cientific.other_subject,
			cientific.policy_period,
            cientific.policy_total_people,
            cientific.policy_total_articles,
			cientific.articlenumber,
			zzjgcj.dqjgjb_value,
			zzjgcj.px
        FROM
            situation_notice_report_manage man
            LEFT JOIN situation_tbrw_notice notice ON man.situation_notice_report_manage_id = notice.situation_notice_report_manage_id  and notice.ds_deleted='0'
            LEFT JOIN teas_zzjgcj  zzjgcj ON notice.dsfa_oua_unit_id = zzjgcj.dqjgid and zzjgcj.ds_deleted='0'
            LEFT JOIN situation_tbrw_notice_filltask filltask ON notice.situation_tbrw_notice_id = filltask.situation_tbrw_notice_id and filltask.ds_deleted='0'
            LEFT JOIN situation_tbrw_fill_scientific cientific ON filltask.fill_project_id = cientific.situation_tbrw_fill_scientific_id and cientific.ds_deleted='0'
        WHERE
           man.year_value =  #para(yearValue)
           and filltask.completeStatus_value='Y'
           and man.ds_deleted='0'
           and fillProject_value='SRC'
                #if(unitIds != null && unitIds != '')
                  AND  notice.dsfa_oua_unit_id in (
                #for(id:unitIds)
                    #(for.index > 0 ? ", " : "")"#(id)"
                #end
                )
                #end
        ) A
    GROUP BY
        A.fillTaskId
) B
    	ORDER BY
		B.dqjgjb_value,B.px
  #end


  #sql("team")
  SELECT *
  FROM
  (
    SELECT
            any_value ( fillTaskId ) AS fillTaskId,
            any_value ( unit ) AS unit,
            any_value ( org_num ) org_num,
            any_value ( org_participating ) org_participating,
            any_value ( org_business_num ) org_business_num,
            any_value ( org_business_manager ) org_business_manager,
            any_value ( org_business_skill ) org_business_skill,
            any_value ( staff_num ) staff_num,
            any_value ( staff_avg_age ) staff_avg_age,
            any_value ( staff_admin_num ) staff_admin_num,
            any_value ( staff_admin_avg_age ) staff_admin_avg_age,
            any_value ( staff_teacher_num ) staff_teacher_num,
            any_value ( staff_teacher_avg_age ) staff_teacher_avg_age,
            any_value ( teacher_scale_staff ) teacher_scale_staff,
            any_value ( school_teacher_num ) school_teacher_num,
            any_value ( outside_school_teacher_num ) outside_school_teacher_num,
            any_value ( new_join_admin_num ) new_join_admin_num,
            any_value ( new_join_teacher_num ) new_join_teacher_num,
            any_value ( foreign_admin_num ) foreign_admin_num,
            any_value ( foreign_teacher_num ) foreign_teacher_num,
            any_value ( refresher_admin_num ) refresher_admin_num,
            any_value ( refresher_admin_person_time ) refresher_admin_person_time,
            any_value ( refresher_teacher_num ) refresher_teacher_num,
            any_value ( refresher_teacher_person_time ) refresher_teacher_person_time,
            any_value ( admin_num ) admin_num,
            any_value ( admin_avg_age ) admin_avg_age,
            any_value ( master_num ) master_num,
            any_value ( undergraduate_num ) undergraduate_num,
            any_value ( specialty_num ) specialty_num,
            any_value ( teacher_num ) teacher_num,
            any_value ( teacher_avg_age ) teacher_avg_age,
            any_value ( proportion_employees ) proportion_employees,
            any_value ( teacher_doctor_num ) teacher_doctor_num,
            any_value ( doctor_num ) doctor_num,
            any_value ( teacher_master_num ) teacher_master_num,
            any_value ( teacher_undergraduate_num ) teacher_undergraduate_num,
            any_value ( teacher_specialty_num ) teacher_specialty_num,
            any_value ( main_high ) main_high,
            any_value ( assistant_high ) assistant_high,
            any_value ( intermediate ) intermediate,
            any_value ( other ) other,
            any_value ( first_level ) first_level,
            any_value ( second_level ) second_level,
            any_value ( third_level ) third_level,
            any_value ( fourth_level ) fourth_level,
            any_value ( dqjgjb_value ) dqjgjb_value,
            any_value ( px ) px
        FROM
            (
            SELECT
                team.fillTaskId,
                notice.unit,
                team.org_num,
                team.org_participating,
                team.org_business_num,
                team.org_business_manager,
                team.org_business_skill,
                team.staff_num,
                team.staff_avg_age,
                team.staff_admin_num,
                team.staff_admin_avg_age,
                team.staff_teacher_num,
                team.staff_teacher_avg_age,
                team.teacher_scale_staff,
                team.school_teacher_num,
                team.outside_school_teacher_num,
                team.new_join_admin_num,
                team.new_join_teacher_num,
                team.foreign_admin_num,
                team.foreign_teacher_num,
                team.refresher_admin_num,
                team.refresher_admin_person_time,
                team.refresher_teacher_num,
                team.refresher_teacher_person_time,
                team.admin_num,
                team.admin_avg_age,
                team.master_num,
                team.undergraduate_num,
                team.specialty_num,
                team.teacher_num,
                team.teacher_avg_age,
                team.proportion_employees,
                team.teacher_doctor_num,
                team.doctor_num,
                team.teacher_master_num,
                team.teacher_undergraduate_num,
                team.teacher_specialty_num,
                team.main_high,
                team.assistant_high,
                team.intermediate,
                team.other,
                team.first_level,
                team.second_level,
                team.third_level,
                team.fourth_level,
                zzjgcj.dqjgjb_value,
                zzjgcj.px
            FROM
                situation_notice_report_manage man
                LEFT JOIN situation_tbrw_notice notice ON man.situation_notice_report_manage_id = notice.situation_notice_report_manage_id and notice.ds_deleted='0'
                LEFT JOIN teas_zzjgcj  zzjgcj ON notice.dsfa_oua_unit_id = zzjgcj.dqjgid and zzjgcj.ds_deleted='0'
                LEFT JOIN situation_tbrw_notice_filltask filltask ON notice.situation_tbrw_notice_id = filltask.situation_tbrw_notice_id and filltask.ds_deleted='0'
                LEFT JOIN situation_tbrw_fill_team_building team ON filltask.fill_project_id = team.situation_tbrw_fill_team_building_id and team.ds_deleted='0'
            WHERE
               man.year_value =  #para(yearValue)
               and man.ds_deleted='0'
               and filltask.completeStatus_value='Y'
                and fillProject_value='TC'
                #if(unitIds != null && unitIds != '')
                  AND  notice.dsfa_oua_unit_id in (
                #for(id:unitIds)
                    #(for.index > 0 ? ", " : "")"#(id)"
                #end
                )
                #end
            ) A
        GROUP BY
            A.fillTaskId
) B
    	ORDER BY
		B.dqjgjb_value,B.px
  #end

  #sql("service")
  SELECT *
  FROM
  (
        SELECT
            any_value ( fillTaskId ) AS fillTaskId,
            any_value ( unit ) AS unit,
            any_value ( school_completion_time ) school_completion_time,
            any_value ( school_size ) school_size,
            any_value ( school_under_size ) school_under_size,
            any_value ( is_other_work_text ) is_other_work_text,
            any_value ( is_other_work_value ) is_other_work_value,
            any_value ( other_unit_name ) other_unit_name,
            any_value ( classroom_num ) classroom_num,
            any_value ( classroom_size ) classroom_size,
            any_value ( auditorium_num ) auditorium_num,
            any_value ( auditorium_size ) auditorium_size,
            any_value ( conference_room_num ) conference_room_num,
            any_value ( dormitory_room_num ) dormitory_room_num,
            any_value ( dormitory_beds_num ) dormitory_beds_num,
			any_value ( library_size ) library_size,
			any_value ( library_paper_book ) library_paper_book,
		    any_value ( teaching_resources_sum ) teaching_resources_sum,
			any_value ( crisis_management_lab_num ) crisis_management_lab_num,
			any_value ( scientific_research_num ) scientific_research_num,
			any_value ( campus_under_start_date ) campus_under_start_date,
			any_value ( campus_completion_time ) campus_completion_time,
            any_value ( campus_build_size ) campus_build_size,
            any_value ( campus_under_size ) campus_under_size,
            any_value ( campus_investment ) campus_investment,
			any_value ( office_with_other_text ) office_with_other_text,
            any_value ( office_with_other_value ) office_with_other_value,
            any_value ( building_other_unit ) building_other_unit,
			any_value ( pro_campus_investment ) pro_campus_investment,
            any_value ( pro_campus_time ) pro_campus_time,
            any_value ( campus_initial_time ) campus_initial_time,
            any_value ( campus_size ) campus_size,
            any_value ( pro_campus_under_size ) pro_campus_under_size,
			 any_value ( is_planning_text ) is_planning_text,
            any_value ( is_planning_value ) is_planning_value,
			any_value(zxjf) zxjf,
			 any_value(gyjf) gyjf,
			any_value(jxky) jxky,
			 any_value(xxhjs) xxhjs,
			any_value(jbjs) jbjs,
			any_value ( logistics_canteen_num ) logistics_canteen_num,
            any_value ( logistics_canteen_table_num ) logistics_canteen_table_num,
			any_value ( logistics_canteen_manage_text ) logistics_canteen_manage_text,
            any_value ( logistics_canteen_manage_value ) logistics_canteen_manage_value,
            any_value ( dormitory_manage_text ) dormitory_manage_text,
            any_value ( dormitory_manage_value ) dormitory_manage_value,
            any_value ( dqjgjb_value ) dqjgjb_value,
            any_value ( px ) px
        FROM
            (
            SELECT
            service.fillTaskId,
            notice.unit,
            IFNULL( date_format( service.school_completion_time, '%Y-%m' ), NULL ) AS school_completion_time ,
           service.school_size,
            service.school_under_size,
            service.is_other_work_text,
            service.is_other_work_value,
            service.other_unit_name,
            service.classroom_num,
           service.classroom_size,
            service.auditorium_num,
            service.auditorium_size,
            service.conference_room_num,
            service.dormitory_room_num,
            service.dormitory_beds_num,
            service.library_size,
             service.library_paper_book,
            service.teaching_resources_sum,
              service.crisis_management_lab_num,
             service.scientific_research_num,
			IFNULL( date_format( service.campus_under_start_date, '%Y-%m' ), NULL ) AS campus_under_start_date ,
            IFNULL( date_format( service.campus_completion_time, '%Y-%m' ), NULL ) AS campus_completion_time ,
            service.campus_build_size,
            service.campus_under_size,
            service.campus_investment,
			service.office_with_other_text,
            service.office_with_other_value,
            service.building_other_unit,
			service.pro_campus_investment,
             IFNULL( date_format( service.pro_campus_time, '%Y-%m' ), NULL ) AS pro_campus_time ,
             IFNULL( date_format( service.campus_initial_time, '%Y-%m' ), NULL ) AS campus_initial_time ,
            service.campus_size,
            service.pro_campus_under_size,
			service.is_planning_text,
            service.is_planning_value,
			service.zxjf,
			service.gyjf,
			service.jxky,
			service.xxhjs,
			 service.jbjs,
			service.logistics_canteen_num,
            service.logistics_canteen_table_num,
						 service.logistics_canteen_manage_text,
           service.logistics_canteen_manage_value,
            service.dormitory_manage_text,
           service.dormitory_manage_value,
           zzjgcj.dqjgjb_value,
           zzjgcj.px
            FROM
                situation_notice_report_manage man
                LEFT JOIN situation_tbrw_notice notice ON man.situation_notice_report_manage_id = notice.situation_notice_report_manage_id and notice.ds_deleted='0'
                LEFT JOIN teas_zzjgcj  zzjgcj ON notice.dsfa_oua_unit_id = zzjgcj.dqjgid and zzjgcj.ds_deleted='0'
                LEFT JOIN situation_tbrw_notice_filltask filltask ON notice.situation_tbrw_notice_id = filltask.situation_tbrw_notice_id and filltask.ds_deleted='0'
                LEFT JOIN situation_tbrw_fill_service_guarantee service ON filltask.fill_project_id = service.situation_tbrw_fill_service_guarantee_id and service.ds_deleted='0'
            WHERE
               man.year_value =  #para(yearValue)
               and man.ds_deleted='0'
               and filltask.completeStatus_value='Y'
               and fillProject_value='SG'
                #if(unitIds != null && unitIds != '')
                  AND  notice.dsfa_oua_unit_id in (
                #for(id:unitIds)
                    #(for.index > 0 ? ", " : "")"#(id)"
                #end
                )
                #end
            ) A
        GROUP BY
            A.fillTaskId
) B
    	ORDER BY
		B.dqjgjb_value,B.px
  #end

  #sql("school")
  SELECT *
  FROM
  (
  SELECT
        any_value ( fillTaskId ) AS fillTaskId,
        any_value ( unit ) AS unit,
        any_value ( area_schools_integration_text ) area_schools_integration_text,
        any_value ( area_schools_integration_value ) area_schools_integration_value,
        any_value ( integration_unit_name ) integration_unit_name,
        any_value ( college_listing_text ) college_listing_text,
        any_value ( college_listing_value ) college_listing_value,
        any_value ( socialist_institutes_listing_value ) socialist_institutes_listing_value,
        any_value ( socialist_institutes_listing_text ) socialist_institutes_listing_text,
		any_value (add_to_party_school_text)  add_to_party_school_text,
		any_value (add_to_party_school_value) add_to_party_school_value,
		any_value (cadre_training_arrange_text) cadre_training_arrange_text,
        any_value ( cadre_training_arrange_value ) cadre_training_arrange_value,
        any_value ( xzjdsl ) xzjdsl,
        any_value ( sldxsl ) sldxsl,
        any_value ( dqjgjb_value ) dqjgjb_value,
        any_value ( px ) px
    FROM
        (
        SELECT
            schools.fillTaskId,
            notice.unit,
            schools.area_schools_integration_text,
            schools.area_schools_integration_value,
            schools.integration_unit_name,
            schools.college_listing_text,
            schools.college_listing_value,
            schools.socialist_institutes_listing_value,
            schools.socialist_institutes_listing_text,
			schools.add_to_party_school_text,
			schools.add_to_party_school_value,
            schools.cadre_training_arrange_value,
			schools.cadre_training_arrange_text,
            schools.xzjdsl,
            schools.sldxsl,
            zzjgcj.dqjgjb_value,
            zzjgcj.px
        FROM
            situation_notice_report_manage man
            LEFT JOIN situation_tbrw_notice notice ON man.situation_notice_report_manage_id = notice.situation_notice_report_manage_id  and notice.ds_deleted='0'
            LEFT JOIN teas_zzjgcj  zzjgcj ON notice.dsfa_oua_unit_id = zzjgcj.dqjgid and zzjgcj.ds_deleted='0'
            LEFT JOIN situation_tbrw_notice_filltask filltask ON notice.situation_tbrw_notice_id = filltask.situation_tbrw_notice_id  and filltask.ds_deleted='0'
            LEFT JOIN situation_tbrw_fill_schools_resouce schools ON filltask.fill_project_id = schools.situation_tbrw_fill_schools_resouce_id  and schools.ds_deleted='0'
        WHERE
            man.year_value =  #para(yearValue)
             and man.ds_deleted='0'
             and filltask.completeStatus_value='Y'
              and fillProject_value='TIOER'
                #if(unitIds != null && unitIds != '')
                  AND  notice.dsfa_oua_unit_id in (
                #for(id:unitIds)
                    #(for.index > 0 ? ", " : "")"#(id)"
                #end
                )
                #end
        ) A
    GROUP BY
        A.fillTaskId
) B
    	ORDER BY
		B.dqjgjb_value,B.px
    #end


    #sql("findUnitIds")
        SELECT
            dqjgid AS unit_id
        FROM
            teas_zzjgcj
        WHERE
          qtid like CONCAT('%',#para(unitId),'%') AND teas_zzjgcj.ds_deleted='0'
    #end
    #sql("findAllUnitIds")
        SELECT
            dqjgid AS unit_id
        FROM
            teas_zzjgcj
        WHERE
           teas_zzjgcj.ds_deleted='0'
    #end

    #sql("loadTreeInfo")
        SELECT
            dqjgid AS _id,
            dqjgmc AS `_name`,
            pid AS treeinfo_pid,
            dqjgjb_value AS treeinfo_level,
            dqjgjb_value AS _level,
            qtid AS treeinfo_globalid
        FROM
            teas_zzjgcj
            WHERE teas_zzjgcj.ds_deleted='0'
       #if(level != null && level != '' && level !='1')
            AND pid = #para(unitId)
            OR dqjgid = #para(unitId)
        #end
        ORDER BY
            dqjgjb_value,px
    #end

    #sql("checkLevel")
        SELECT
            dqjgjb_value AS `level`
        FROM
            teas_zzjgcj
        WHERE
            dqjgid = #para(unitId) AND teas_zzjgcj.ds_deleted='0'
    #end

#end