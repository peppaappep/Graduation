#namespace("school.situation.tbrw.sql.NoticeFillTask")
  #sql("selectByNoticeId")
    SELECT
        situation_tbrw_notice_id,
        ds_order,
        fill_project_id,
        situation_tbrw_notice_fillTask_id AS _id,
        situation_tbrw_notice_fillTask_id,
        fillProject_text,
        fillProject_value,
        completeStatus_value,
        completeStatus_text,
        DATE_FORMAT( ds_update_time, '%Y-%m-%d %H:%i:%s' ) AS ds_update_time,
        ds_unit_id
    FROM
        situation_tbrw_notice_fillTask
    WHERE
        situation_tbrw_notice_id = #para(noticeId)
        AND ds_deleted = 0
  #end

  #sql("selectTeamBuildSubItemNum")
    SELECT
    CONCAT( mold_text, type_text ) AS `name`,
	COUNT( type_value ) AS num
        FROM
            situation_tbrw_fill_team_building_mobility
        WHERE
            situation_tbrw_fill_team_building_id = #para(id)

            AND ds_deleted = 0
        GROUP BY
            type_value,
            type_text,
            mold_value,
            mold_text UNION
        SELECT
            part_time_type_text AS NAME,
            COUNT( part_time_type_value ) AS num
        FROM
            situation_tbrw_fill_team_building_part_time_teacher
        WHERE
            situation_tbrw_fill_team_building_id = #para(id)

            AND ds_deleted = 0
        GROUP BY
            part_time_type_text,
            part_time_type_value
  #end

  #sql("findFillTaskId")
    SELECT DISTINCT
	( n.situation_tbrw_notice_id )
    FROM
        situation_tbrw_notice n
        LEFT JOIN situation_tbrw_notice_filltask t ON n.situation_tbrw_notice_id = t.situation_tbrw_notice_id
    WHERE
        n.ds_deleted = 0
        AND t.ds_deleted = 0
        AND n.situation_notice_report_manage_id = #para(sId)
        AND n.dsfa_oua_unit_id = #para(unitId)
      #end

 #sql("findNoticeId")
      SELECT
            situation_tbrw_notice_id AS noticeId
        FROM
            situation_tbrw_notice_filltask
        WHERE
            situation_tbrw_notice_fillTask_id = #para(fillTaskID)
      #end

  #sql("findFillProjectId")
        SELECT
            fillProject_text,
            fill_project_id
        FROM
            situation_tbrw_notice_filltask
        WHERE
            situation_tbrw_notice_id = #para(noticeId)
            AND ds_deleted = 0
            ORDER BY  ds_order ASC;
  #end

  #sql("selectLeaderShipSubItemNum")
        SELECT
            '党校校长或行政学院（校）长到校调研指导工作的次数' AS `name`,
            COUNT( 1 ) AS num
        FROM
            situation_tbrw_fill_leadership AS leadership
            LEFT JOIN situation_tbrw_fill_leadership_partyschool AS partyschool ON leadership.situation_tbrw_fill_leadership_id = partyschool.leadership_id
        WHERE
            leadership.situation_tbrw_fill_leadership_id = #para(id)
            AND leadership.ds_deleted = 0
            AND partyschool.ds_deleted = 0 UNION ALL
        SELECT
            '党委政府研究党校（行院、校）工作或听取汇报的次数' AS `name`,
             COUNT( 1 ) AS num
        FROM
            situation_tbrw_fill_leadership AS leadership
            LEFT JOIN situation_tbrw_fill_leadership_governmentnumber AS governmentnumber ON leadership.situation_tbrw_fill_leadership_id = governmentnumber.leadership_id
        WHERE
            leadership.situation_tbrw_fill_leadership_id = #para(id)
            AND leadership.ds_deleted = 0
            AND governmentnumber.ds_deleted = 0 UNION ALL
        SELECT
            '党委领导班子成员到党校讲课的次数' AS `name`,
            COUNT( 1 ) AS num
        FROM
            situation_tbrw_fill_leadership AS leadership
            LEFT JOIN situation_tbrw_fill_leadership_leadernumber AS leadernumber ON leadership.situation_tbrw_fill_leadership_id = leadernumber.leadership_id
        WHERE
            leadership.situation_tbrw_fill_leadership_id = #para(id)
            AND leadership.ds_deleted = 0
            AND leadernumber.ds_deleted = 0 UNION ALL
        SELECT
            '党校是否有中长期发展规划' AS `name`,
             COUNT( 1 ) AS num
        FROM
            situation_tbrw_fill_leadership AS leadership
            LEFT JOIN situation_tbrw_fill_leadership_partyschoolplan AS partyschoolplan ON leadership.situation_tbrw_fill_leadership_id = partyschoolplan.leadership_id
        WHERE
            leadership.situation_tbrw_fill_leadership_id = #para(id)
            AND leadership.ds_deleted = 0
            AND partyschoolplan.ds_deleted =0
  #end

  #sql("selectEducationmLongTrainPlanSubItemNum")
         SELECT
            '中长期干部教育培训规划' AS `name`,
            COUNT( 1 ) AS num
        FROM
            situation_tbrw_fill_education AS education
            LEFT JOIN situation_tbrw_fill_education_mlongtrainplan AS mlongtrainplan ON education.situation_tbrw_fill_education_id = mlongtrainplan.edu_id
        WHERE
            education.situation_tbrw_fill_education_id = #para(id)
            AND education.ds_deleted = 0
            AND mlongtrainplan.ds_deleted = 0
  #end

  #sql("selectEducationFormNumberSubItemNum")
         SELECT
            '党性教育的形式' AS `name`,
            COUNT( 1 ) AS num
        FROM
            situation_tbrw_fill_education AS education
            LEFT JOIN situation_tbrw_fill_education_eduformnumber AS eduformnumber ON education.situation_tbrw_fill_education_id = eduformnumber.edu_id
        WHERE
            education.situation_tbrw_fill_education_id = #para(id)
            AND education.ds_deleted = 0
            AND eduformnumber.ds_deleted = 0
  #end

  #sql("selectEducationClassInfoSubItemNum")
        SELECT
            classinfo.classType_value as `name`,
            COUNT(classinfo.classType_value ) AS num
        FROM
            situation_tbrw_fill_education AS education
            LEFT JOIN situation_tbrw_fill_education_classinfo AS classinfo ON education.situation_tbrw_fill_education_id = classinfo.edu_id
        WHERE
            education.situation_tbrw_fill_education_id = #para(id)
            AND education.ds_deleted = 0
            AND classinfo.ds_deleted = 0
            GROUP BY
            classinfo.classType_value
  #end

  #sql("selectEducationTeachingBaseSubItemNum")
        SELECT
           base_type_text AS `name`,
          count(*) AS `num`
        FROM situation_tbrw_fill_education_teaching_base
        WHERE ds_deleted='0' AND edu_id=#para(id)
        GROUP BY base_type_text
  #end




  #sql("selectScientificArticleSubItemNum")
        SELECT
            '文章' AS `name`,
            COUNT( 1 ) AS num
        FROM
            situation_tbrw_fill_scientific AS scientific
            LEFT JOIN situation_tbrw_fill_scientific_article AS article ON scientific.situation_tbrw_fill_scientific_id = article.scientific_id
        WHERE
            scientific.situation_tbrw_fill_scientific_id = #para(id)
            AND scientific.ds_deleted = 0
            AND article.ds_deleted = 0
  #end

 #sql ("selectScientificPublicationsSubItemNum")
        SELECT
            '发行刊物' AS `name`,
            COUNT( 1 ) AS num
        FROM
            situation_tbrw_fill_scientific AS scientific
            LEFT JOIN situation_tbrw_fill_scientific_publications AS publications ON scientific.situation_tbrw_fill_scientific_id = publications.scientific_id
        WHERE
            scientific.situation_tbrw_fill_scientific_id = #para(id)
            AND scientific.ds_deleted = 0
            AND publications.ds_deleted = 0
 #end



  #sql ("selectScientificAwardSubItemNum")
  	SELECT
				'research_county_sum' AS `name`,
				count(*) AS `num`
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_award AS award ON scientific.situation_tbrw_fill_scientific_id = award.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND scientific.ds_deleted = 0
        AND award.ds_deleted = 0
				AND awardRank_value='COUNTY'
