#namespace("school.situation.bigScreen.sql.organization")

#sql("findOrginzation")
        SELECT
            dqjgid,
            dqjgmc,
            dqjgjb_text,
            dqjgjb_value AS level,
            pid,
            sjjgmc
        FROM
            teas_zzjgcj
        WHERE
            dqjgid = #para(unitId)
            and ds_deleted = 0
#end

#sql ("findSubOrganization")
        SELECT
            dqjgid,
            dqjgmc
        FROM
            teas_zzjgcj
        WHERE
         ds_deleted = 0
         #if(unitId != null && unitId != '')
             and ( pid = #para(unitId) OR dqjgid = #para(unitId) )
         #end
         #if(unitId == null || unitId == '')
           and  dqjgjb_value in (1,2)
         #end
         ORDER BY dqjgjb_value ASC
#end

#sql ("findProvincePartySchoolUnitId")
         SELECT
            dqjgid,
            dqjgmc
         FROM
            teas_zzjgcj
         WHERE
            dqjgjb_value = 1 and ds_deleted = 0
#end

#sql ("findLevelByUnitId")
        SELECT
            dqjgjb_value AS level
        FROM
            teas_zzjgcj
        WHERE
            dqjgid = #para(unitId)
            and ds_deleted = 0

#end

#sql("statisticsSchool")
        SELECT
            any_value(dqjgjb_text) AS levelName,
            count(dqjgjb_value) AS levelSum
        FROM
            teas_zzjgcj
        WHERE
            #if(statisticsTyp == 1)
                     	dqjgjb_value >1 and ds_deleted = 0
                        GROUP BY dqjgjb_value , dqjgjb_text
            #end
             #if(statisticsTyp == 2)
                     	pid = #para(unitId)
	                    AND ds_deleted = 0
            #end

#end

#sql ("findCompletedUnit")
        SELECT
            n.unit AS unitName ,
            n.dsfa_oua_unit_id AS unitId,
            any_value(z.dqjgjb_text) AS levelName,
            any_value(z.dqjgjb_value) AS levelValue,
            any_value(z.px) AS sort,
            any_value(z.pid) AS pid,
            any_value(z.sjjgmc) AS parentUnitName
        FROM
            situation_tbrw_notice AS n
            LEFT JOIN situation_tbrw_notice_filltask AS f ON n.situation_tbrw_notice_id = f.situation_tbrw_notice_id
            LEFT JOIN teas_zzjgcj z ON n.dsfa_oua_unit_id = z.dqjgid
        WHERE
            n.situation_notice_report_manage_id = ( SELECT situation_notice_report_manage_id FROM situation_notice_report_manage WHERE year_value = #para(years) AND ds_deleted = 0 )
            AND n.taskStatus_value = 'IN'
            AND n.ds_deleted = 0
            AND f.ds_deleted=0
			AND f.completeStatus_value='Y'
            #if(statisticsTyp != 1)
            AND ( z.pid = #para(unitId) OR z.dqjgid = #para(unitId) )
            #end
            AND z.ds_deleted = 0
            AND z.dqjgjb_value > 1
        GROUP BY
            n.dsfa_oua_unit_id,
            n.unit
              ORDER BY
            levelValue,sort
#end


#sql ("findAllOrganization")
        SELECT
            dqjgid,
            dqjgmc
        FROM
            teas_zzjgcj
        WHERE
             ds_deleted = 0
             #if(unitId != null && unitId != '')
                and (  pid = #para(unitId) OR dqjgid = #para(unitId) )
             #end
         ORDER BY px ASC
#end

#sql("loadOrganizationTree")
        SELECT
            pid AS parentUnitId,
            sjjgmc AS parentUnitName,
            dqjgid AS unitId,
            dqjgmc AS unitName,
            dqjgjb_value AS level
        FROM
            teas_zzjgcj
        WHERE
             ds_deleted = 0
             #if(unitId != null && unitId != '')
                and dqjgid = #para(unitId)
             #end
              #if(unitId == null || unitId == '')
                and dqjgjb_value = 1
             #end
        ORDER BY
            px
#end


#sql("loadSubCityOrganizations")
        SELECT
            pid AS parentUnitId,
            sjjgmc AS parentUnitName,
            dqjgid AS unitId,
            dqjgmc AS unitName,
            dqjgjb_value AS level
        FROM
            teas_zzjgcj
        WHERE
             ds_deleted = 0
             and pid = #para(unitId)
        ORDER BY
            px
#end

#sql("loadSubAllOrganizations")
        SELECT
            pid AS parentUnitId,
            sjjgmc AS parentUnitName,
            dqjgid AS unitId,
            dqjgmc AS unitName,
            dqjgjb_value AS level
        FROM
            teas_zzjgcj
        WHERE
             ds_deleted = 0
             and dqjgjb_value in (2,3)
        ORDER BY
            px
#end

#end