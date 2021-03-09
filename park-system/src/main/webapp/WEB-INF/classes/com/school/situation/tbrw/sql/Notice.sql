#namespace("school.situation.tbrw.sql.Notice")
  #sql("updateStatus")

    UPDATE situation_tbrw_notice
        SET
            #if(taskStatus_value)
                taskStatus_value = #para(taskStatus_value),
            #end
            #if(taskStatus_text)
                taskStatus_text = #para(taskStatus_text),
            #end
            #if(approve_status)
                approve_status = #para(approve_status),
            #end
            #if(approve_remark)
                approve_remark = #approve_remark),
            #end
            #if(latestInDate)
                latestInDate = #para(latestInDate),
            #end
            #if(initial_originatr)
                initial_originatr = #para(initial_originatr),
            #end
            #if(initial_originatr_id)
                initial_originatr_id = #para(initial_originatr_id),
            #end
            latestCirculateLog = #para(latestCirculateLog),
            current_process_link = #para(current_process_link),
            ds_update_time = NOW(),
            ds_update_user_id = #para(userId),
            ds_update_user_name = #para(userName)
        WHERE situation_tbrw_notice_id = #para(noticeId)
  #end

  #sql("selectFillProjectLastData")
    SELECT
	    tmp.*
    FROM
        #(tableName) tmp
        left JOIN situation_tbrw_notice_filltask stnf ON tmp.fillTaskId = stnf.situation_tbrw_notice_filltask_id and stnf.ds_deleted='0'
        left JOIN situation_tbrw_notice stn ON stnf.situation_tbrw_notice_id = stn.situation_tbrw_notice_id and stn.ds_deleted='0' and stn.taskStatus_value='IN'
       AND stn.annual_text <(SELECT
              annual_text
            FROM
              situation_tbrw_notice
            WHERE annual_text = #para(annual_text)
              AND unit = #para(unit)
              AND ds_deleted = '0')
               where tmp.ds_deleted = '0' AND stn.unit = #para(unit)   ORDER BY stn.annual_text DESC LIMIT 1
  #end
 #sql("selectChild")
    SELECT
      *
    FROM
     #(table)
    WHERE #(foreignKey)_id = #para(id) and ds_deleted='0'
  #end

   #sql("selectChildEdu")
    SELECT
      *
    FROM
     #(table)
    WHERE #(foreignKey)id = #para(id) and ds_deleted='0'
  #end



  #sql("selectDecisionConsulting")
    SELECT
      *
    FROM
      `situation_tbrw_fill_scientific_decisionconsulting`
    WHERE scientific_id =  #para(id)  AND ds_deleted='0'
  #end

  #sql("deleteThreeTable")
    update
     `situation_tbrw_fill_scientific_decisionconsulting_instruction`
    set ds_deleted = '1'
    WHERE situation_tbrw_fill_scientific_decisionConsulting_id = #para(id) and ds_deleted='0'
  #end

  #sql("delteSecondTable")
    update
     `situation_tbrw_fill_scientific_decisionconsulting`
    set ds_deleted = '1'
    WHERE situation_tbrw_fill_scientific_decisionConsulting_id = #para(id) and ds_deleted='0'
  #end

  #sql("selectInstruction")
    SELECT
      *
    FROM
      `situation_tbrw_fill_scientific_decisionconsulting_instruction`
    WHERE situation_tbrw_fill_scientific_decisionConsulting_id = #para(id) and ds_deleted='0'
  #end

  #sql("insertConsulting")
   INSERT INTO `situation_tbrw_fill_scientific_decisionconsulting` (
      `situation_tbrw_fill_scientific_decisionConsulting_id`, `title`, `issue`, `totalIssue`, `author`,
      `annual_text`, `annual_value`,  `scientific_id`,`author_text`, `author_value`, `dept_text`, `dept_value`,
      `auth_text`, `auth_value`, `department_text`, `department_value`
    )
    VALUES(
        #para(newid), #para(title), #para(issue), #para(totalIssue), #para(author),
          #para(annual_text), #para(annual_value), #para(id), #para(author_text),
           #para(author_value), #para(dept_text), #para(dept_value), #para(auth_text),
            #para(auth_value), #para(department_text), #para(department_value)
    )
  #end

  #sql("insertInstruction")
   INSERT INTO `situation_tbrw_fill_scientific_decisionconsulting_instruction` (
      `situation_tbrw_fill_scientific_decisionConsulting_instruction_id`, `situation_tbrw_fill_scientific_decisionConsulting_id`, `instructionLeaderPosition`,
      `instructionDate`, `instructionLeaderName`
    )
    VALUES(
        #para(newid), #para(pid), #para(instructionLeaderPosition), #para(instructionDate), #para(instructionLeaderName)
    )
  #end

   #sql("deleteChild")
    update
       #(table)
   set ds_deleted = '1'
   where  #(table)_id = #para(id)
  #end

   #sql("insertChildpartySchool")
   INSERT INTO `situation_tbrw_fill_leadership_partySchool` (
      `situation_tbrw_fill_leadership_partySchool_id`, `sex_text`, `sex_value`, `guideDate`, `guideContetn`,
      `name`, `department`, `position`, `leadership_id`
    )
    VALUES(
        #para(newid), #para(sex_text), #para(sex_value), #para(guideDate), #para(guideContetn),
          #para(name), #para(department), #para(position), #para(id)
    )
  #end
  #sql("insertChildgovernmentNumber")
   INSERT INTO `situation_tbrw_fill_leadership_governmentnumber` (
      `situation_tbrw_fill_leadership_governmentNumber_id`, `meetingContent`, `name`, `meetingDate`, `leadership_id`
    )
    VALUES(
        #para(newid), #para(meetingContent), #para(name), #para(meetingDate),  #para(id)
    )
  #end
  #sql("insertChildpartySchoolPlan")
   INSERT INTO `situation_tbrw_fill_leadership_partyschoolplan` (
      `situation_tbrw_fill_leadership_partySchoolPlan_id`, `name`, `setDate`, `leadership_id`
    )
    VALUES(
        #para(newid),  #para(name), #para(setDate),  #para(id)
    )
  #end
  #sql("insertChildleaderNumber")
   INSERT INTO `situation_tbrw_fill_leadership_leadernumber` (
      `situation_tbrw_fill_leadership_leaderNumber_id`, `position`, `className`, `teachContent`,
         `sex_text`, `sex_value`, `name`, `department`,
            `teachDate`, `leadership_id`
    )
    VALUES(
        #para(newid),  #para(position), #para(className),#para(teachContent),
        #para(sex_text),#para(sex_value), #para(name),  #para(department),
         #para(teachDate),#para(id)
    )
  #end
    ###导入上次数据    子表插入上次子表数据  精品课程
    #sql("insertChildexcellentcourprize")
   INSERT INTO `situation_tbrw_fill_education_excellentcourprize` (
      `situation_tbrw_fill_education_excellentcourprize_id`, `speaker`, `awardrank_text`, `awardrank_value`,
         `coursename`, `awardname`, `hostunit`, `eduid`
    )
    VALUES(
        #para(newid),  #para(speaker), #para(awardrank_text),#para(awardrank_value),
        #para(coursename),#para(awardname), #para(hostunit), #para(id)
    )
  #end
    ###导入上次数据    子表插入上次子表数据  主体班次
    #sql("insertChildmainclass")
   INSERT INTO `situation_tbrw_fill_education_mainclass` (
      `situation_tbrw_fill_education_mainclass_id`, `classtype_value`, `classtype_text`, `trainendtime`,
         `trainbegintime`, `classname`, `peoplecount`, `eduid`
    )
    VALUES(
        #para(newid),  #para(classtype_value), #para(classtype_text),#para(trainendtime),
        #para(trainbegintime),#para(classname), #para(peoplecount), #para(id)
    )
  #end
    ###导入上次数据    子表插入上次子表数据  非主体班次
    #sql("insertChildunmainclass")
   INSERT INTO `situation_tbrw_fill_education_unmainclass` (
      `situation_tbrw_fill_education_unmainclass_id`, `classtype_text`, `classtype_value`, `peoplecount`,
         `trainbegintime`, `trainendtime`, `classname`, `eduid`
    )
    VALUES(
        #para(newid),  #para(classtype_text), #para(classtype_value),#para(peoplecount),
        #para(trainbegintime),#para(trainendtime), #para(classname),#para(id)
    )
  #end

  #sql("insertChildarticle")
   INSERT INTO `situation_tbrw_fill_scientific_article` (
      `situation_tbrw_fill_scientific_article_id`, `publishDate`, `author`, `scientific_id`,
      `publicationName`, `title`, `publicationLevle`, `publication_levle_text`,
      `publication_levle_value`, `author_value`,`author_text`,
       `dept_text`, `dept_value`,   `test_text`,
      `test_value`, `authSearch_text`, `authSearch_value`,
      `auth_text`, `auth_value`,`depart_text`,
      `depart_value`, `department_text`,`department_value`
    )
    VALUES(
        #para(newid),  #para(publishDate), #para(author),#para(id),
        #para(publicationName),#para(title), #para(publicationLevle),  #para(publication_levle_text),
        #para(publication_levle_value),#para(author_value), #para(author_text),
        #para(dept_text),#para(dept_value), #para(test_text),
        #para(test_value),#para(authSearch_text), #para(authSearch_value),
        #para(auth_text),#para(auth_value), #para(depart_text),
        #para(depart_value),#para(department_text), #para(department_value)
    )
  #end

  #sql("insertChildaward")
   INSERT INTO `situation_tbrw_fill_scientific_award` (
      `situation_tbrw_fill_scientific_award_id`, `title`, `winningDate`, `scientific_id`,
      `agency`, `author`, `type_text`, `type_value`,
      `awardRank_text`, `awardRank_value`,`awardLevel_text`,
      `awardLevel_value`, `dept_text`, `author_text`,  `author_value`,
      `dept_value`, `auth_text`, `auth_value`,
      `department_text`, `department_value`
    )
    VALUES(
        #para(newid),  #para(title), #para(winningDate),#para(id),
        #para(agency),#para(author), #para(type_text),  #para(type_value),
        #para(awardRank_text),#para(awardRank_value), #para(awardLevel_text),
        #para(awardLevel_value),#para(dept_text), #para(author_text), #para(author_value),
        #para(dept_value),#para(auth_text), #para(auth_value),
        #para(department_text),#para(department_value)
    )
  #end

  #sql("insertChildpublications")
   INSERT INTO `situation_tbrw_fill_scientific_publications` (
      `situation_tbrw_fill_scientific_publications_id`, `title`, `author`, `scientific_id`,
      `name`, `level`, `publishDate`, `publication_levle_text`,
      `publication_levle_value`, `author_text`,`author_value`,
      `dept_text`, `dept_value`, `auth_text`,  `auth_value`,
      `department_text`, `department_value`
    )
    VALUES(
        #para(newid),  #para(title), #para(author),#para(id),
        #para(name),#para(level), #para(publishDate),  #para(publication_levle_text),
        #para(publication_levle_value),#para(author_text), #para(author_value),
        #para(dept_text),#para(dept_value), #para(auth_text), #para(auth_value),
        #para(department_text),#para(department_value)
    )
  #end

  #sql("insertChildsubjectResearch")
   INSERT INTO `situation_tbrw_fill_scientific_subjectresearch` (
      `situation_tbrw_fill_scientific_subjectResearch_id`, `projectLeader_text`, `projectLeader_value`, `scientific_id`,
      `peojectDate`, `approvalUnit`, `projectLevel`, `projectLevel_text`,
      `projectLevel_value`, `projectLeader`,`dept_text`,
      `dept_value`, `auth_text`, `auth_value`,  `department_text`,
      `department_value`
    )
    VALUES(
        #para(newid),  #para(projectLeader_text), #para(projectLeader_value),#para(id),
        #para(peojectDate),#para(approvalUnit), #para(projectLevel),  #para(projectLevel_text),
        #para(projectLevel_value),#para(projectLeader),
        #para(dept_text),#para(dept_value), #para(auth_text), #para(auth_value),
        #para(department_text),#para(department_value)
    )
  #end

    #sql("insertChildthoughtsLead")
   INSERT INTO `situation_tbrw_fill_scientific_thoughtslead` (
      `situation_tbrw_fill_scientific_thoughtsLead_id`, `presslevel_text`, `presslevel_value`,
      `articlename`, `postedtime`, `publication`, `auth`,
      `scientific_id`
    )
    VALUES(
        #para(newid),  #para(presslevel_text), #para(presslevel_value),
        #para(articlename),#para(postedtime), #para(publication),  #para(auth),
        #para(id)
    )
  #end

  #sql("insertChildmobility")
   INSERT INTO `situation_tbrw_fill_team_building_mobility` (
      `situation_tbrw_fill_team_building_mobility_id`, `position`, `unit`, `sex_text`,
      `sex_value`, `type_text`, `type_value`, `name`,
      `situation_tbrw_fill_team_building_id`, `mold_text`,`mold_value`

    )
    VALUES(
        #para(newid),  #para(position), #para(unit),#para(sex_text),
        #para(sex_value),#para(type_text), #para(type_value),  #para(name),
        #para(id),#para(mold_text),
        #para(mold_value)
    )
  #end

  #sql("insertChildpart_time_teacher")
   INSERT INTO `situation_tbrw_fill_team_building_part_time_teacher` (
      `situation_tbrw_fill_team_building_part_time_teacher_id`, `part_time_type_text`, `part_time_type_value`, `dept`,
      `rank_text`, `rank_value`, `email`, `sex_text`,
      `situation_tbrw_fill_team_building_id`, `sex_value`,`position`,
      `graduate_school`, `source_text`, `source_value`, `unit`,
      `major`, `name`,`education_text`,
      `education_value`, `phone`,`degree_text`,
      `degree_value`, `thetitle_text`, `thetitle_value`, `introduction`,
      `birthday`, `job_title_text`,`job_title_value`
    )
    VALUES(
        #para(newid),  #para(part_time_type_text), #para(part_time_type_value),#para(dept),
        #para(rank_text),#para(rank_value), #para(email),  #para(sex_text),
        #para(id),#para(sex_value),#para(position),
        #para(graduate_school),#para(source_text),#para(source_value),#para(unit),
        #para(major),#para(name),#para(education_text),
        #para(education_value),#para(phone),#para(degree_text),
        #para(degree_value),#para(thetitle_text),#para(thetitle_value),#para(introduction),
        #para(birthday),#para(job_title_text),#para(job_title_value)
    )
  #end


  #sql("updateLead")
    UPDATE
      `situation_tbrw_fill_leadership`
    SET
     headmaster_text = #para(headmaster_text),
      headmaster_value = #para(headmaster_value),
      vicePresident_text = #para(vicePresident_text),
      vicePresident_value = #para(vicePresident_value),
      zhkhdc_text = #para(zhkhdc_text),
      zhkhdc_value = #para(zhkhdc_value),
       leaderFlag_text = #para(leaderFlag_text),
      leaderFlag_value = #para(leaderFlag_value),
      includeLocalFlag_text = #para(includeLocalFlag_text),
      includeLocalFlag_value = #para(includeLocalFlag_value),
      tcxtdxgz = #para(tcxtdxgz)
    WHERE situation_tbrw_fill_leadership_id = #para(id)
  #end

   #sql("updateSci")
    UPDATE
      `situation_tbrw_fill_scientific`
    SET
      second_prize_research_provincial = #para(second_prize_research_provincial),
      national_issues = #para(national_issues),
      other_prize_research_provincial = #para(other_prize_research_provincial),
      research_sum = #para(research_sum),
      research_county_sum = #para(research_county_sum),
      provincial_subject = #para(provincial_subject),
      other_subject = #para(other_subject),
      first_prize_research_hall = #para(first_prize_research_hall),
      research_hall_sum = #para(research_hall_sum),
      first_prize_research_provincial = #para(first_prize_research_provincial),
      hall_subject = #para(hall_subject),
      research_provincial_sum = #para(research_provincial_sum),
      policy_total_people = #para(policy_total_people),
      policy_total_articles = #para(policy_total_articles),
      third_prize_research_provincial = #para(third_prize_research_provincial),
      third_prize_research_hall = #para(third_prize_research_hall),
      other_research_hall = #para(other_research_hall),
      county_subject = #para(county_subject),
      subject_sum = #para(subject_sum),
      policy_period = #para(policy_period),
      second_prize_research_hall = #para(second_prize_research_hall),
      academicArticles = #para(academicArticles),
      publicationStatus = #para(publicationStatus)
    WHERE situation_tbrw_fill_scientific_id = #para(id)
  #end

  #sql("updateSchoolsResouce")
    UPDATE
      `situation_tbrw_fill_schools_resouce`
    SET
      cadre_training_arrange_text = #para(cadre_training_arrange_text),
      cadre_training_arrange_value = #para(cadre_training_arrange_value),
      college_listing_text = #para(college_listing_text),
      college_listing_value = #para(college_listing_value),
      integration_unit_name = #para(integration_unit_name),
      socialist_institutes_listing_text = #para(socialist_institutes_listing_text),
      socialist_institutes_listing_value = #para(socialist_institutes_listing_value),
      area_schools_integration_text = #para(area_schools_integration_text),
      area_schools_integration_value = #para(area_schools_integration_value),
      add_to_party_school_text = #para(add_to_party_school_text),
      add_to_party_school_value = #para(add_to_party_school_value),
      xzjdsl = #para(xzjdsl),
      sldxsl = #para(sldxsl)
    WHERE situation_tbrw_fill_schools_resouce_id = #para(id)
  #end

  #sql("updateServiceGuarantee")
    UPDATE
      `situation_tbrw_fill_service_guarantee`
    SET
      is_planning_text = #para(is_planning_text),
      is_planning_value = #para(is_planning_value),
      school_under_size = #para(school_under_size),
      teaching_resources_sum = #para(teaching_resources_sum),
      logistics_canteen_table_num = #para(logistics_canteen_table_num),
      logistics_canteen_manage_text = #para(logistics_canteen_manage_text),
      logistics_canteen_manage_value = #para(logistics_canteen_manage_value),
      pro_campus_investment = #para(pro_campus_investment),
      library_paper_book = #para(library_paper_book),
      office_with_other_text = #para(office_with_other_text),
      office_with_other_value = #para(office_with_other_value),
      library_size = #para(library_size),
      _canteen_num = #para(_canteen_num),
      campus_under_size = #para(campus_under_size),
      campus_size = #para(campus_size),
      scientific_research_num = #para(scientific_research_num),
      building_other_unit = #para(building_other_unit),
      auditorium_num = #para(auditorium_num),
      library_electronics_book = #para(library_electronics_book),
      teaching_resources_oneself = #para(teaching_resources_oneself),
      dormitory_beds_num = #para(dormitory_beds_num),
      campus_investment = #para(campus_investment),
      classroom_size = #para(classroom_size),
      library_books_sum = #para(library_books_sum),
      multi_media_room_num = #para(multi_media_room_num),
      auditorium_size = #para(auditorium_size),
      classroom_num = #para(classroom_num),
      is_school_website_text = #para(is_school_website_text),
      is_school_website_value = #para(is_school_website_value),
      dormitory_manage_text = #para(dormitory_manage_text),
      dormitory_manage_value = #para(dormitory_manage_value),
      pro_campus_under_size = #para(pro_campus_under_size),
      teaching_resources_outsourcing = #para(teaching_resources_outsourcing),
      school_size = #para(school_size),
      dormitory_room_num = #para(dormitory_room_num),
      conference_room_num = #para(conference_room_num),
      crisis_management_lab_num = #para(crisis_management_lab_num),
      is_other_work_text = #para(is_other_work_text),
      is_other_work_value = #para(is_other_work_value),
      other_unit_name = #para(other_unit_name),
      campus_initial_time = #para(campus_initial_time),
      campus_under_start_date = #para(campus_under_start_date),
      school_completion_time = #para(school_completion_time),
      pro_campus_time = #para(pro_campus_time),
      campus_completion_time = #para(campus_completion_time),
      campus_build_size = #para(campus_build_size),
      logistics_canteen_num = #para(logistics_canteen_num),
      ywglszhqk = #para(ywglszhqk)
    WHERE situation_tbrw_fill_service_guarantee_id = #para(id)
  #end

  #sql("updateEdu")
    UPDATE
      `situation_tbrw_fill_education`
    SET
      teacher_base_central = #para(teacher_base_central),
      teacher_base_provincial = #para(teacher_base_provincial),
      teacher_base_city = #para(teacher_base_city),
      teacher_base_county = #para(teacher_base_county),
      teacher_base_sum = #para(teacher_base_sum)
    WHERE situation_tbrw_fill_education_id = #para(id)
  #end

  #sql("updateTeam")
    UPDATE
      `situation_tbrw_fill_team_building`
    SET
      org_business_num = #para(org_business_num),
      org_num = #para(org_num),
      org_participating = #para(org_participating),
      org_business_manager = #para(org_business_manager),
      org_business_skill = #para(org_business_skill),
      staff_num = #para(staff_num),
      staff_avg_age = #para(staff_avg_age),
      staff_admin_num = #para(staff_admin_num),
      staff_admin_avg_age = #para(staff_admin_avg_age),
      staff_teacher_num = #para(staff_teacher_num),
      staff_teacher_avg_age = #para(staff_teacher_avg_age),
      teacher_scale_staff = #para(teacher_scale_staff),
      school_teacher_num = #para(school_teacher_num),
      outside_school_teacher_num = #para(outside_school_teacher_num),
      new_join_admin_num = #para(new_join_admin_num),
      new_join_teacher_num = #para(new_join_teacher_num),
      foreign_admin_num = #para(foreign_admin_num),
      foreign_teacher_num = #para(foreign_teacher_num),
      refresher_admin_num = #para(refresher_admin_num),
      refresher_admin_person_time = #para(refresher_admin_person_time),
      refresher_teacher_num = #para(refresher_teacher_num),
      refresher_teacher_person_time = #para(refresher_teacher_person_time),
      admin_num = #para(admin_num),
      admin_avg_age = #para(admin_avg_age),
      doctor_num = #para(doctor_num),
      master_num = #para(master_num),
      undergraduate_num = #para(undergraduate_num),
      specialty_num = #para(specialty_num),
      teacher_num = #para(teacher_num),
      teacher_avg_age = #para(teacher_avg_age),
      proportion_employees = #para(proportion_employees),
      teacher_doctor_num = #para(teacher_doctor_num),
      teacher_master_num = #para(teacher_master_num),
      teacher_undergraduate_num = #para(teacher_undergraduate_num),
      teacher_specialty_num = #para(teacher_specialty_num),
      main_high = #para(main_high),
      assistant_high = #para(assistant_high),
      intermediate = #para(intermediate),
      other = #para(other),
      first_level = #para(first_level),
      second_level = #para(second_level),
      third_level = #para(third_level),
      fourth_level = #para(fourth_level)
    WHERE situation_tbrw_fill_team_building_id = #para(id)
  #end

    #sql("insertChildmLongTrainPlan")
   INSERT INTO `situation_tbrw_fill_education_mlongtrainplan` (
      `situation_tbrw_fill_education_mLongTrainPlan_id`, `name`, `setDate`,  `edu_id`
    )
    VALUES(
        #para(newid),  #para(name), #para(setDate),  #para(id)
    )
  #end

   #sql("insertChildeduFormNumber")
   INSERT INTO `situation_tbrw_fill_education_eduformnumber` (
      `situation_tbrw_fill_education_eduFormNumber_id`, `name`,  `edu_id`
    )
    VALUES(
        #para(newid),  #para(name), #para(id)
    )
  #end

  #sql("insertChildteaching_base")
   INSERT INTO `situation_tbrw_fill_education_teaching_base` (
      `situation_tbrw_fill_education_teaching_base_id`, `base_type_text`,  `base_type_value`,
      `base_address`, `base_name`,  `edu_id`,`base_id`
    )
    VALUES(
        #para(newid),  #para(base_type_text), #para(base_type_value),
        #para(base_address),  #para(base_name), #para(id),#para(base_id)
    )
  #end

  #sql("findInitialOriginatr")
    SELECT
        initial_originatr_id,
        initial_originatr
    FROM
        situation_tbrw_notice
    WHERE
            situation_tbrw_notice_id = #para(noticeId)
  #end

    #sql("findOrigin")
        SELECT request_user_text,
               request_user_value
         FROM   situation_tbrw_modify_apply
        WHERE  notice_id =#para(noticeId)
          AND  ds_deleted='0'
  #end


  #sql("findMId")
    SELECT
        situation_notice_report_manage_id AS mId
    FROM
        situation_tbrw_notice
    WHERE
            situation_tbrw_notice_id = #para(noticeId)
      AND ds_deleted = 0
  #end

  ##班次学制情况模板导入时批量保存（郭盈）
  #sql("batchSaveEducationClassinfo")
    INSERT INTO `situation_tbrw_fill_education_classinfo` (
      `situation_tbrw_fill_education_classInfo_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `studentNumber`, `className`, `edu_id`, `classType_text`, `classType_value`,
      `train_date_sdate`, `train_date_edate`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.studentNumber), #para(obj.className), #para(obj.eduId), #para(obj.classTypeText), #para(obj.classTypeValue),
          #para(obj.trainDateSdate), #para(obj.trainDateEdate)
        )
    #end

  #end

  ##教学基地数量模板导入时批量保存（郭盈）
  #sql("batchSaveEducationTeachingBase")
    INSERT INTO `situation_tbrw_fill_education_teaching_base` (
      `situation_tbrw_fill_education_teaching_base_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `base_type_text`, `base_type_value`, `base_address`, `base_name`, `edu_id`,`base_id`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.baseTypeText), #para(obj.baseTypeValue), #para(obj.baseAddress), #para(obj.baseName), #para(obj.eduId),#para(obj.baseId)
        )
    #end

  #end

  ##公开刊物上发表学术文章导入时批量保存（郭盈）
  #sql("batchSaveScientificArticle")
    INSERT INTO `situation_tbrw_fill_scientific_article` (
      `situation_tbrw_fill_scientific_article_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `title`, `auth_value`,auth_text,department_text,department_value, `publicationName`, `publishDate`, `scientific_id`,
      `publication_levle_text`, `publication_levle_value`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.title), #para(obj.authorValue),#para(obj.authorText),#para(obj.deptText),#para(obj.deptValue), #para(obj.publicationName), #para(obj.publishDate), #para(obj.scientificId),
          #para(obj.publicationLevleText), #para(obj.publicationLevleValue)
        )
    #end

  #end

  ##科研学术获奖情况导入时批量保存（郭盈）
  #sql("batchSaveScientificAward")
    INSERT INTO `situation_tbrw_fill_scientific_award` (
      `situation_tbrw_fill_scientific_award_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `title`, `winningDate`, `agency`, `auth_value`,auth_text,department_text,department_value, `scientific_id`,
      `type_text`, `type_value`, `awardRank_text`, `awardRank_value`, `awardLevel_text`,
      `awardLevel_value`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.title), #para(obj.winningDate), #para(obj.agency), #para(obj.authorValue),#para(obj.authorText),#para(obj.deptText),#para(obj.deptValue), #para(obj.scientificId),
          #para(obj.typeText), #para(obj.typeValue), #para(obj.awardRankText), #para(obj.awardRankValue), #para(obj.awardLevelText),
          #para(obj.awardLevelValue)
        )
    #end

  #end

  ##课题研究情况导入时批量保存（郭盈）
  #sql("batchSaveScientificSubjectresearch")
    INSERT INTO `situation_tbrw_fill_scientific_subjectresearch` (
      `situation_tbrw_fill_scientific_subjectResearch_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `title`, `projectLeader_text`,`projectLeader_value`, `peojectDate`, `approvalUnit`, `projectLevel_text`,
      `projectLevel_value`, `scientific_id`,auth_text,auth_value,department_text,department_value
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.title), #para(obj.projectLeaderText), #para(obj.projectLeaderValue), #para(obj.peojectDate), #para(obj.approvalUnit), #para(obj.projectLevelText),
          #para(obj.projectLevelValue), #para(obj.scientificId),#para(obj.projectLeaderText),#para(obj.projectLeaderValue),#para(obj.deptText),#para(obj.deptValue)
        )
    #end

  #end

  ##决策咨询类导入时保存主表（郭盈）
  #sql("saveScientificDecisionconsulting")
    INSERT INTO `situation_tbrw_fill_scientific_decisionconsulting` (
      `situation_tbrw_fill_scientific_decisionConsulting_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `title`, `issue`, `totalIssue`, auth_text,auth_value,department_text,department_value, `annual_text`,
      `annual_value`, `scientific_id`,`sfxy_text`,`sfxy_value`,`authorname`,`claname`
    )
    VALUES
      (
        #para(uuid), #para(userId), #para(userName), #para(userId), #para(userName),
        '0', 0, #para(unitId), NOW(), NOW(),
        #para(obj.title), #para(obj.issue), #para(obj.totalIssue),#para(obj.authorText),#para(obj.authorValue),#para(obj.deptText),#para(obj.deptValue), #para(obj.annualText),
        #para(obj.annualValue), #para(obj.scientificId),#para(obj.whetherStuText), #para(obj.whetherStuValue),#para(obj.authorName), #para(obj.className)
      )
  #end

  ##决策咨询类导入时保存子表（郭盈）
  #sql("saveScientificDecisionconsultingInstruction")
    INSERT INTO `situation_tbrw_fill_scientific_decisionconsulting_instruction` (
      `situation_tbrw_fill_scientific_decisionConsulting_instruction_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `situation_tbrw_fill_scientific_decisionConsulting_id`, `instructionLeaderPosition`, `instructionDate`, `instructionLeaderName`
    )
    VALUES
    #for (sto:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(uuid), #para(sto.instructionLeaderPosition), #para(sto.instructionDate), #para(sto.instructionLeaderName)
        )
    #end
  #end

  ##兼职教师导入时批量保存（郭盈）
  #sql("batchSaveTeamBuildingPartTimeTeacher")
    INSERT INTO `situation_tbrw_fill_team_building_part_time_teacher` (
      `situation_tbrw_fill_team_building_part_time_teacher_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `part_time_type_text`, `part_time_type_value`, `dept`, `sex_text`, `sex_value`,
      `position`, `source_text`, `source_value`, `unit`, `major`,
      `name`, `situation_tbrw_fill_team_building_id`, `job_title_text`, `job_title_value`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.partTimeTypeText), #para(obj.partTimeTypeValue), #para(obj.dept), #para(obj.sexText), #para(obj.sexValue),
          #para(obj.position), #para(obj.sourceText), #para(obj.sourceValue), #para(obj.unit), #para(obj.major),
          #para(obj.name), #para(obj.situationTbrwFillTeamBuildingId), #para(obj.jobTitleText), #para(obj.jobTitleValue)
        )
    #end

  #end

  ##人员流动情况导入时批量保存（郭盈）
  #sql("batchSaveTeamBuildingMobility")
    INSERT INTO `situation_tbrw_fill_team_building_mobility` (
      `situation_tbrw_fill_team_building_mobility_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `position`, `unit`, `sex_text`, `sex_value`, `type_text`,
      `type_value`, `name`, `situation_tbrw_fill_team_building_id`, `mold_text`, `mold_value`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.position), #para(obj.unit), #para(obj.sexText), #para(obj.sexValue), #para(obj.typeText),
          #para(obj.typeValue), #para(obj.name), #para(obj.situationTbrwFillTeamBuildingId), #para(obj.moldText), #para(obj.moldValue)
        )
    #end

  #end

  ##精品课程获奖情况导入时批量保存（陈轶博）
  #sql("batchSaveExcellentCoursePrize")
	INSERT INTO `situation_tbrw_fill_education_excellentcourprize` (
      `situation_tbrw_fill_education_excellentcourprize_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `coursename`, `speaker`,`awardname`, `hostunit`, `awardrank_text`, `awardRank_value`,`eduid`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.courseName), #para(obj.speaker),#para(obj.awardsName),#para(obj.hostUnit),#para(obj.awardsRankText),#para(obj.awardsRankValue),#para(obj.eduId)
        )
    #end
  #end

   ##非主体班次导入时批量保存（陈轶博）
  #sql("batchSaveUnMainClass")
	INSERT INTO `situation_tbrw_fill_education_unmainclass` (
      `situation_tbrw_fill_education_unmainclass_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `classname`, `classtype_text`,`classtype_value`, `trainbegintime`, `trainendtime`, `peoplecount`,`eduid`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.className), #para(obj.classTypeText),#para(obj.classTypeValue),#para(obj.trainBeginTime),#para(obj.trainEndTime),#para(obj.peopleCount),#para(obj.eduId)
        )
    #end
  #end

     ##主体班次导入时批量保存（陈轶博）
  #sql("batchSaveMainClass")
	INSERT INTO `situation_tbrw_fill_education_mainclass` (
      `situation_tbrw_fill_education_mainclass_id`, `ds_update_user_id`, `ds_create_user_name`, `ds_create_user_id`, `ds_update_user_name`,
      `ds_deleted`, `ds_order`, `ds_unit_id`, `ds_create_time`, `ds_update_time`,
      `classname`, `classtype_text`,`classtype_value`, `trainbegintime`, `trainendtime`, `peoplecount`,`eduid`
    )
    VALUES
    #for (obj:objs)
        #(for.index > 0 ? "," :"")
        (
          REPLACE(UUID(), '-', ''), #para(userId), #para(userName), #para(userId), #para(userName),
          '0', 0, #para(unitId), NOW(), NOW(),
          #para(obj.className), #para(obj.classTypeText),#para(obj.classTypeValue),#para(obj.trainBeginTime),#para(obj.trainEndTime),#para(obj.peopleCount),#para(obj.eduId)
        )
    #end
  #end

  ##信息填报内容批量删除（郭盈）
  #sql("batchDelete")
    UPDATE #(tableName) SET ds_deleted = '1' WHERE #(pidKey) = #para(pidValue) AND #(queryKey) LIKE CONCAT('%', #para(queryValue), '%')
  #end

  ##信息填报内容批量删除子表（郭盈）
  #sql("batchDeleteSublist")
    UPDATE `situation_tbrw_fill_scientific_decisionconsulting_instruction` SET ds_deleted = '1'
      WHERE `situation_tbrw_fill_scientific_decisionconsulting_id` IN
        (SELECT `situation_tbrw_fill_scientific_decisionconsulting_id` FROM `situation_tbrw_fill_scientific_decisionconsulting` WHERE #(pidKey) = #para(pidValue) AND #(queryKey) LIKE '%#(queryValue)%')
  #end

  #sql("findExistList")
        SELECT
            situation_tbrw_fill_education_teaching_base_id AS situationTbrwFillEducationTeachingBaseId,
            base_name AS baseName,
            base_address AS baseAddress,
            base_type_text AS baseTypeText,
            base_type_value AS baseTypeValue,
            base_id AS baseId,
            edu_id AS eduId
        FROM
            situation_tbrw_fill_education_teaching_base
        WHERE
                edu_id = #para(eudId)
          AND ds_deleted = 0
  #end


  #sql("delTeachingBase")
        UPDATE  situation_tbrw_fill_education_teaching_base SET ds_deleted = 1
        WHERE
                situation_tbrw_fill_education_teaching_base_id = #para(id)
  #end
  #sql("delPublications")
        UPDATE  situation_tbrw_fill_scientific_publications SET ds_deleted = 1
        WHERE
                situation_tbrw_fill_scientific_publications_id = ?
  #end

  ##思想引领内容批量删除(严子龙)
  #sql("delSiXiang")
        UPDATE situation_tbrw_fill_scientific_thoughtslead SET ds_deleted = '1'
  #end
#end