union all
	SELECT
				'other_sum' AS `name`,
				count(*) AS `num`
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_award AS award ON scientific.situation_tbrw_fill_scientific_id = award.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND scientific.ds_deleted = 0
        AND award.ds_deleted = 0
				AND awardRank_value='OTHER'
union all
		SELECT
				'research_sum' AS `name`,
				count(*) AS `num`
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_award AS award ON scientific.situation_tbrw_fill_scientific_id = award.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND scientific.ds_deleted = 0
        AND award.ds_deleted = 0
union all
		SELECT
				'COUNTRYsum' AS `name`,
				count(*) AS `num`
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_award AS award ON scientific.situation_tbrw_fill_scientific_id = award.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND scientific.ds_deleted = 0
        AND award.ds_deleted = 0
				AND awardRank_value='COUNTRY'
union all
		SELECT
				'PROVINCEsum' AS `name`,
				count(*) AS `num`
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_award AS award ON scientific.situation_tbrw_fill_scientific_id = award.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND scientific.ds_deleted = 0
        AND award.ds_deleted = 0
				AND awardRank_value='PROVINCE'
union all
		SELECT
				'hallsum' AS `name`,
				count(*) AS `num`
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_award AS award ON scientific.situation_tbrw_fill_scientific_id = award.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND award.ds_deleted = 0
				AND awardRank_value='INTERNAL'
