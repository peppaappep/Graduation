/**
 * "files": ["teas/hc/teas.js"]  只有红网需要引用teas.js
 * 除红网以外任何的项目都不需要在files引用任何一个js,
 * 红网要引是因为此机制存在时已经配置完了很多页面,为了不影响已配页面所以红网才需要这样引入teas.js;
 * 如果遇到页面控件加载不出来的情况,首先去设计页面选择对应控件组,然后保存页面
 */
/**
 * defaultTheme的值为项目主题色,值为 blue-theme/red-theme/green-theme
 * 例如在红网项目应该设置为:red-theme
 */
/**
 * moreButtonOpenForClick 更多按钮是否点击展开,否则为鼠标移入展开
 */
var dsf,options;
! function(dsf) {
	if (dsf && !dsf.extend) {
		dsf.extend = function(namespace, _module) {
			if (dsf[namespace]) {
				throw "模块名称已经存在";
			}
			dsf[namespace] = _module;
		}
	}
	dsf.extend("config", {
		"webRoot": "/dsfa/",
		"files": [],
		"defaultTheme": "red-theme",
		"abc":[
			{"id":"0"}
		],
		"kw": {
			"id": "_id",
			"order": "ds_order",
			"deleted": "ds_deleted",
			"unitid": "ds_unit_id",
			"createtime": "ds_create_time",
			"updatetime": "ds_update_time",
			"updateusername": "ds_update_user_name",
			"updateuserid": "ds_update_user_id",
			"createusername": "ds_create_user_name",
			"createuserid": "ds_create_user_id"
		},
		"local": {
			"mergeCourse": "合班课"
		},
		"moreButtonOpenForClick": false
    });
    if(!$.isEmptyObject(options)){
        dsf.config.options = options
	}
}(dsf || (dsf = {}))
