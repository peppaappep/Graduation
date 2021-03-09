! function() {
	page.event.on("loaded", function(args) {
		//页面初始化完成
		page.getControl("rmlist").event.on("row_buttonbar_click", function(args) {
			if (args.actionName == "weihu") {
				if (args.data["dsfa_rm.type"].value == "0") {
					window.location.href = "rmlist.html?pid=" + args.data["_id"] + "&ppath=" + args.data["dsfa_rm.path"];
				} else if (args.data["dsfa_rm.type"].value == "1") {
					var path = args.data["dsfa_rm.path"];
					var code = args.data["dsfa_rm.code"];
					var index = path.lastIndexOf("/");
					var folderPath = path.substring(0, index);
					var arr = folderPath.split("/");
					var b = arr[0];
					var m = [];
					for (var i = 1; i < arr.length; i++) {
                        m.push(arr[i]);
                    }
					dsf.layer.openWindow("../../pd/views/pd.html?B=" + b + "&M=" + (m.join(".")) + "&pname=" + code + "&title=" +
						args.data["dsfa_rm.name"])
				} else if (args.data["dsfa_rm.type"].value == "2") {
					window.open("../ctl/views/edit.html?id=" + args.data["_id"]);
				} else if (args.data["dsfa_rm.type"].value == "3") {
					var path = args.data["dsfa_rm.path"];
					path = path.replace(/\//g, ".");
					window.open("../../mm/views/mmlist.html?path=" + path + "&name=" + args.data["dsfa_rm.name"] + "&code=" + args
						.data["dsfa_rm.code"] + "&full_code=" + args.data["dsfa_rm.ID"]);
				} else if (args.data["dsfa_rm.type"].value == "4") {
					dsf.layer.openWindow("../../../wf/views/flow_index.html?id=" + args.data["_id"])
				} else if (args.data["dsfa_rm.type"].value == "5") {
					window.open("../dict/views/dictedit.html?id=" + args.data["_id"]);
				} else if (args.data["dsfa_rm.type"].value == "7") {
					//模板保存
					var path = args.data["dsfa_rm.path"];
					var code = args.data["dsfa_rm.code"];
					var index = path.lastIndexOf("/");
					var folderPath = path.substring(0, index);
					var arr = folderPath.split("/");
					var b = arr[0];
					var m = [];
					for (var i = 1; i < arr.length; i++) {
                        m.push(arr[i]);
                    }
					dsf.layer.openWindow("../../pd/views/pd.html?tpl=1&B=" + b + "&M=" + (m.join(".")) + "&pname=" + code);
					// window.open("../../pd/views/pd.html?tpl=1&B=" + b + "&M=" + (m.join(".")) + "&pname=" + code );
				} else if (args.data["dsfa_rm.type"].value == "8") {
					dsf.layer.openWindow("../../dbsource/views/edit.html?id=" + args.data["_id"])
				} else if (args.data["dsfa_rm.type"].value == "9") {
					var path = args.data["dsfa_rm.path"];
					var code = args.data["dsfa_rm.code"];
					var index = path.lastIndexOf("/");
					var folderPath = path.substring(0, index);
					var arr = folderPath.split("/");
					var b = arr[0];
					var m = [];
					for (var i = 1; i < arr.length; i++) {
                        m.push(arr[i]);
                    }
					dsf.layer.openWindow("../../pd/views/pd.html?pt=QIPage&B=" + b + "&M=" + (m.join(".")) + "&pname=" + code +
						"&title=" + args.data["dsfa_rm.name"])
				} else if (args.data["dsfa_rm.type"].value == "10") {
					window.open("../../pd/views/seatDesign.html?id=" + args.data["_id"]);
				}  else if (args.data["dsfa_rm.type"].value == "11") {
					window.open("../../pd/views/printingDesign.html?id=" + args.data["_id"]);
				}
			} else if (args.actionName == "open") {
				if (args.data["dsfa_rm.type"].value == "1" || args.data["dsfa_rm.type"].value == "9") {
					var path = args.data["dsfa_rm.path"];
					var arr = path.split("/");
					var folder = arr.slice(0, arr.length - 1);
					var url = dsf.url.getWebPath(folder.join("/") + "/views/" + arr[arr.length - 1] + ".html");
					dsf.layer.openWindow(url)
					// window.open(url);
				} else {
					dsf.layer.message("该资源不是一个页面", false)
				}
			}
		})

		// page.getControl("rmlist").event.on(EventEmun.DataGridEvent.ROWDBLCLICK, function(args, def) {
		//     if (args["dsfa_rm.type_value"] == "1") {
		//         var path = args["dsfa_rm.path"];
		//         var index = path.lastIndexOf("/");
		//         var folderPath = path.substring(0, index);
		//         var pname = path.substr(index + 1);
		//         var arr = folderPath.split("/");
		//         var b = arr[0];
		//         var m = arr[1];
		//         window.open("../../pd/views/pd.html?B=" + b + "&M=" + m + "&pname=" + pname)
		//     }
		//     else if(args["dsfa_rm.type_value"] == "3"){
		//         var path = args["dsfa_rm.path"];
		//         var index = path.lastIndexOf("/");
		//         var folderPath = path.substring(0, index);
		//         folderPath=folderPath.replace(/\//g,".");
		//         window.open("../../mm/views/mmlist.html?path="+folderPath);
		//     }
		// });

	});

}();