union all
    SELECT
				any_value(CONCAT(awardRank_value,awardLevel_value)) AS `name`,
        count(*) AS `num`
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_award AS award ON scientific.situation_tbrw_fill_scientific_id = award.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND scientific.ds_deleted = 0
        AND award.ds_deleted = 0
				AND (awardRank_value ='COUNTRY'
				OR awardRank_value ='PROVINCE'
				OR awardRank_value ='INTERNAL')
    GROUP BY awardRank_value,awardLevel_value
  #end

 #sql("selectScientificSubjectSubItemNum")
    SELECT
        subjectresearch.projectLevel_value AS `name`,
        COUNT( subjectresearch.projectLevel_value ) AS num
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_subjectresearch AS subjectresearch ON scientific.situation_tbrw_fill_scientific_id = subjectresearch.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND scientific.ds_deleted = 0
        AND subjectresearch.ds_deleted = 0
    GROUP BY
        subjectresearch.projectLevel_value
    UNION ALL
	SELECT
        'SUM' AS `name`,
        COUNT(1) AS num
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_subjectresearch AS subjectresearch ON scientific.situation_tbrw_fill_scientific_id = subjectresearch.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id = #para(id)
        AND scientific.ds_deleted = 0
        AND subjectresearch.ds_deleted = 0
 #end

#sql("selectScientificDecisionSubItemNum")
    SELECT
        '期数' AS `name`,
        COUNT( 1 ) AS num
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_decisionconsulting AS decisionconsulting ON scientific.situation_tbrw_fill_scientific_id = decisionconsulting.scientific_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id =  #para(id)
        AND scientific.ds_deleted = 0
        AND decisionconsulting.ds_deleted = 0 UNION ALL
    SELECT
        '批次总人数' AS `name`,
        COUNT( 1 ) AS num
    FROM
        situation_tbrw_fill_scientific AS scientific
        LEFT JOIN situation_tbrw_fill_scientific_decisionconsulting AS decisionconsulting ON scientific.situation_tbrw_fill_scientific_id = decisionconsulting.scientific_id
        LEFT JOIN situation_tbrw_fill_scientific_decisionconsulting_instruction AS instruction ON decisionconsulting.situation_tbrw_fill_scientific_decisionconsulting_id = instruction.situation_tbrw_fill_scientific_decisionConsulting_id
    WHERE
        scientific.situation_tbrw_fill_scientific_id =  #para(id)
        AND scientific.ds_deleted = 0
        AND decisionconsulting.ds_deleted = 0
        AND instruction.ds_deleted = 0 UNION ALL
    SELECT
        '批示总篇数' AS `name`,
        COUNT( 1 ) AS num
    FROM
        (
        SELECT
            COUNT( instruction.situation_tbrw_fill_scientific_decisionConsulting_id ) AS number
        FROM
            situation_tbrw_fill_scientific AS scientific
            LEFT JOIN situation_tbrw_fill_scientific_decisionconsulting AS decisionconsulting ON scientific.situation_tbrw_fill_scientific_id = decisionconsulting.scientific_id
            LEFT JOIN situation_tbrw_fill_scientific_decisionconsulting_instruction AS instruction ON decisionconsulting.situation_tbrw_fill_scientific_decisionconsulting_id = instruction.situation_tbrw_fill_scientific_decisionConsulting_id
        WHERE
            scientific.situation_tbrw_fill_scientific_id =  #para(id)
            AND scientific.ds_deleted = 0
            AND decisionconsulting.ds_deleted = 0
            AND instruction.ds_deleted = 0
        GROUP BY
            instruction.situation_tbrw_fill_scientific_decisionConsulting_id
        HAVING
            number > 0
        ) A
  #end

  #sql("selectExcellentCourSubItemNum")
    SELECT
           awardrank_text AS `name`,
           count(*) AS `num`
    FROM situation_tbrw_fill_education_excellentcourprize
    WHERE ds_deleted='0' AND eduid=#para(id)
    GROUP BY awardrank_text

  #end

    #sql("selectUnMainClaSubItemNum")
	SELECT
           classtype_value AS classtypevalue,
				  count(*) AS termnum,
		  sum(peoplecount) AS peoplenum
    FROM situation_tbrw_fill_education_unmainclass
    WHERE ds_deleted='0' AND eduid=#para(id)
    GROUP BY classtype_value

  #end

      #sql("selectMainClaSubItemNum")
	SELECT
           classtype_value AS classtypevalue,
				  count(*) AS termnum,
		  sum(peoplecount) AS peoplenum
    FROM situation_tbrw_fill_education_mainclass
    WHERE ds_deleted='0' AND eduid=#para(id)
    GROUP BY classtype_value

  #end

  #sql ("selectScientificLeadItemNum")
        SELECT
	         COUNT(*) AS num
        FROM
	         situation_tbrw_fill_scientific AS scientific
	    RIGHT JOIN situation_tbrw_fill_scientific_thoughtslead AS thoughtsLead ON scientific.situation_tbrw_fill_scientific_id = thoughtsLead.scientific_id
	          AND thoughtsLead.ds_deleted = '0'
        WHERE
	         scientific.situation_tbrw_fill_scientific_id = #para(id)
	    AND scientific.ds_deleted = '0'
  #end

#end