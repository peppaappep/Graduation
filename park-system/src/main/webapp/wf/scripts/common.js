/**
 * Page: 此js主要作为封装一些平台的方法
 */
// 获取url参数
function getUrlParam(key) {
	return dsf.url.queryString(key);
}

// 完整的地址
function getWebPath(path, type) {
	type = type || (isMyTest ? false : true);
	if (type) {
		return dsf.url.getWebPath(path);
	} else {
		return "http://192.168.0.7:8021/dsfa/" + path;
	}
}
// 信息提示框
function layer_message(str, type) {
	dsf.layer.message(str, type);
}

function loadding() {
	return dsf.layer.loadding();
}

function loadding_close(index) {
	return dsf.layer.close(index);
}

// 弹出框
function OpenDialog(config, callback) {
	// 右侧属性弹出框
	if (config.href) {
		dsf.layer.openDialog({
			title: config.title || config.name,
			content: config.href,
			args: config,
			area: [(config.width || 600) + 'px', (config.height || 500) + 'px'],
			btn: [{
				"text": "确定",
				"handler": function(index, layero) {
					var result = layero.find("iframe").get(0).contentWindow.getDialogResult();
					if(result && callback){
						callback(result);
					}else{
						return false;
					}
				}
			}, {
				"text": "取消",
				"handler": function(index, layero) {
					return;
				}
			}]
		});
	} else {
		dsf.layer.openDialog(config);
	}

}
