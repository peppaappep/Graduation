#namespace("com.school.situation.infoMaintain.sql.schoolInfo")

#sql ("findInfoId")
        SELECT
            situation_xyxxwh_schoolinfomaintain_id AS id
        FROM
            situation_xyxxwh_schoolinfomaintain
        WHERE
            ds_deleted = 0
            AND dsfa_oua_unit_id = #para(unitId)
#end

#sql ("loadHomeInfo")
       SELECT
            introduction,
            aerial_view AS aerialView,
            school_gate_view AS schoolGateView,
            facilities_view AS facilitiesView,
            logistics_support AS logisticsSupport
        FROM
            situation_xyxxwh_schoolinfomaintain
        WHERE
            ds_deleted = 0
            AND dsfa_oua_unit_id = #para(unitId)
#end
#end